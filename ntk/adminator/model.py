#!/usr/bin/python -tt
from utils import object_to_dict

__all__ = ['Model']

def autoflush(func):
    def decorator(self, *args, **kwargs):
        retval = func(self, *args, **kwargs)
        self.db.flush()
        return retval
    return decorator


class Model(object):
    def __init__(self, manager):
        # Stores DB connection for later use.
        self.manager = manager
        self.db = manager.db
        # Include relations for list view and single item view
        self.include_relations = {'item': [], 'list': []}
        # Pkey
        self.pkey = 'id'
        # Default schema
        self.schema = 'network'
        # Call customized init
        self.init()

    def init(self):
        pass

    def list(self):
        items = []
        print self.e().all()
        for item in self.e().all():
            item = object_to_dict(item, include=self.include_relations.get('list'))
            items.append(item)
        return items

    def get_item(self, key):
        item = self.e().filter_by(**{self.pkey: key}).one()
        item = object_to_dict(item, include=self.include_relations.get('item'))
        return item

    @autoflush
    def update(self, item):
        assert item.get(self.pkey) is not None, 'Primary key is not set'
        for k,v in item.iteritems():
            entity = self.e().filter_by(**{self.pkey: item.get(self.pkey)}).one()
            setattr(entity, k, v)
        return object_to_dict(entity)

    @autoflush
    def replace(self, item):
        if item.get(self.pkey) is not None:
            self.e().filter_by(**{self.pkey: item[self.pkey]}).delete()
        return object_to_dict(self.insert(item))

    @autoflush
    def insert(self, item):
        return object_to_dict(self.e().insert(**item))

    @autoflush
    def delete(self, key):
        rows = self.e().filter_by(**{self.pkey: key}).delete()
        return {'deleted': rows}

    def e(self, table_name=None):
        """ Returns this models SQLSoup entity """
        if table_name is None:
            table_name = self.table_name
        return self.db.entity(table_name, self.schema)

    def relate(self, name, entity):
        return self.e().relate(name, entity)

# vim:set sw=4 ts=4 et:
# -*- coding: utf-8 -*-

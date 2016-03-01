#!/usr/bin/python -tt
from utils import object_to_dict
from sqlalchemy.orm import class_mapper

__all__ = ['Model']

def autoflush(func):
    def decorator(self, *args, **kwargs):
        self.db.rollback()
        retval = func(self, *args, **kwargs)
        self.db.commit()
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

    @autoflush
    def list(self):
        items = []
        for item in self.e().all():
            item = object_to_dict(item, include=self.include_relations.get('list'))
            items.append(item)
        return items

    @autoflush
    def get_item(self, key):
        item = self.e().filter_by(**{self.pkey: key}).one()
        item = object_to_dict(item, include=self.include_relations.get('item'))
        return item

    @autoflush
    def update(self, item):
        assert item.get(self.pkey) is not None, 'Primary key is not set'
        entity = self.e().filter_by(**{self.pkey: item.get(self.pkey)}).one()
        for k,v in item.iteritems():
            if k in self.get_relationships() or k == self.pkey:
                continue
            setattr(entity, k, v)
        self.db.commit()
        self.db.flush()
        return object_to_dict(entity)

    def replace(self, item):
        if item.get(self.pkey) is not None:
            self.e().filter_by(**{self.pkey: item[self.pkey]}).delete()
        return object_to_dict(self.insert(item))

    @autoflush
    def insert(self, item):
        newVal = {}
        for k,v in item.iteritems():
            if k not in self.get_relationships() and v is not None:
                newVal[k] = v
        e = self.e().insert(**newVal)
        self.db.commit()
        self.db.flush()
        return object_to_dict(e)

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

    def get_relationships(self):
        mapper = class_mapper(self.e())
        return mapper.relationships.keys()

# vim:set sw=4 ts=4 et:
# -*- coding: utf-8 -*-

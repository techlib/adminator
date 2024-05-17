#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

from sqlmodel import Session, select, text, delete

from adminator.utils import object_to_dict
from sqlalchemy.orm import class_mapper

__all__ = ['Model']

class Model(object):
    def __init__(self, manager):
        # Stores DB connection for later use.
        self.manager = manager
        self.db = manager.db
        self.db_entity = None
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
        for item in self.db().exec(select(self.db_entity).order_by(text(self.pkey))):
            items.append(object_to_dict(item, include=self.include_relations.get('list')))
        return items

    def get_item(self, key):
        item = self.db().exec(select(self.db_entity).filter_by(**{self.pkey: key})).one()
        item = object_to_dict(item, include=self.include_relations.get('item'))
        return item

    def update(self, item):
        assert item.get(self.pkey) is not None, 'Primary key is not set'

        stm = select(self.db_entity).filter_by(**{self.pkey: item.get(self.pkey)})
        entity = self.db().exec(stm).one()
        for k,v in item.items():
            if k in self.get_relationships() or k == self.pkey:
                continue
            setattr(entity, k, v)
        self.db().commit()
        return object_to_dict(entity)

    def replace(self, item):
        if item.get(self.pkey) is not None:
            self.db().exec(delete(self.db_entity).filter_by(**{self.pkey: item[self.pkey]}))
        return object_to_dict(self.insert(item))

    def insert(self, item):
        newVal = {}
        for k,v in item.items():
            if k not in self.get_relationships() and v is not None:
                newVal[k] = v
        e = self.db_entity(**newVal)
        self.db().add(e)
        self.db().commit()
        return object_to_dict(e)

    def delete(self, key):
        row = self.db().exec(select(self.db_entity).filter_by(**{self.pkey: key})).one()
        self.db().delete(row)
        self.db().commit()
        return {'deleted': object_to_dict(row, include=[])}

    def e(self, table_name=None):
        """ Returns this models SQLSoup entity """

        if table_name is None:
            table_name = self.table_name
        #return self.db_base.classes[table_name]
        #return self.db().entity(table_name, self.schema)

    def relate(self, name, entity):
        return None
        return self.e().relate(name, entity)

    def get_relationships(self):
        mapper = class_mapper(self.db_entity)
        return mapper.relationships.keys()

# vim:set sw=4 ts=4 et:

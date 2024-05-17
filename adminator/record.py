#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

from adminator.model import Model
from adminator.utils import object_to_dict
from sqlmodel import text, select
from .db_entity.dns import Record

class RecordModel(Model):
    def init(self):
        # PDNS schema
        self.schema = 'pdns'
        self.table_name = 'records'
        self.pkey = 'id'
        self.db_entity = Record


    def insert(self, data):
        newVal = {}
        for k,v in data.items():
            if k not in self.get_relationships():
                if v == '': v = None
                newVal[k] = v

        e = Record(**newVal)
        self.db.add(e)
        self.db.commit()

    def patch(self, data):
        assert data.get(self.pkey) is not None, 'Primary key is not set'

        id = data[self.pkey]
        item = self.db().exec(select(self.db_entity).filter_by(**{self.pkey: id})).one()

        for k,v in data.items():
            if k in self.get_relationships() or k == self.pkey:
                continue
            if v == '': v = None
            setattr(item, k, v)

        self.db.commit()

        return object_to_dict(item)


# vim:set sw=4 ts=4 et:

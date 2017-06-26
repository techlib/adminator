#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

from adminator.model import Model
from adminator.utils import object_to_dict

__all__ = ['Record']

class Record(Model):
    def init(self):
        # PDNS schema
        self.schema = 'pdns'
        self.table_name = 'records'
        self.pkey = 'id'

    def list(self):
        records = []
        for record in self.db.execute('select * from pdns.records').fetchall():
            records.append(dict(zip(record.keys(), record.values())))
        return records

    def insert(self, data):
        newVal = {}
        for k,v in data.items():
            if k not in self.get_relationships():
                if v == '': v = None
                newVal[k] = v

        e = self.e().insert(**newVal)
        self.db.session.flush()

        self.db.commit()

    def patch(self, data):
        assert data.get(self.pkey) is not None, 'Primary key is not set'

        id = data[self.pkey]
        item = self.e().filter_by(**{self.pkey: id}).one()

        for k,v in data.items():
            if k in self.get_relationships() or k == self.pkey:
                continue
            if v == '': v = None
            setattr(item, k, v)

        self.db.commit()

        return object_to_dict(item)


# vim:set sw=4 ts=4 et:

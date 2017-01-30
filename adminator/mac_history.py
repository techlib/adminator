#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

from adminator.model import Model
from sqlalchemy import Table
from datetime import datetime, timedelta
from psycopg2.extras import Inet

__all__ = ['MacHistory']

def process_value(val):
    if isinstance(val, datetime):
        return val.isoformat()
    if isinstance(val, timedelta):
        return val.total_seconds()
    elif isinstance(val, Inet):
        return val.addr
    else:
        return val

class MacHistory(Model):
    def init(self):
        self.schema = 'topology'
        self.table_name = 'mac_history'
        self.pkey = 'mac_address'

    def e(self, table_name=None):
        """ Returns this models SQLSoup entity """
        if table_name is None:
            table_name = self.table_name
        # mac_history is view, SQLSoup can't work with views
        try:
            return self.db._cache[table_name]
        except KeyError:
            t = Table(table_name, self.db._metadata, autoload=True)
            return self.db.map(t, primary_key=[t.c.mac_address])

    def list(self):
        query = 'select * from %s.%s' % (self.schema, self.table_name)
        res = []

        for mac_address in self.db.execute(query).fetchall():
            row = dict(zip(mac_address.keys(), mac_address.values()))
            for col in row:
                row[col] = process_value(row[col])
            res.append(row)

        return res

# vim:set sw=4 ts=4 et:

#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

from adminator.model import Model
from sqlalchemy import Table
from datetime import datetime, timedelta
from psycopg2.extras import Inet
from sqlmodel import text


def process_value(val):
    if isinstance(val, datetime):
        return val.isoformat()
    if isinstance(val, timedelta):
        return val.total_seconds()
    elif isinstance(val, Inet):
        return val.addr
    else:
        return val


class MacHistoryModel(Model):
    def init(self):
        self.schema = 'topology'
        self.table_name = 'mac_history'
        # self.table_name = 'last_interface_for_mac_advance'
        self.pkey = 'mac_address'

    def list(self):
        query = text('select * from %s.%s' % (self.schema, self.table_name))
        res = []

        for mac_address in self.db().exec(query):
            row = mac_address._asdict()
            for col in row:
                row[col] = process_value(row[col])
            res.append(row)

        return res

# vim:set sw=4 ts=4 et:

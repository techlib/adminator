#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

from adminator.model import Model
from sqlalchemy import Table

__all__ = ['Connection']


class Connection(Model):
    def init(self):
        self.schema = 'topology'
        self.table_name = 'port_to_port'
        self.pkey = 'src_uuid'

    def e(self, table_name=None):
        """ Returns this models SQLSoup entity """
        if table_name is None:
            table_name = self.table_name
        # port_to_port is view, SQLSoup can't work with views
        try:
            return self.db._cache[table_name]
        except KeyError:
            t = Table(table_name, self.db._metadata, autoload=True)
            return self.db.map(t, primary_key=[t.c.src_uuid])

# vim:set sw=4 ts=4 et:

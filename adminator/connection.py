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

    def list(self):
        query = 'select src_analyzer_group_name, src_name, src_position_on_pp, \
                 src_type, dst_analyzer_group_name, dst_name, dst_position_on_pp, \
                 dst_type from %s.%s' % (self.schema, self.table_name)
        res = []

        for connection in self.db.execute(query).fetchall():
           res.append(dict(zip(connection.keys(), connection.values())))

        return res

# vim:set sw=4 ts=4 et:

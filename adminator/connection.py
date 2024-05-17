#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

from adminator.model import Model
from sqlalchemy import Table
from sqlmodel import text


class ConnectionModel(Model):
    def init(self):
        self.schema = 'topology'
        self.table_name = 'port_to_port'
        self.pkey = 'src_uuid'

    def list(self):
        query = text('select src_analyzer_group_name, src_name, src_position_on_pp, \
                 src_type, dst_analyzer_group_name, dst_name, dst_position_on_pp, \
                 dst_type from %s.%s' % (self.schema, self.table_name))
        res = []

        for connection in self.db().exec(query):
           res.append(connection._asdict())

        return res

# vim:set sw=4 ts=4 et:

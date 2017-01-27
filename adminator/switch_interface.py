#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

from adminator.model import Model
from datetime import datetime, timedelta
from psycopg2.extras import Inet

__all__ = ['SwitchInterface']

def process_value(val):
    # if isinstance(val, datetime):
        # return val.isoformat()
    if isinstance(val, timedelta):
        return str(val)
    elif isinstance(val, Inet):
        return val.addr
    else:
        return val


class SwitchInterface(Model):
    def init(self):
        self.table_name = 'sw_interface'
        # Primary key
        self.pkey = 'uuid'
        # Default schema
        self.schema = 'topology'
        # Related tables
        self.port_table = 'port'
        self.switch_table = 'switch'
        self.pattern_table = 'if_config_pattern'
        self.if_to_pat_table = 'if_to_pattern'

    def list(self):
        query = 'SELECT {1}.uuid, {1}.name, {1}.admin_status, {1}.oper_status, {1}.switch, {1}.vlan, {1}.speed, \
                 {1}.last_change, {2}.last_update, {2}.name AS sw_name, {3}.name AS port_name \
                 FROM {0}.{2}, {0}.{1} LEFT JOIN {0}.{3} \
                 ON {1}.port = {3}.connect_to \
                 WHERE {1}.switch = {2}.uuid'.format(self.schema, self.table_name, self.switch_table, self.port_table)
        res = {}

        # print(query)
        for interface in self.db.execute(query).fetchall():
            row = dict(zip(interface.keys(), interface.values()))
            for col in row:
                row[col] = process_value(row[col])
            row['patterns'] = []
            res[row[self.pkey].int] = row

        query2 ='SELECT {1}.interface, {2}.name FROM {0}.{1}, {0}.{2} \
                WHERE {1}.if_config_pattern = {2}.uuid'.format(self.schema, self.if_to_pat_table, self.pattern_table)
        for pattern in self.db.execute(query2).fetchall():
            row = dict(zip(pattern.keys(), pattern.values()))
            res[row['interface'].int]['patterns'].append(row['name'])

        return list(res.values())

# vim:set sw=4 ts=4 et:
#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

from adminator.model import Model
from datetime import datetime, timedelta
from psycopg2.extras import Inet
from adminator.utils import object_to_dict

__all__ = ['SwitchInterface']


def process_value(val):
    if isinstance(val, datetime):
        return val.isoformat()
    if isinstance(val, timedelta):
        return val.total_seconds()
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
        self.last_interface_for_mac_advance = 'last_interface_for_mac_advance'
        self.last_macs_on_interface_advance = 'last_macs_on_interface_advance'

    def fill_link_status(self, data):
        if data['admin_status'] == 1 and data['oper_status'] == 1:
            data['link_status'] = 'Up'
        elif data['admin_status'] == 1 and data['oper_status'] == 0:
            data['link_status'] = 'Down'
        elif data['admin_status'] == 0 and data['oper_status'] == 0:
            data['link_status'] = 'Adm. down'
        else:
            data['link_status'] = 'Unknown'

    def link_speed_humanize(self, speed):
        if speed is None:
            return None
        if speed >= 1000:
            return '{}G'.format(speed // 1000)
        return '{}M'.format(speed)

    def list(self):
        query = 'SELECT {1}.uuid, {1}.name, {1}.admin_status, {1}.oper_status, {1}.switch, {1}.vlan, {1}.speed, \
                 {1}.last_change, {2}.last_update, {2}.name AS sw_name, {3}.name AS port_name \
                 FROM {0}.{2}, {0}.{1} LEFT JOIN {0}.{3} \
                 ON {1}.port = {3}.connect_to \
                 WHERE {1}.switch = {2}.uuid'.format(self.schema, self.table_name, self.switch_table, self.port_table)
        res = {}

        for interface in self.db.execute(query).fetchall():
            row = dict(zip(interface.keys(), interface.values()))
            for col in row:
                row[col] = process_value(row[col])
            row['patterns'] = []
            res[row[self.pkey].int] = row

        query2 = 'SELECT {1}.interface, {2}.name, {2}.style, {2}.uuid FROM {0}.{1}, {0}.{2} \
                WHERE {1}.if_config_pattern = {2}.uuid'.format(self.schema, self.if_to_pat_table, self.pattern_table)
        for pattern in self.db.execute(query2).fetchall():
            row = dict(zip(pattern.keys(), pattern.values()))
            interface = row.pop('interface')
            res[interface.int]['patterns'].append(row)

        for key, data in res.items():
            if len(data['patterns']) == 0:
                # data['patterns'].append(['Exotic','bad'])
                data['patterns'].append({'name': 'Exotic', 'style': 'bad', 'uuid': None})
            self.fill_link_status(data)
            data['speed_label'] = self.link_speed_humanize(data['speed'])

        return list(res.values())

    def get_item(self, key):
        interface = self.e().get(key)
        item = object_to_dict(interface)

        switch = self.e(self.switch_table).get(interface.switch)
        item['switch'] = object_to_dict(switch)

        if interface.port:
            try:
                port = self.e(self.port_table).filter_by(connect_to=interface.port).one()
                item['port'] = object_to_dict(port)
            except:
                item['port'] = None

        ptrn_query = "SELECT {2}.name, {2}.style, {2}.uuid FROM {0}.{1}, {0}.{2} \
            WHERE {1}.if_config_pattern = {2}.uuid and {1}.interface = '{3}'".format(
            self.schema, self.if_to_pat_table, self.pattern_table, interface.uuid
        )
        item['patterns'] = []
        for pattern in self.db.execute(ptrn_query).fetchall():
            row = dict(zip(pattern.keys(), pattern.values()))
            item['patterns'].append(row)
            # item['patterns'].append([row['name'], row['style']])

        if len(item['patterns']) == 0:
            # item['patterns'].append(['Exotic','bad'])
            item['patterns'].append({'name': 'Exotic', 'style': 'bad', 'uuid': None})

        mac1_query = "SELECT * FROM {0}.{1} where sw_if_uuid = '{2}'".format(
            self.schema, self.last_interface_for_mac_advance, interface.uuid)
        item['last_interface_for_mac'] = []
        for mac in self.db.execute(mac1_query).fetchall():
            row = dict(zip(mac.keys(), mac.values()))
            for col in row:
                row[col] = process_value(row[col])
            item['last_interface_for_mac'].append(row)

        mac2_query = "SELECT * FROM {0}.{1} where sw_if_uuid = '{2}'".format(
            self.schema, self.last_macs_on_interface_advance, interface.uuid)
        item['last_macs_on_interface'] = []
        for mac in self.db.execute(mac2_query).fetchall():
            row = dict(zip(mac.keys(), mac.values()))
            for col in row:
                row[col] = process_value(row[col])
            item['last_macs_on_interface'].append(row)

        self.fill_link_status(item)
        item['speed_label'] = self.link_speed_humanize(item['speed'])

        return item

# vim:set sw=4 ts=4 et:

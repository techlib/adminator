#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

from adminator.model import Model
from adminator.utils import object_to_dict

__all__ = ['Device']

class Device(Model):
    def init(self):
        self.table_name = 'device'
        # Primary key
        self.pkey = 'uuid'
        # Relations
        self.relate('interfaces', self.e('interface'))
        self.relate('users', self.e('user'))
        self.relate('dhcp_options', self.e('option_value'))
        self.include_relations = {'item': ['interfaces', 'dhcp_options', 'users'], 'list': ['users', 'interfaces']}

    def insert(self, data):
        newVal = {}
        for k,v in data.items():
            if k not in self.get_relationships() and v is not None:
                newVal[k] = v

        e = self.e().insert(**newVal)
        self.db.session.flush()

        self.process_relations(e, e.uuid, data)
        self.db.commit()

        return object_to_dict(e)

    def patch(self, data):
        assert data.get(self.pkey) is not None, 'Primary key is not set'

        uuid = data['uuid']
        item = self.e().filter_by(**{self.pkey: uuid}).one()

        for k,v in data.items():
            if k in self.get_relationships() or k == self.pkey:
                continue
            setattr(item, k, v)

        self.process_relations(item, uuid, data)
        self.db.commit()

        return object_to_dict(item)

    def process_relations(self, e, uuid, data):
        if 'interfaces' in data:
            d=self.manager.interface.set_device_interfaces(uuid, data['interfaces'])
            setattr(e, 'interfaces', d)

# vim:set sw=4 ts=4 et:

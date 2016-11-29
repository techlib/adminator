#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

from adminator.utils import object_to_dict
from adminator.model import Model
import ipaddress
import binascii
import re

__all__ = ['Lease4']

class Lease4(Model):
    def init(self):
        self.table_name = 'lease4'
        # Schema
        self.schema = 'kea'
        # Primary key
        self.pkey = 'address'


    def list(self):
        items = []
        for item in self.db.execute("SELECT address, \
                                     encode(client_id, 'hex') as client_id, \
                                     valid_lifetime, \
                                     expire, subnet_id, \
                                     fqdn_fwd, \
                                     fqdn_rev, \
                                     lease4.hostname, \
                                     state, \
                                     encode(hwaddr, 'hex')::macaddr AS hwaddr, \
                                     interface.device, \
                                     device.description, \
                                     \"user\".display_name \
                                    FROM lease4 \
                                    LEFT JOIN interface ON interface.macaddr = encode(hwaddr, 'hex')::macaddr \
                                    LEFT JOIN device ON interface.device = device.uuid \
                                    LEFT JOIN \"user\" ON device.user = \"user\".cn \
                                    ").fetchall():
            obj = (dict(zip(item.keys(), item.values())))

            if obj['address']:
                obj['address'] = str(ipaddress.IPv4Address(obj['address']))

            items.append(obj)

        return items

    def delete(self, key):
        key = int(ipaddress.IPv4Address(key))
        rows = self.e().filter_by(**{self.pkey: key}).delete()
        self.db.commit()
        return {'deleted': rows}




# vim:set sw=4 ts=4 et:

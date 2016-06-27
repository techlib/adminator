#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

from adminator.model import Model

__all__ = ['Lease6']

class Lease6(Model):
    def init(self):
        self.table_name = 'lease6'
        # Schema
        self.schema = 'kea'
        # Primary key
        self.pkey = 'address'


    def list(self):
        items = []
        for item in self.db.execute('select * from kea.lease6').fetchall():
            obj = (dict(zip(item.keys(), item.values())))

            if obj['address']:
                obj['address'] = str(ipaddress.IPv6Address(obj['address']))

            obj['client_id'] = str(obj['client_id'])
            obj['duid'] = str(obj['duid'])
            items.append(obj)

        return items

# vim:set sw=4 ts=4 et:

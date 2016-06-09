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
            if item.address:
                item.address = str(ipaddress.IPv6Address(item.address))
            items.append(dict(zip(record.keys(), record.values())))
        return items

# vim:set sw=4 ts=4 et:

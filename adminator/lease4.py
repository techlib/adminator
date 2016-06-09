#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

from adminator.utils import object_to_dict
from adminator.model import Model
import ipaddress

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
        for item in self.db.execute('select * from kea.lease4').fetchall():
            if item.address:
                item.address = str(ipaddress.IPv4Address(item.address))
            items.append(dict(zip(record.keys(), record.values())))
        return items

    def delete(self, key):
        key = int(ipaddress.IPv4Address(key))
        rows = self.e().filter_by(**{self.pkey: key}).delete()
        self.db.commit()
        return {'deleted': rows}




# vim:set sw=4 ts=4 et:

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
        for item in self.db.execute('select * from kea.lease4').fetchall():
            obj = (dict(zip(item.keys(), item.values())))

            if obj['address']:
                obj['address'] = str(ipaddress.IPv4Address(obj['address']))

            obj['client_id'] = str(obj['client_id'])
            obj['hwaddr'] = binascii.hexlify(bytes(obj['hwaddr'])).decode('ascii')
            obj['hwaddr'] = re.sub(r'([a-f0-9]{2})', '\g<1>:', obj['hwaddr'], flags=re.IGNORECASE)[:17]

            items.append(obj)

        return items

    def delete(self, key):
        key = int(ipaddress.IPv4Address(key))
        rows = self.e().filter_by(**{self.pkey: key}).delete()
        self.db.commit()
        return {'deleted': rows}




# vim:set sw=4 ts=4 et:

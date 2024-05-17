#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

from adminator.utils import object_to_dict
from adminator.model import Model
import ipaddress
import binascii
import re
from .db_entity.dhcp import  Lease4
from sqlmodel import text, delete

__all__ = ['Lease4']

class Lease4Model(Model):
    def init(self):
        self.table_name = 'lease4'
        # Schema
        self.schema = 'kea'
        # Primary key
        self.pkey = 'address'
        self.db_entity = Lease4


    def list(self):
        items = []
        for item in self.db.execute(text("SELECT address, \
                                     encode(client_id, 'hex') as client_id, \
                                     valid_lifetime, \
                                     expire, subnet_id, \
                                     fqdn_fwd, \
                                     fqdn_rev, \
                                     lease4.hostname, \
                                     state, \
                                     COALESCE(NULLIF(ENCODE(lease4.hwaddr, 'hex'), ''), '000000000000')::macaddr AS hwaddr, \
                                     i.device, \
                                     d.description, \
                                     u.display_name \
                                    FROM kea.lease4 \
                                    LEFT JOIN network.interface i ON i.macaddr = COALESCE(NULLIF(encode(hwaddr, 'hex'), ''), '000000000000')::macaddr \
                                    LEFT JOIN network.device d ON i.device = d.uuid \
                                    LEFT JOIN network.\"user\" u ON d.user = u.cn \
                                    ")):

            obj = item._asdict()

            if obj['address']:
                obj['address'] = str(ipaddress.IPv4Address(obj['address']))

            items.append(obj)

        return items

    def delete(self, key):
        key = int(ipaddress.IPv4Address(key))
        self.db().exec(delete(Lease4).filter_by(**{self.pkey: key}))
        self.db.commit()
        return {'deleted': 1}




# vim:set sw=4 ts=4 et:

#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

from adminator.model import Model
from .db_entity.dhcp import Lease6
from sqlmodel import text
import ipaddress

from .utils import object_to_dict


class Lease6Model(Model):
    def init(self):
        self.table_name = 'lease6'
        # Schema
        self.schema = 'kea'
        # Primary key
        self.pkey = 'address'
        self.db_entity = Lease6


    def list(self):
        items = []
        for item in self.db.execute(text('select * from kea.lease6')):
            obj = item._asdict()

            if obj['address']:
                obj['address'] = str(ipaddress.IPv6Address(obj['address']))

            obj['client_id'] = str(obj['client_id'])
            obj['duid'] = str(obj['duid'])
            items.append(obj)

        return items

# vim:set sw=4 ts=4 et:

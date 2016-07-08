#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

from adminator.model import Model
from adminator.utils import object_to_dict

__all__ = ['NetworkAcl']

class NetworkAcl(Model):
    def init(self):
        # Table name
        self.table_name = 'network_acl'
        # Primary key
        self.pkey = ['network', 'role']

    def get_role(self, role):
        res = {}
        for item in self.e().filter_by(**{'role': role}).all():
            res[item.network] = list(item.device_types or [])

        return res

    def patch(self, role, data):
        self.e().filter_by(role=role).delete()

        result = []

        for item in data:
            newVal = {
                'role': role,
                'network': item['network'],
                'device_types': item['device_types']
            }
            result.append(self.e().insert(**newVal))

        self.db.commit()

        return {} #object_to_dict(result)


# vim:set sw=4 ts=4 et:

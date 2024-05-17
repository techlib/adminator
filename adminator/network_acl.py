#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

from adminator.model import Model
from adminator.utils import object_to_dict
from .db_entity.network import NetworkAcl
from sqlmodel import select, delete
class NetworkAclModel(Model):
    def init(self):
        # Table name
        self.table_name = 'network_acl'
        # Primary key
        self.pkey = ['network', 'role']

    def get_role(self, role):
        res = {}
        for item in self.db().exec(select(NetworkAcl).filter_by(**{'role': role})):
            res[str(item.network)] = list(item.device_types or [])

        return res

    def patch(self, role, data):
        self.db().exec(delete(NetworkAcl).filter_by(role=role))

        result = []

        for item in data:
            newVal = {
                'role': role,
                'network': item['network'],
                'device_types': item['device_types']
            }
            newItem = NetworkAcl(**newVal)
            result.append(self.db().add(newItem))

        self.db().commit()

        return {} #object_to_dict(result)


# vim:set sw=4 ts=4 et:

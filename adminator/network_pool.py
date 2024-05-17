#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-
from sqlmodel import select, delete

from adminator.model import Model
from .db_entity.network import NetworkPool

class NetworkPoolModel(Model):
    def init(self):
        self.table_name = 'network_pool'
        # Primary key
        self.pkey = 'uuid'

    def set_pools(self, network, data):
        assert network is not None, 'Primary key not set'

        #self.e().filter_by(**{'network': network}).delete()

        self.db().exec(delete(NetworkPool).filter_by(**{'network': network}))

        result = []

        for item in data:
            newVal = {
                'network': network,
                'range': item['range']
            }

            result.append(self.db().add(NetworkPool(**newVal)))
        return result

# vim:set sw=4 ts=4 et:

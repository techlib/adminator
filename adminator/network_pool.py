#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

from adminator.model import Model

__all__ = ['NetworkPool']

class NetworkPool(Model):
    def init(self):
        self.table_name = 'network_pool'
        # Primary key
        self.pkey = 'uuid'

    def set_pools(self, network, data):
        assert network is not None, 'Primary key not set'

        self.e().filter_by(**{'network': network}).delete()

        result = []

        for item in data:
            newVal = {
                'network': network,
                'range': item['range']
            }

            result.append(self.e().insert(**newVal))
        return result

# vim:set sw=4 ts=4 et:

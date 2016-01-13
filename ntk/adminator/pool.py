#!/usr/bin/python -tt
from model import Model

__all__ = ['NetworkPool']

class NetworkPool(Model):
    def init(self):
        # Table name
        self.table_name = 'network_pool'
        # Primary key
        self.pkey = 'uuid'

# vim:set sw=4 ts=4 et:
# -*- coding: utf-8 -*-

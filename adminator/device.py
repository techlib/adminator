#!/usr/bin/python -tt
from adminator.model import Model

__all__ = ['Device']

class Device(Model):
    def init(self):
        self.table_name = 'device'
        # Primary key
        self.pkey = 'uuid'
        # Relations
        self.relate('interfaces', self.e('interface'))
        self.relate('users', self.e('user'))
        self.relate('dhcp_options', self.e('option_value'))
        self.include_relations = {'item': ['interfaces', 'dhcp_options', 'users'], 'list': ['users', 'interfaces']}

# vim:set sw=4 ts=4 et:
# -*- coding: utf-8 -*-

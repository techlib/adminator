#!/usr/bin/python -tt
from model import Model

__all__ = ['Network']

class Network(Model):
    def init(self):
        # Table name
        self.table_name = 'network'
        # Relations
        self.relate('interfaces', self.e('interface'))
        self.relate('pools', self.e('network_pool'))
        self.relate('dhcp_options', self.e('option_value'))
        # Include relations for list view and single item view
        self.include_relations = {'item': ['pools', 'dhcp_options'], 'list': []}
        # Primary key
        self.pkey = 'uuid'

# vim:set sw=4 ts=4 et:
# -*- coding: utf-8 -*-

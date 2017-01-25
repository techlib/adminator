#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

from adminator.model import Model

__all__ = ['Switch']

class Switch(Model):
    def init(self):
        self.table_name = 'switch'
        # Primary key
        self.pkey = 'uuid'
        # Default schema
        self.schema = 'topology'
        # Relations
        self.relate('interfaces', self.e('sw_interface'))
        self.include_relations = {'item': ['interfaces'], 'list': []}

# vim:set sw=4 ts=4 et:

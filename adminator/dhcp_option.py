#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

from adminator.model import Model
from .db_entity.network import DhcpOption

__all__ = ['DhcpOptionModel']

class DhcpOptionModel(Model):
    def init(self):
        self.table_name = 'option'
        # Primary key
        self.pkey = 'name'
        # Relations
        #self.relate('values', self.e('option_value'))
        self.include_relations = {'item': ['values'], 'list': []}
        self.db_entity = DhcpOption


# vim:set sw=4 ts=4 et:

#!/usr/bin/python -tt
from adminator.model import Model

__all__ = ['DhcpOption']

class DhcpOption(Model):
    def init(self):
        self.table_name = 'option'
        # Primary key
        self.pkey = 'uuid'
        # Relations
        self.relate('values', self.e('option_value'))
        self.include_relations = {'item': ['values'], 'list': []}


# vim:set sw=4 ts=4 et:
# -*- coding: utf-8 -*-

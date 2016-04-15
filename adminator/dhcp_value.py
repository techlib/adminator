#!/usr/bin/python -tt
from adminator.model import Model

__all__ = ['DhcpOptionValue']

class DhcpOptionValue(Model):
    def init(self):
        self.table_name = 'option_value'
        # Primary key
        self.pkey = 'uuid'
        # Relations
        self.relate('type', self.e('option'))
        self.include_relations = {'item': ['type'], 'list': ['type']}


# vim:set sw=4 ts=4 et:
# -*- coding: utf-8 -*-

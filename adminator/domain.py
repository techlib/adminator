#!/usr/bin/python -tt
from adminator.model import Model

__all__ = ['Domain']

class Domain(Model):
    def init(self):
        self.table_name = 'domains'
        # PDNS schema
        self.schema = 'pdns'
        # Relations
        self.relate('records', self.e('records'))
        self.relate('metatada', self.e('domainmetadata'))
        # Include relations for list view and single item view
        self.include_relations = {'item': ['metadata', 'records'], 'list': []}
        # Primary key
        self.pkey = 'id'

# vim:set sw=4 ts=4 et:
# -*- coding: utf-8 -*-

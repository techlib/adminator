#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

from adminator.model import Model

from .db_entity.dns import Domain

class DomainModel(Model):
    def init(self):
        self.table_name = 'domains'
        # PDNS schema
        self.schema = 'pdns'
        # Relations
        self.relate('records', self.e('records'))
        self.relate('metatada', self.e('domainmetadata'))
        # Include relations for list view and single item view
        self.include_relations = {'item': ['records'], 'list': []}
        # Primary key
        self.pkey = 'id'
        self.db_entity = Domain

# vim:set sw=4 ts=4 et:

#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

from adminator.model import Model
from .db_entity.topology import Port

class PortModel(Model):
    def init(self):
        self.schema = 'topology'
        self.table_name = 'port'
        self.pkey = 'uuid'
        self.db_entity = Port

# vim:set sw=4 ts=4 et:

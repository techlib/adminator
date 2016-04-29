#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

from adminator.model import Model

__all__ = ['Record']

class Record(Model):
    def init(self):
        # PDNS schema
        self.schema = 'pdns'
        self.table_name = 'records'
        self.pkey = 'id'

# vim:set sw=4 ts=4 et:

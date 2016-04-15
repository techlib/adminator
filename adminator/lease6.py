#!/usr/bin/python -tt
from adminator.model import Model

__all__ = ['Lease6']

class Lease6(Model):
    def init(self):
        self.table_name = 'lease6'
        # Schema
        self.schema = 'kea'
        # Primary key
        self.pkey = 'address'

# vim:set sw=4 ts=4 et:
# -*- coding: utf-8 -*-

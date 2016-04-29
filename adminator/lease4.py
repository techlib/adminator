#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

from adminator.model import Model

__all__ = ['Lease4']

class Lease4(Model):
    def init(self):
        self.table_name = 'lease4'
        # Schema
        self.schema = 'kea'
        # Primary key
        self.pkey = 'address'

# vim:set sw=4 ts=4 et:

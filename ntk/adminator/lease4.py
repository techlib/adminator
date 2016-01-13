#!/usr/bin/python -tt
from model import Model

__all__ = ['Lease4']

class Lease4(Model):
    def init(self):
        self.table_name = 'lease4'
        # Schema
        self.schema = 'kea'
        # Primary key
        self.pkey = 'address'

# vim:set sw=4 ts=4 et:
# -*- coding: utf-8 -*-

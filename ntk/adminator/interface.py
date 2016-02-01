#!/usr/bin/python -tt
from model import Model

__all__ = ['Interface']

class Interface(Model):
    def init(self):
        self.schema = 'network'
        self.table_name = 'interface'
        self.pkey = 'uuid'

# vim:set sw=4 ts=4 et:
# -*- coding: utf-8 -*-

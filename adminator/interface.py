#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

from adminator.model import Model

__all__ = ['Interface']

class Interface(Model):
    def init(self):
        self.schema = 'network'
        self.table_name = 'interface'
        self.pkey = 'uuid'

# vim:set sw=4 ts=4 et:

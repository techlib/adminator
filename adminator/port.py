#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

from adminator.model import Model

__all__ = ['Port']


class Port(Model):
    def init(self):
        self.schema = 'topology'
        self.table_name = 'port'
        self.pkey = 'uuid'

# vim:set sw=4 ts=4 et:

#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

from adminator.model import Model

__all__ = ['ConfigPatttern']

class ConfigPatttern(Model):
    def init(self):
        # Topology schema
        self.schema = 'topology'
        self.table_name = 'if_config_pattern'
        self.pkey = 'uuid'

# vim:set sw=4 ts=4 et:

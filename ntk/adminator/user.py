#!/usr/bin/python -tt
from model import Model

__all__ = ['User']

class User(Model):
    def init(self):
        self.table_name = 'user'
        self.pkey = 'cn'
        self.relate('access', self.e('access'))
        self.include_relations = {'item': ['access'], 'list': []}


# vim:set sw=4 ts=4 et:
# -*- coding: utf-8 -*-

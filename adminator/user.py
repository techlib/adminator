#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

from adminator.model import Model

__all__ = ['User']

class User(Model):
    def init(self):
        self.table_name = 'user'
        self.pkey = 'cn'
        self.include_relations = {'item': [], 'list': []}


# vim:set sw=4 ts=4 et:

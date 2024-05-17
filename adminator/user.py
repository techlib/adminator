#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

from adminator.model import Model
from .db_entity.network import User

class UserModel(Model):
    def init(self):
        self.table_name = 'user'
        self.pkey = 'cn'
        self.include_relations = {'item': [], 'list': []}
        self.db_entity = User


# vim:set sw=4 ts=4 et:

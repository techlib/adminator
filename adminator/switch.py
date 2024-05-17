#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

from adminator.model import Model
from adminator.switch_interface import SwitchInterfaceModel

from .db_entity.topology import Switch

class SwitchModel(Model):
    def init(self):
        self.table_name = 'switch'
        # Primary key
        self.pkey = 'uuid'
        # Default schema
        self.schema = 'topology'
        # Relations
        self.relate('interfaces', self.e('sw_interface'))
        self.include_relations = {'item': ['interfaces'], 'list': []}
        self.db_entity = Switch

    def get_item(self, key):
        item = super().get_item(key)
        switch_interface = SwitchInterfaceModel(self.manager)
        for interface in item['interfaces']:
            switch_interface.fill_link_status(interface)
            interface['speed_label'] = switch_interface.link_speed_humanize(interface['speed'])
        return item

# vim:set sw=4 ts=4 et:

#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

from adminator.model import Model
from adminator.utils import object_to_dict
from sqlalchemy import and_

__all__ = ['DhcpOptionValue']

class DhcpOptionValue(Model):
    def init(self):
        self.table_name = 'option_value'
        # Primary key
        self.pkey = 'uuid'
        # Relations
        self.relate('type', self.e('option'))
        self.include_relations = {'item': ['type'], 'list': ['type']}

    def list_global(self):
        items = []
        query = self.e().filter_by(**{'network': None, 'device': None}).all()

        for item in query:
            item = object_to_dict(item, include=self.include_relations.get('list'))
            items.append(item)
        return items

    def set_device(self, device, data):
        return self.set_options(data, 'device', device)

    def set_network(self, network, data):
        return self.set_options(data, 'network', network)

    def set_global(self, data):
        res = self.set_options(data);
        self.db.commit()
        return list(map(object_to_dict, res))

    def set_options(self, data, kind=None, uuid=None):
        assert kind in ('network', 'device', None), 'Invalid kind'

        if kind is not None:
            search = {kind: uuid}
        else:
            search = {'network': None, 'device': None}

        self.e().filter_by(**search).delete()

        result = []

        for item in data:
            newVal = {
                'option': item['option'],
                'value': item['value']
            }

            if kind is not None:
                newVal[kind] = uuid

            result.append(self.e().insert(**newVal))
        return result



# vim:set sw=4 ts=4 et:

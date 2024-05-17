#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-
from sqlmodel import select,delete

from adminator.model import Model
from adminator.utils import object_to_dict
from .db_entity.network import DhcpOptionValue

__all__ = ['DhcpOptionValueModel']

class DhcpOptionValueModel(Model):
    def init(self):
        self.table_name = 'option_value'
        # Primary key
        self.pkey = 'uuid'
        # Relations
        #self.relate('type', self.e('option'))
        self.include_relations = {'item': ['type'], 'list': ['type']}
        self.db_entity = DhcpOptionValue
    def list_global(self):
        items = []
        #query = self.e().filter_by(**{'network': None, 'device': None}).all()
        query = select(DhcpOptionValue).where(DhcpOptionValue.network == None).where(DhcpOptionValue.device == None)
        for item in self.db().exec(query):
            item = object_to_dict(item, include=self.include_relations.get('list'))
            items.append(item)
        return items

    def set_device(self, device, data):
        return self.set_options(data, 'device', device)

    def set_network(self, network, data):
        return self.set_options(data, 'network', network)

    def set_global(self, data):
        res = self.set_options(data);
        self.db().commit()
        return list(map(object_to_dict, res))

    def set_options(self, data, kind=None, uuid=None):
        assert kind in ('network', 'device', None), 'Invalid kind'

        if kind is not None:
            search = {kind: uuid}
        else:
            search = {'network': None, 'device': None}

        #self.e().filter_by(**search).delete()
        self.db().exec(delete(DhcpOptionValue).filter_by(**search))

        result = []

        for item in data:
            newVal = {
                'option': item['option'],
                'value': item['value']
            }

            if kind is not None:
                newVal[kind] = uuid

            new_item = DhcpOptionValue(**newVal)
            self.db().add(new_item)
            result.append(new_item)

        return result



# vim:set sw=4 ts=4 et:

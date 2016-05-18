#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

from adminator.model import Model

__all__ = ['Interface']

class Interface(Model):
    def init(self):
        self.schema = 'network'
        self.table_name = 'interface'
        self.pkey = 'uuid'

    def set_device_interfaces(self, device, data):
        search = {'device': device}
        self.e().filter_by(**search).delete()

        result = []

        for item in data:
            newVal = {}

            for k,v in item.items():
                if v == '':
                    v = None

                newVal[k] = v
            result.append(self.e().insert(**newVal))

        return result

# vim:set sw=4 ts=4 et:

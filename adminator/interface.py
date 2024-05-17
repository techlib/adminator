#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-
from sqlalchemy import delete

from adminator.model import Model
from .db_entity.network import Interface


class InterfaceModel(Model):
    def init(self):
        self.schema = 'network'
        self.table_name = 'interface'
        self.pkey = 'uuid'

    def set_device_interfaces(self, device, data):
        delStm = delete(Interface).where(Interface.device == device)
        self.db().exec(delStm)

        result = []

        for item in data:
            newVal = {'device': str(device)}

            for k,v in item.items():
                if v == '':
                    v = None

                newVal[k] = v

            newInterface = Interface(**newVal)
            n = self.db().add(newInterface)
            result.append(n)

        return result

# vim:set sw=4 ts=4 et:

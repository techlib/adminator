#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

__all__ = ['Manager']


from adminator.device import DeviceModel
from adminator.dhcp_value import DhcpOptionValueModel
from adminator.dhcp_option import DhcpOptionModel
from adminator.domain import DomainModel
from adminator.user import UserModel
from adminator.network import NetworkModel
from adminator.network_pool import NetworkPoolModel
from adminator.network_acl import NetworkAclModel
from adminator.record import RecordModel
from adminator.lease4 import Lease4Model
from adminator.lease6 import Lease6Model
from adminator.interface import InterfaceModel
from adminator.port import PortModel
from adminator.connection import ConnectionModel
from adminator.switch import SwitchModel
from adminator.mac_history import MacHistoryModel
from adminator.switch_interface import SwitchInterfaceModel
from adminator.config_pattern import ConfigPattternModel


class Manager(object):
    def __init__(self, db):
        self.db = db

        # Something like models
        self.user = UserModel(self)
        self.device = DeviceModel(self)
        self.interface = InterfaceModel(self)
        self.dhcp_option = DhcpOptionModel(self)
        self.dhcp_option_value = DhcpOptionValueModel(self)
        self.network = NetworkModel(self)
        self.network_pool = NetworkPoolModel(self)
        self.network_acl = NetworkAclModel(self)

        self.record = RecordModel(self)
        self.domain = DomainModel(self)

        self.lease4 = Lease4Model(self)
        self.lease6 = Lease6Model(self)

        self.port = PortModel(self)
        self.connection = ConnectionModel(self)
        self.switch = SwitchModel(self)
        self.mac_history = MacHistoryModel(self)
        self.switch_interface = SwitchInterfaceModel(self)
        self.config_pattern = ConfigPattternModel(self)



# vim:set sw=4 ts=4 et:

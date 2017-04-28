#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

__all__ = ['Manager']

from twisted.internet.threads import deferToThread
from twisted.internet import task, reactor
from twisted.python import log

from adminator.device import Device
from adminator.dhcp_value import DhcpOptionValue
from adminator.dhcp_option import DhcpOption
from adminator.user import User
from adminator.network import Network
from adminator.network_pool import NetworkPool
from adminator.network_acl import NetworkAcl
from adminator.domain import Domain
from adminator.record import Record
from adminator.lease4 import Lease4
from adminator.lease6 import Lease6
from adminator.interface import Interface
from adminator.port import Port
from adminator.connection import Connection
from adminator.switch import Switch
from adminator.mac_history import MacHistory
from adminator.switch_interface import SwitchInterface
from adminator.config_pattern import ConfigPatttern


class Manager(object):
    def __init__(self, db):
        self.db = db

        # Something like models
        self.user = User(self)
        self.device = Device(self)
        self.interface = Interface(self)
        self.dhcp_option = DhcpOption(self)
        self.dhcp_option_value = DhcpOptionValue(self)
        self.network = Network(self)
        self.network_pool = NetworkPool(self)
        self.network_acl = NetworkAcl(self)

        self.record = Record(self)
        self.domain = Domain(self)

        self.lease4 = Lease4(self)
        self.lease6 = Lease6(self)

        self.port = Port(self)
        self.connection = Connection(self)
        self.switch = Switch(self)
        self.mac_history = MacHistory(self)
        self.switch_interface = SwitchInterface(self)
        self.config_pattern = ConfigPatttern(self)


# vim:set sw=4 ts=4 et:

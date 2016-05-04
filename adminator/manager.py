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
from adminator.domain import Domain
from adminator.record import Record
from adminator.lease4 import Lease4
from adminator.lease6 import Lease6
from adminator.interface import Interface


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

        self.record = Record(self)
        self.domain = Domain(self)

        self.lease4 = Lease4(self)
        self.lease6 = Lease6(self)

    def notify(self, event):
        log.msg('Notification: {}'.format(event.channel))


# vim:set sw=4 ts=4 et:

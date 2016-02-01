#!/usr/bin/python -tt

__all__ = ['Manager']

from device import Device
from dhcp_value import DhcpOptionValue
from dhcp_option import DhcpOption
from user import User
from network import Network
from domain import Domain
from record import Record
from lease4 import Lease4
from lease6 import Lease6
from interface import Interface

class Manager(object):
    """The main application logic of Examplator."""

    def __init__(self, db):
        # Stores DB connection for later use.
        self.db = db

        # Something like models
        self.user = User(self)
        self.device = Device(self)
        self.interface = Interface(self)
        self.dhcp_option = DhcpOption(self)
        self.dhcp_option_value = DhcpOptionValue(self)
        self.network = Network(self)

        self.record = Record(self)
        self.domain = Domain(self)

        self.lease4 = Lease4(self)
        self.lease6 = Lease6(self)

    def get_options(self, device=None, network=None):
        options = {}
        for option in self.db.option_value.filter_by(network=network, device=device).all():
            if option.params.array:
                """
                if isinstance(option.value, str) or isinstance(option.value, unicode):
                    options[option.params.name] = option.value.split(',')
                else:
                """
                options[option.params.name] = option.value
        return options

# vim:set sw=4 ts=4 et:
# -*- coding: utf-8 -*-

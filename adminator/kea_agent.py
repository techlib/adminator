#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

__all__ = ['KeaAgent']

from twisted.python import log

from simplejson import dump, load

from adminator.kea import generate_kea_config, DEFAULTS


class KeaAgent(object):
    def __init__(self, db, template=None, output=None, signal=None):
        self.db = db

        if template is not None:
            with open(template) as fp:
                self.template = load(fp)
        else:
            self.template = DEFAULTS

        self.output = output or '/etc/kea/kea.conf'
        self.signal = signal or 'keactrl reload'


    def notify(self, event):
        log.msg('Database Notification: {}'.format(event.channel))


# vim:set sw=4 ts=4 et:

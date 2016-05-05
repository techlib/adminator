#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

__all__ = ['KeaAgent']

from os import system
from twisted.python import log
from twisted.internet import task
from json import dump, load
from adminator.kea import generate_kea_config, DEFAULTS


class KeaAgent(object):
    def __init__(self, db, template=None, output=None, signal=None):
        self.db = db

        if template is not None:
            log.msg('Reading Template {}'.format(template))
            with open(template) as fp:
                self.template = load(fp)
        else:
            self.template = DEFAULTS

        self.output = output or '/etc/kea/kea.conf'
        self.signal = signal or 'keactrl reload'
        self.last = {}

    def start(self):
        self.periodic = task.LoopingCall(self.update)
        self.periodic.start(60)

        self.update()

    def notify(self, event):
        log.msg('Database Notification: {}'.format(event.channel))

        if event.channel == 'dhcp':
            self.update()

    def update(self):
        config = generate_kea_config(self.db, self.template)

        if self.last == config:
            return

        log.msg('Writing: {}'.format(self.output))
        with open(self.output, 'w') as fp:
            dump(config, fp, indent=2, sort_keys=True, ensure_ascii=False)

        log.msg('Executing: {}'.format(self.signal))
        system(self.signal)

        self.last = config


# vim:set sw=4 ts=4 et:

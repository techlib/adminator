#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

from twisted.internet import task
from twisted.python import log

import re
import time

import requests
from sqlalchemy import and_
from .parser import CfgParser
from sqlalchemy.orm.exc import NoResultFound


class ConfigComwareAgent(object):
    def __init__(self, db, api_url, update_period):
        self.db = db
        # TODO: url from config
        self.update_period = int(update_period)
        self.url = api_url

    def start(self):
        """Start the periodic checking."""
        self.periodic = task.LoopingCall(self.update)
        self.periodic.start(self.update_period, True)

    def update_switch(self, switch):
        parser = CfgParser()
        try:
            url = self.url + '/{}/config/'.format(switch.name)
            r = requests.get(url)
        except Exception as e:
            log.msg('Error while getting configuration for {}({}) from url: {}, {}'.format(
                switch.name, switch.ip_address, url, e
            ))
            return

        for key, val in r.json()['configs'].items():
            conf = []
            for item in parser.parse(val):
                conf.append({'name': item[0], 'options': item[1], 'syscfg': item[2]})
            for inter in filter(lambda i: i['name'].startswith('interface'), conf):
                name = inter['name'][len('interface '):]
                try:
                    where = and_(
                        self.db.sw_interface.switch == switch.uuid, self.db.sw_interface.name == name
                    )
                    db_if = self.db.sw_interface.filter(where).one()
                    db_if.configuration = inter['options']
                except NoResultFound:
                    log.msg('The interface {} hasn\'t been found at switch {}({})'.format(
                        name, switch.name, switch.ip_address
                    ))
        self.db.commit()

    def pattern_match(self, pattern, configuration):
        # TODO: TypeError: 'NoneType' object is not iterable, etc
        cfg_len = len(configuration)
        mand_len = len(pattern.mandatory)
        cfg_state = [False] * cfg_len
        mand_state = [False] * mand_len
        for i in range(mand_len):
            mand_pattern = re.compile(pattern.mandatory[i])
            for j in range(cfg_len):
                if not (mand_pattern.fullmatch(configuration[j]) == None):
                    mand_state[i] = True
                    cfg_state[j] = True

        for i in range(cfg_len):
            if not cfg_state[i]:
                for pos_pattern in pattern.optimal:
                    if not (re.fullmatch(pos_pattern, configuration[i]) == None):
                        cfg_state[i] = True
                        break
        return not( False in mand_state or False in cfg_state)

    def all_pattern_recalculate(self):
        patterns = self.db.if_config_pattern.all()
        for interface in self.db.sw_interface.all():
            self.db.if_to_pattern.filter_by(interface=interface.uuid).delete()
            for pattern in patterns:
                if self.pattern_match(pattern, interface.configuration):
                    self.db.if_to_pattern.insert(
                        interface=interface.uuid, if_config_pattern=pattern.uuid
                    )
        self.db.commit()

    def update(self):
        log.msg('Switch configuration sync started')
        start = time.time()
        switces = self.db.switch.filter_by(enable=True, type='3com').all()
        switces.extend(self.db.switch.filter_by(enable=True, type='hp').all())
        for switch in switces:
            try:
                self.update_switch(switch)
            except Exception as e:
                log.msg('Error while updating configuration of {}({}), {}'.format(switch.name, switch.ip_address, e))
                self.db.rollback()
                continue

        self.all_pattern_recalculate()
        log.msg('Switch configuration sync finished ({:.03f} s)'.format(time.time() - start))

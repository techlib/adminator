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

from adminator.db_entity.topology import  SwInterface, Switch, InterfaceToPattern, IfConfigPattern
from sqlmodel import select, delete
class ConfigAgent(object):
    def __init__(self, db, api_url, update_period, username, password, crt_path):
        self.db = db
        # TODO: url from config
        self.update_period = int(update_period)
        self.url = api_url
        self.username = username
        self.password = password
        self.crt_path = False if crt_path.lower() in ['false', '0'] else crt_path

    def start(self):
        """Start the periodic checking."""
        self.periodic = task.LoopingCall(self.update)
        self.periodic.start(self.update_period, True)

    def update_switch(self, switch):
        parser = CfgParser()
        try:
            url = self.url + '/{}/config/'.format(switch.name)
            r = requests.get(url, auth=(self.username, self.password), verify=self.crt_path)
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
                        SwInterface.switch == switch.uuid, SwInterface.name == name
                    )
                    db_if = self.db().exec(select(SwInterface).filter(where)).one()
                    db_if.configuration = inter['options']
                except NoResultFound:
                    log.msg('The interface {} hasn\'t been found at switch {}({})'.format(
                        name, switch.name, switch.ip_address
                    ))
        self.db().commit()

    def pattern_match(self, pattern, configuration):
        # TODO: TypeError: 'NoneType' object is not iterable, etc
        cfg_len = len(configuration)
        mand_len = len(pattern.mandatory)
        cfg_state = [False] * cfg_len
        mand_state = [False] * mand_len
        for i in range(mand_len):
            mand_pattern = re.compile(pattern.mandatory[i])
            for j in range(cfg_len):
                if not (mand_pattern.fullmatch(configuration[j]) is None):
                    mand_state[i] = True
                    cfg_state[j] = True

        for i in range(cfg_len):
            if not cfg_state[i]:
                for pos_pattern in pattern.optional:
                    if not (re.fullmatch(pos_pattern, configuration[i]) is None):
                        cfg_state[i] = True
                        break
        return not(False in mand_state or False in cfg_state)

    def all_pattern_recalculate(self):
        patterns = self.db().exec(select(IfConfigPattern)).all()
        for interface in self.db().exec(select(SwInterface)):
            self.db().exec(delete(InterfaceToPattern).where(InterfaceToPattern.interface == interface.uuid))
            for pattern in patterns:
                if self.pattern_match(pattern, interface.configuration):
                    to_insert = InterfaceToPattern(interface=interface.uuid, if_config_pattern=pattern.uuid)
                    self.db().add(to_insert)
        self.db().commit()

    def update(self):
        log.msg('Switch configuration sync started')
        start = time.time()

        switces = self.db().exec(select(Switch).filter(Switch.enable == True, Switch.type == '3com')).all()
        switces.extend(self.db().exec(select(Switch).filter(Switch.enable == True, Switch.type == 'hp')).all())
        switces.extend(self.db().exec(select(Switch).filter(Switch.enable == True, Switch.type == 'aruba')).all())

        for switch in switces:
            try:
                self.update_switch(switch)
            except Exception as e:
                log.msg('Error while updating configuration of {}({}), {}'.format(
                    switch.name, switch.ip_address, e))
                self.db().rollback()
                continue

        self.all_pattern_recalculate()
        log.msg('Switch configuration sync finished ({:.03f} s)'.format(time.time() - start))

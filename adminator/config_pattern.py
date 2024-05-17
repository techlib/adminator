#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

import re

from adminator.model import Model
from .db_entity.topology import IfConfigPattern, SwInterface, InterfaceToPattern
from sqlmodel import select, delete, text

class ConfigPattternModel(Model):
    def init(self):
        # Topology schema
        self.schema = 'topology'
        self.table_name = 'if_config_pattern'
        self.pkey = 'uuid'
        self.db_entity = IfConfigPattern

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
        return not (False in mand_state or False in cfg_state)

    def recalculate_all(self):
        patterns = self.db().exec(select(IfConfigPattern)).all()
        self.db().exec(delete(InterfaceToPattern))
        for interface in self.db().exec(select(SwInterface)):
            for pattern in patterns:
                if self.pattern_match(pattern, interface.configuration):
                    pattern_to_insert = InterfaceToPattern(interface=interface.uuid, if_config_pattern=pattern.uuid)
                    self.db().add(pattern_to_insert)
        self.db.commit()
        return 0

    def recalculate(self, uuid):
        pattern = self.db().exec(select(IfConfigPattern).filter_by(uuid=uuid)).one()
        interfaces = self.db().exec(select(SwInterface)).all()
        match = 0
        self.db().exec(delete(InterfaceToPattern).filter_by(if_config_pattern=uuid))
        for interface in interfaces:
            if self.pattern_match(pattern, interface.configuration):
                pattern_to_insert = InterfaceToPattern(interface=interface.uuid, if_config_pattern=pattern.uuid)
                self.db().add(pattern_to_insert)
                match += 1
        self.db.commit()

        return {'result': 0, 'interfacses': len(interfaces), 'matching': match}

# vim:set sw=4 ts=4 et:

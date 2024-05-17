#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

from adminator.model import Model
from adminator.utils import object_to_dict, audit
from sqlalchemy import and_, text
from sqlmodel import Session, select, delete
from .db_entity.network import Device, User, NetworkAcl, Interface

__all__ = ['Device']


class DeviceModel(Model):
    def init(self):
        self.table_name = 'device'
        self.db_entity = Device
        self.pkey = 'uuid'
        self.include_relations = {'item': ['interfaces', 'dhcp_options', 'users'], 'list': ['users', 'interfaces']}

    def network_acls(self, privileges):
        acls = {}
        for privilege in privileges:
            s = select(NetworkAcl).where(NetworkAcl.role == privilege)
            for acl in self.db().exec(s):
                acls[acl.network] = acl.device_types
        return acls

    def get_item(self, key, privileges):
        stm = select(Device).where(Device.uuid == key)
        item = object_to_dict(self.db().exec(stm).one(), include=self.include_relations.get('item'))
        for interface in item['interfaces']:
            lease4 = self.db().exec(text("SELECT (SELECT '0.0.0.0'::inet + address) as address \
                                                  FROM kea.lease4 \
                                                  WHERE COALESCE(NULLIF(ENCODE(hwaddr, 'hex'), ''), '000000000000')::macaddr = '%s'" % interface['macaddr'])).first()
            if lease4:
                lease4 = lease4._asdict()
                interface['lease4'] = lease4['address']

        # Check ACLs
        acl = self.network_acls(privileges)
        if 'admin' not in privileges:
            for interface in item.interface:
                if str(interface.network) not in acl.keys() or item.type not in acl[str(interface.network)]:
                    raise Exception('RBAC Forbidden')

        return item

    @audit
    def delete(self, key, privileges, uid):
        # Check ACLs by getting the item

        self.get_item(key, privileges)
        #row = self.db().exec(select(Device).filter_by(**{self.pkey: key})).one()
        #self.db().delete(row)
        #self.db().commit()

        self.db().exec(delete(Device).filter_by(**{self.pkey: key}))
        self.db().commit()

        return {'deleted': 1}

    @audit
    def insert(self, data, privileges, uid):
        # Check ACLs
        acl = self.network_acls(privileges)
        if 'admin' not in privileges:
            for interface in data['interfaces']:
                if str(interface['network']) not in acl.keys() or data['type'] not in acl[str(interface['network'])]:
                    raise Exception('RBAC Forbidden')

        newVal = {}
        for k, v in data.items():
            if k not in self.get_relationships() and v is not None:
                newVal[k] = v

        dev = Device(**newVal)
        self.db().add(dev)
        self.db().commit()
        self.db().refresh(dev)
        self.process_relations(dev, dev.uuid, data)
        self.db().commit()

        return object_to_dict(dev)

    def list(self, privileges):
        acl = self.network_acls(privileges)

        devices = {}
        users = {}

        for user in self.db().scalars(select(User)):
            users[user.cn] = user

        for device in self.db().scalars(select(Device)):
            devices[str(device.uuid)] = object_to_dict(device)
            devices[str(device.uuid)]['interfaces'] = []
            devices[str(device.uuid)]['users'] = users.get(device.user)

            if devices[str(device.uuid)]['users'] != None:
                devices[str(device.uuid)]['users'] = object_to_dict(devices[str(device.uuid)]['users'])

            if device.type == 'visitor':
                devices[str(device.uuid)]['valid'] = [
                    device.valid[0],
                    device.valid[1]
                ]

        # TODO add support for IPv6
        for interface in \
                self.db().exec(text("SELECT i.*, \
                                (SELECT '0.0.0.0'::inet + l4.address) as lease4, \
                                n.vlan, \
                                n.description AS network_name \
                              FROM interface AS i \
                              LEFT JOIN network AS n ON i.network = n.uuid \
                                 LEFT JOIN kea.lease4 AS l4 ON i.macaddr = COALESCE(NULLIF(ENCODE(l4.hwaddr, 'hex'), ''), '000000000000')::macaddr")):

            # Check ACLs
            interface = interface._asdict()

            if str(interface['device']) in devices:
                if 'admin' in privileges or \
                        str(interface['network']) in acl.keys() and device.type in acl[str(interface['network'])]:
                    item = dict(zip(interface.keys(), interface.values()))
                    devices[str(interface['device'])]['interfaces'].append(item)
                else:
                    del devices[str(interface['device'])]

        return list(devices.values())

    @audit
    def patch(self, data, privileges, uid):
        assert data.get(self.pkey) is not None, 'Primary key is not set'

        # Check ACLs
        acl = self.network_acls(privileges)
        if 'admin' not in privileges:
            for interface in data['interfaces']:
                if str(interface['network']) not in acl.keys() or data['type'] not in acl[str(interface['network'])]:
                    raise Exception('RBAC Forbidden')

        uuid = data['uuid']
        item = self.db().exec(select(Device).filter_by(**{self.pkey: uuid})).one()

        for k, v in data.items():
            if k in self.get_relationships() or k == self.pkey:
                continue
            setattr(item, k, v)

        self.db().add(item)
        self.process_relations(item, uuid, data)
        self.db().commit()

        return object_to_dict(item)

    def process_relations(self, e, uuid, data):
        if 'interfaces' in data:
            d = self.manager.interface.set_device_interfaces(uuid, data['interfaces'])
            #setattr(e, 'interfaces', d)

# vim:set sw=4 ts=4 et:

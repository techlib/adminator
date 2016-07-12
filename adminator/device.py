#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

from adminator.model import Model
from adminator.utils import object_to_dict
from sqlalchemy import and_

__all__ = ['Device']

class Device(Model):
    def init(self):
        self.table_name = 'device'
        # Primary key
        self.pkey = 'uuid'
        # Relations
        self.relate('interfaces', self.e('interface'))
        self.relate('users', self.e('user'))
        self.relate('dhcp_options', self.e('option_value'))
        self.include_relations = {'item': ['interfaces', 'dhcp_options', 'users'], 'list': ['users', 'interfaces']}


    def network_acls(self, privileges):
        acls = {}
        for privilege in privileges:
            for acl in self.db.network_acl.filter(self.db.network_acl.role==privilege).all():
                acls[acl.network] = acl.device_types
        print(acls)
        return acls

    def get_item(self, key, privileges):
        item = self.e().filter_by(**{self.pkey: key}).one()
        item = object_to_dict(item, include=self.include_relations.get('item'))

        # Check ACLs
        acl = self.network_acls(privileges)
        if 'admin' not in privileges:
            for interface in item['interfaces']:
                if str(interface['network']) not in acl.keys() or item['type'] not in acl[str(interface['network'])]:
                    raise Exception('RBAC Forbidden')

        return item

    def delete(self, key, privileges):
        # Check ACLs by getting the item
        self.get_item(key, privileges)

        rows = self.e().filter_by(**{self.pkey: key}).delete()
        self.db.commit()
        return {'deleted': rows}

    def insert(self, data, privileges):
        # Check ACLs
        acl = self.network_acls(privileges)
        if 'admin' not in privileges:
            for interface in data['interfaces']:
                if str(interface['network']) not in acl.keys() or data['type'] not in acl[str(interface['network'])]:
                    raise Exception('RBAC Forbidden')

        newVal = {}
        for k,v in data.items():
            if k not in self.get_relationships() and v is not None:
                newVal[k] = v

        e = self.e().insert(**newVal)
        self.db.session.flush()

        self.process_relations(e, e.uuid, data)
        self.db.commit()

        return object_to_dict(e)

    def list(self, privileges):
        acl = self.network_acls(privileges)

        devices = {}
        users = {}

        for user in self.db.execute('select * from network.user').fetchall():
            users[user.cn] = dict(zip(user.keys(), user.values()))

        for device in self.db.execute('select * from device').fetchall():
            devices[str(device.uuid)] = dict(zip(device.keys(), device.values()))
            devices[str(device.uuid)]['interfaces'] = []
            devices[str(device.uuid)]['users'] = users.get(device.user)

            if device['type'] == 'visitor':
                devices[str(device.uuid)]['valid'] = [
                        device['valid'].lower,
                        device['valid'].upper
                ]

        for interface in \
            self.db.execute('select i.*, n.vlan, n.description as network_name from interface as i left join network as n on i.network = n.uuid').fetchall():

            # Check ACLs
            if str(interface.device) in devices:
                if 'admin' in privileges or \
                    str(interface.network) in acl.keys() and device.type in acl[str(interface.network)]:
                    item = dict(zip(interface.keys(), interface.values()))
                    devices[str(interface.device)]['interfaces'].append(item)
                else:
                    del devices[str(interface.device)]

        return list(devices.values())

    def patch(self, data, privileges):
        assert data.get(self.pkey) is not None, 'Primary key is not set'

        # Check ACLs
        acl = self.network_acls(privileges)
        if 'admin' not in privileges:
            for interface in data['interfaces']:
                if str(interface['network']) not in acl.keys() or data['type'] not in acl[str(interface['network'])]:
                    raise Exception('RBAC Forbidden')

        uuid = data['uuid']
        item = self.e().filter_by(**{self.pkey: uuid}).one()

        for k,v in data.items():
            if k in self.get_relationships() or k == self.pkey:
                continue
            setattr(item, k, v)

        self.process_relations(item, uuid, data)
        self.db.commit()

        return object_to_dict(item)

    def process_relations(self, e, uuid, data):
        if 'interfaces' in data:
            d=self.manager.interface.set_device_interfaces(uuid, data['interfaces'])
            setattr(e, 'interfaces', d)

# vim:set sw=4 ts=4 et:

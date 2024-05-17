#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

from adminator.model import Model
from adminator.utils import object_to_dict
from sqlmodel import select
from .db_entity.network import NetworkAcl, Network

class NetworkModel(Model):
    def init(self):
        # Table name
        self.table_name = 'network'
        # Relations
        #self.relate('interfaces', self.e('interface'))
        #self.relate('pools', self.e('network_pool'))
        #self.relate('dhcp_options', self.e('option_value'))
        # Include relations for list view and single item view
        self.include_relations = {'item': ['pools', 'dhcp_options'], 'list': []}
        # Primary key
        self.pkey = 'uuid'
        self.db_entity = Network

    def network_acls(self, privileges):
        acls = {}
        for privilege in privileges:
            for acl in self.db().exec(select(NetworkAcl).where(NetworkAcl.role==privilege)):
                acls[str(acl.network)] = acl.device_types

        return acls


    def list(self, privileges):
        # Check ACLs
        acl = self.network_acls(privileges)
        items = []

        for item in self.db().exec(select(Network).order_by('uuid')).unique():
            # Filter out networks
            if 'admin' in privileges or str(item.uuid) in acl.keys():
                item = object_to_dict(item, include=[])
                items.append(item)

        return items



    def insert(self, data):
        newVal = {}
        for k,v in data.items():
            if k not in self.get_relationships():
                if v == '': v = None
                newVal[k] = v

        e = Network(**newVal)
        self.db().add(e)
        self.db().commit()
        self.db().refresh(e)
        self.process_relations(e, e.uuid, data)
        self.db().commit()

        return object_to_dict(e)

    def patch(self, data):
        assert data.get(self.pkey) is not None, 'Primary key is not set'

        uuid = data['uuid']
        #item = self.e().filter_by(**{self.pkey: uuid}).one()

        item = self.db().exec(select(Network).filter_by(uuid=uuid)).one()

        for k,v in data.items():
            if k in self.get_relationships() or k == self.pkey:
                continue
            if v == '': v = None
            setattr(item, k, v)

        self.process_relations(item, uuid, data)
        self.db().commit()

        return object_to_dict(item)

    def process_relations(self, e, uuid, data):
        if 'dhcp_options' in data:
            d=self.manager.dhcp_option_value.set_network(uuid, data['dhcp_options'])
            #setattr(e, 'dhcp_options', d)

        if 'pools' in data:
            p=self.manager.network_pool.set_pools(uuid, data['pools'])
            #setattr(e, 'pools', p)


# vim:set sw=4 ts=4 et:

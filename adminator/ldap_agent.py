#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

import ldap3
from twisted.internet import task
from twisted.python import log

__all__ = ['LdapAgent']

class LdapAgent(object):
    def __init__(self, db, url, bind_user, bind_pass):
        self.ldap = ldap3.Connection(url, user=bind_user, password=bind_pass, auto_bind=True)
        self.db = db

    def start(self):
        """Start the periodic checking."""
        self.periodic = task.LoopingCall(self.update)
        self.periodic.start(3600, True)

    def update(self):
        log.msg('LDAP sync started')
        self.db.user.update({'enabled': False})
        for user in self.get_users():
            e = self.db.user.get(user['cn'])
            if e:
                for k,v in user.items():
                    setattr(e, k, v)
            else:
                self.db.user.insert(**user)
        self.db.commit()
        log.msg('LDAP sync finished')

    def get_users(self):
        users = []
        c = self.ldap.search(
                'ou=users,o=ntk', 
                '(|(ntkCategory=Z)(ntkCategory=ZV)(ntkCategory=ZU))', 
                attributes=['sn', 'givenName', 'ntkStatus', 'cn'])
        if c:
            for e in self.ldap.entries:
                users.append({
                    'cn': str(e['cn']),
                    'display_name': '%s %s' % (e['givenName'], e['sn']),
                    'enabled': (str(e['ntkStatus'])=='enabled')
                    })

        return users

# vim:set sw=4 ts=4 et:
# -*- coding: utf-8 -*-

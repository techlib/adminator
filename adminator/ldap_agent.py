#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

import ldap3
from twisted.internet import task
from twisted.python import log
from adminator.db_entity.network import User
from sqlmodel import select, update
from sqlalchemy.exc import NoResultFound

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
        self.db().exec(update(User).values(enabled=False))

        for user in self.get_users():
            try:
                print(user)
                e = self.db().exec(select(User).where(User.cn == user['cn'])).one()
                for k,v in user.items():
                    setattr(e, k, v)
            except NoResultFound as e:
                print('Inserting:')
                print(user)
                a = self.db.user.insert(**user)
                print(a)

        self.db().commit()
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
        print(len(users))
        return users

# vim:set sw=4 ts=4 et:
# -*- coding: utf-8 -*-

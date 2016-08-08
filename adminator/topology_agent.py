#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

# from twisted.internet import reactor
from twisted.internet import task
from twisted.python import log

from html.parser import HTMLParser

from requests.auth import HTTPBasicAuth
from requests.exceptions import RequestException
import requests
import re
import datetime
from builtins import KeyError

__all__ = ['TopologyAgent']


class ConMapHTMLParser(HTMLParser):
    def __init__(self):
        HTMLParser.__init__(self)
        self.table = []
        self.phase = 0
        self.start_tags = {'table', 'tr', 'td'}
        self.classes = {
            'connmap-clr',
            'connmap-dis',
            'connmap-con',
            'connmap-lock',
        }
        self.patch_pannel = None

    def handle_starttag(self, tag, attrs):
        if self.phase == 0 and tag == 'tr':
            self.phase = 1
        elif self.phase == 1:
            if tag == 'td':
                my_attrs = dict(attrs)
                if (
                    'class' in my_attrs and
                    my_attrs['class'] in self.classes and
                    'title' in my_attrs
                ):
                    if self.patch_pannel is None:
                        self.patch_pannel = []
                    self.patch_pannel.append(my_attrs)
                else:
                    self.phase_to_zero()
            else:
                self.phase_to_zero()

    def phase_to_zero(self):
        self.phase = 0
        if self.patch_pannel:
            self.table.append(self.patch_pannel)
            self.patch_pannel = None

    def handle_endtag(self, tag):
        if self.phase == 1 and tag == 'tr':
            self.phase_to_zero()

    def get_table(self):
        return self.table


class AGUpdateException(Exception):
    def __init__(self, value):
        self.value = value

    def __str__(self):
        return repr(self.value)


class AGUpdater():
    def __init__(self, db, ag):
        self.db = db
        self.ag = ag

    def update(self):
        group = dict()
        tables = dict()
        ans = self.db.analyzer.filter_by(analyzer_group = self.ag.uuid).all()

        for an in ans:
            group[an.analyzer_id_in_group] = dict()
            tables[an.analyzer_id_in_group] = self.get_data(
                an.data_url, an.username, an.password
            )
            for pp in self.db.patch_panel.filter_by(analyzer = an.uuid).all():
                group[an.analyzer_id_in_group][pp.pp_id_in_analyzer] = {
                    port.position_on_pp: port for port in self.db.port.filter_by(patch_panel = pp.uuid).all()
                }
        connections = self.get_connections(ans, tables)

        for an_key, an in group.items():
            for pp_key, pp in an.items():
                for port_key, port in pp.items():
                    try:
                        connection = connections[an_key][pp_key][port_key]
                    except KeyError:
                        self.db.commit()
                        raise AGUpdateException((
                            'No data about port analyzer group: {0}, '
                            'unit: {1}, patch panel: {2}, port: {3}'
                            ).format(self.ag.name, an_key, pp_key, port_key)
                        )

                    if connection is not None:
                        port.connect_to = group[connection[0]][connection[1]][connection[2]].uuid
                    else:
                        port.connect_to = None

        self.ag.last_update = datetime.datetime.now()
        self.db.commit()

    def get_data(self, url, username, password):
        s = s = requests.Session()
        r = s.get(url, timeout=(2, 5))

        if r.status_code != 401:
            self.db.commit()
            raise AGUpdateException((
                'Invalid response from server {0} in {1}. phase of '
                'authentication, status code {2}, expected {3}'
                ).format(url, 1, r.status_code, 401)
            )

        r = s.get(url, auth=HTTPBasicAuth(username, password))

        if r.status_code != 200:
            self.db.commit()
            raise AGUpdateException((
                'Invalid response from server {0} in {1}. phase of '
                'authentication, status code {2}, expected {3}'
                ).format(url, 2, r.status_code, 200)
            )

        p = ConMapHTMLParser()
        p.feed(r.text)
        return p.get_table()

    def get_connections(selg, sources, tables):
        analyzers = dict()
        for source in sources:
            table = tables[source.analyzer_id_in_group]
            analyzers[source.analyzer_id_in_group] = dict()
            for db in range(len(table)):
                patch_panel = dict()
                for port in range(len(table[db])):
                    patch_panel[port+1] = None
                analyzers[source.analyzer_id_in_group][db+1] = patch_panel

        for source in sources:
            table = tables[source.analyzer_id_in_group]
            for db in range(len(table)):
                for port in range(len(table[db])):
                    if table[db][port]['class'] == 'connmap-con':
                        connection = re.split(
                            r'[ #]', table[db][port]['title']
                        )[2:]
                        analyzer_id = int(connection[1])
                        patch_panel = int(connection[3]) - 1
                        port_id = int(connection[5]) - 1
                        analyzers[source.analyzer_id_in_group][db+1][port+1] = (analyzer_id, patch_panel+1, port_id+1)
        return analyzers


class TopologyAgent(object):
    def __init__(self, db):
        self.db = db

    def start(self):
        """Start the periodic checking."""
        self.periodic = task.LoopingCall(self.update)
        self.periodic.start(300, True)

    def update_analyzer_group(self, ag_updater):
        try:
            ag_updater.update()
        except (RequestException, AGUpdateException) as e:
            log.msg(
                'Failed to update analyzer group {0}, error: {1!r}'
                .format(ag_updater.ag.name, e)
            )
        finally:
            ag_updater.db.commit()

    def update(self):
        log.msg('Topology sync started')
        for ag in self.db.analyzer_group.all():
            # thread pool over ag, access to db can't be threaded in twisted
            # (sqlalchemy is not compatible with twisted thread pool)
            # reactor.callInThread(
            #     self.update_analyzer_group, AGUpdater(self.db, ag)
            # )
            self.update_analyzer_group(AGUpdater(self.db, ag))
        log.msg('Topology sync finished')


# vim:set sw=4 ts=4 et:
# -*- coding: utf-8 -*-

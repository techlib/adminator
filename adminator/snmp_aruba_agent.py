#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

from twisted.internet import task
from twisted.python import log

import subprocess
import datetime
import threading
import time
import re

from sqlalchemy import and_
from sqlalchemy.orm.exc import NoResultFound

__all__ = ['SNMPArubaAgent']


class SNMPArubaAgent(object):
    status_oid = '1.3.6.1.2.1.1'
    oid_engine_time = '1.3.6.1.6.3.10.2.1.3'

    inter_oids = {
        'Speed': ('1.3.6.1.2.1.31.1.1.1.15', '#IF-MIB::ifSpeed.4227913 = Gauge32: 1000000000', 'Gauge32: ', 1),
        'AdminStatus': ('1.3.6.1.2.1.2.2.1.7', '#IF-MIB::ifAdminStatus.4227913 = INTEGER: up(1)', 'INTEGER: ', 1),
        'Description': (
            '1.3.6.1.2.1.2.2.1.2', '#IF-MIB::ifDescr.4227913 = STRING: GigabitEthernet1/0/37', 'STRING: ', 1
        ),
        'OperStatus': ('1.3.6.1.2.1.2.2.1.8', '#IF-MIB::ifOperStatus.4227913 = INTEGER: up(1)', 'INTEGER: ', 1),
        'LastChange': (
            '1.3.6.1.2.1.2.2.1.9', '#IF-MIB::ifLastChange.4227913 = Timeticks: (12849) 8 days, 17:10:01.11', '', 1
        ),
        'Name': (
            '1.3.6.1.2.1.31.1.1.1.1', '#IF-MIB::ifName.4227913 = STRING: GigabitEthernet1/0/37', 'STRING: ', 1
        ),
        'mapping-1': (
            '1.3.6.1.2.1.17.1.4.1.2', '#mapping - SNMPv2-SMI::mib-2.17.1.4.1.2.37 = INTEGER: 4227913',
            'INTEGER: ', 2
        ),
        'Vlan': (
            '1.3.6.1.2.1.17.7.1.4.5.1.1', '#SNMPv2-SMI::mib-2.17.7.1.4.5.1.1.4227913 = Gauge32: 13', 'Gauge32: ', 1
        ),
        'Alias': (
            '1.3.6.1.2.1.31.1.1.1.18', '#1.3.6.1.2.1.31.1.1.1.18.59 = STRING: S1.3.043', 'STRING: ', 1
        ),
        'mapping-2': (
            '1.3.6.1.2.1.17.4.3.1.2',
            '#mapping - SNMPv2-SMI::mib-2.17.7.1.2.2.1.2.13.24.169.5.52.121.109 = INTEGER: 37', 'INTEGER: ', 3
        ),
    }

    def __init__(self, db, snmpwalk_path, update_period, query_timeout):
        self.db = db
        self.snmpwalk_path = snmpwalk_path
        self.update_period = int(update_period)
        self.query_timeout = int(query_timeout)

    def start(self):
        """Start the periodic checking."""
        self.periodic = task.LoopingCall(self.update)
        self.periodic.start(self.update_period, True)

    def get_switch_status(self, ip, version, community, timeout):
        bashCommand = self.snmpwalk_path + ' -t {0} -Cc -c {1} -v {2} -ObentU {3} {4}'
        # oid = '1.3.6.1.2.1.1'
        oid = self.status_oid

        # 1.3.6.1.6.3.10.2.1.3 - snmp engine uptime in secs max value cca 50000 days
        # 1.3.6.1.2.1.1.3.0 - sysuptime in Timeticks max value cca 500 days

        informations = {
            '1.0': ('1.3.6.1.2.1.1.1.0', 'description', 'STRING: '),
            '2.0': ('1.3.6.1.2.1.1.2.0', 'objectID', 'OID: '),
            '3.0': ('1.3.6.1.2.1.1.3.0', 'uptime', ''),
            '4.0': ('1.3.6.1.2.1.1.4.0', 'contact', 'STRING: '),
            '5.0': ('1.3.6.1.2.1.1.5.0', 'name', 'STRING: '),
            '6.0': ('1.3.6.1.2.1.1.6.0', 'location', 'STRING: '),
            '7.0': ('1.3.6.1.2.1.1.7.0', 'services', 'INTEGER: '),
        }

        data = {}

        command = bashCommand.format(timeout, community, version, ip, oid)
        # ~ timeout - diferent (oid, ip) need diferent timeout => problem
        output = subprocess.check_output(command.split(), timeout=self.query_timeout).decode('utf-8')
        for line in output.split('\n')[:-1]:
            prefix_lenght = len(oid) + 2
            parsed_value = line[prefix_lenght:].split(' = ')
            if parsed_value[0] in informations:
                key = informations[parsed_value[0]][1]
                data_prefix = informations[parsed_value[0]][2]
                val = parsed_value[1][len(data_prefix):]
                data[key] = val

        # oid_engine_time = '1.3.6.1.6.3.10.2.1.3'
        oid_engine_time = self.oid_engine_time
        command = bashCommand.format(timeout, community, version, ip, oid_engine_time)
        output = subprocess.check_output(command.split(), timeout=self.query_timeout).decode('utf-8')
        parsed_value = output.split('\n')[0].split(' = INTEGER: ')
        data['engineUptime'] = parsed_value[1]

        return data

    def get_interfaces(self, ip, version, community, timeout):
        bashCommand = self.snmpwalk_path + ' -t {0} -Cc -c {1} -v {2} -ObentU {3} {4}'
        oids = self.inter_oids

        data = {}

        ordered_oids = [('mapping-2', oids['mapping-2']), ]
        for key, val in oids.items():
            if key != 'mapping-2':
                ordered_oids.append((key, val))

        for key, val in ordered_oids:

            oid = val[0]
            command = bashCommand.format(timeout, community, version, ip, oid)
            # ~ timeout - diferent (oid, ip) need diferent timeout => problem
            output = subprocess.check_output(command.split(), timeout=self.query_timeout).decode('utf-8')
            data[key] = []
            for x in output.split('\n')[:-1]:
                prefix_lenght = len(val[0]) + 2
                parsed_value = x[prefix_lenght:].split(' = ' + val[2])
                data[key].append(parsed_value)
        return self.join_data(data)

    def join_data(self, data):
        oids = self.inter_oids
        mapped_vals = {}

        for prop, oid in oids.items():
            if not oid[3] in mapped_vals:
                mapped_vals[oid[3]] = {}
            for val in data[prop]:
                if not val[0] in mapped_vals[oid[3]] and len(val) is 2:
                    mapped_vals[oid[3]][val[0]] = {}
                if len(val) is 2:
                    mapped_vals[oid[3]][val[0]][prop] = val[1]

        for key, val in mapped_vals[3].items():
            if 'mapping-2' in val:
                if val['mapping-2'] in mapped_vals[2]:
                    if not ('MACs' in mapped_vals[2][val['mapping-2']]):
                        mapped_vals[2][val['mapping-2']]['MACs'] = []
                    tmp_MAC = key.split('.')
                    MAC = "{:02X} {:02X} {:02X} {:02X} {:02X} {:02X}".format(
                        int(tmp_MAC[0]), int(tmp_MAC[1]), int(tmp_MAC[2]),
                        int(tmp_MAC[3]), int(tmp_MAC[4]), int(tmp_MAC[5])
                    )
                    mapped_vals[2][val['mapping-2']]['MACs'].append(MAC)

        for key, val in mapped_vals[2].items():
            if not ('MACs' in val):
                val['MACs'] = []
            if val['mapping-1'] in mapped_vals[1]:
                mapped_vals[1][val['mapping-1']]['MACs'] = val['MACs']

        for key, val in mapped_vals[1].items():
            if not ('MACs' in val):
                val['MACs'] = []

        return mapped_vals[1]

    def save_to_db(self, switch, data):
        sw_info = data['switch']
        self.save_if_to_db(switch, data['interfaces'], sw_info['uptime'])
        self.save_if_topology_to_db(switch, data['interfaces'])
        switch.uptime = '{} seconds'.format(int(sw_info['engineUptime']))
        switch.sys_description = sw_info['description']
        switch.sys_objectID = sw_info['objectID']
        switch.sys_contact = sw_info['contact']
        switch.sys_name = sw_info['name']
        switch.sys_location = sw_info['location']
        switch.sys_services = int(sw_info['services'])
        switch.last_update = datetime.datetime.now()
        self.db.commit()

    def process_speed(self, data, name, admin_status, oper_status):
        # link (adm) down, speed auto => non zero value
        if admin_status != 1 or oper_status != 1:
            return None
        speed = int(data)
        if speed == 0:
            return None

        return speed

    def process_vlan(self, data):
        vlan = int(data)
        if vlan < 1 or vlan > 4096:
            vlan = None
        return vlan

    def process_last_change(self, data, sw_uptime):
        last_change = int(data)
        uptime = int(sw_uptime)
        if last_change < 1:
            return None
        if last_change > uptime:
            # limitation of SNMP Timeticks datatype (max value = 4294967295 eq. 500 days)
            uptime += 4294967296
        return '{} seconds'.format((uptime - last_change) // 100)

    def save_if_topology_to_db(self, switch, data):
        analyzer = self.db.analyzer.filter_by(name=switch.name).one()

        for key, val in data.items():
            if not re.match(r'\d+/\d+', val['Name']):
                continue
            unit_number, interface_number = map(int, val['Name'].split('/', 2))
            where = and_(self.db.patch_panel.analyzer == analyzer.uuid,
                         self.db.patch_panel.pp_id_in_analyzer == unit_number)
            try:
                patch_panel = self.db.patch_panel.filter(where).one()
            except NoResultFound:
                self.db.patch_panel.insert(pp_id_in_analyzer=unit_number, analyzer=analyzer.uuid)
                self.db.commit()
            finally:
                patch_panel = self.db.patch_panel.filter(where).one()

            where = and_(self.db.port.patch_panel == patch_panel.uuid,
                         self.db.port.name == val['Name'])
            try:
                port = self.db.port.filter(where).one()
            except NoResultFound:
                self.db.port.insert(
                    patch_panel=patch_panel.uuid,
                    position_on_pp=interface_number,
                    name=val['Name'],
                    type='sw'
                )
                self.db.commit()
            finally:
                port = self.db.port.filter(where).one()

            try:
                other_port = self.db.port.filter_by(name=val['Alias']).one()
                other_port.connect_to = port.uuid
                port.connect_to = other_port.uuid
                self.db.commit()
            except NoResultFound:
                pass

            where = and_(self.db.sw_interface.switch == switch.uuid,
                         self.db.sw_interface.name == val['Name'])
            interface = self.db.sw_interface.filter(where).one()
            if interface.port != port.uuid:
                interface.port = port.uuid
                self.db.commit()

    def save_if_to_db(self, switch, data, sw_uptime):
        for key, val in data.items():
            where = and_(self.db.sw_interface.switch == switch.uuid, self.db.sw_interface.name == val['Name'])
            try:
                interface = self.db.sw_interface.filter(where).one()
            except NoResultFound:
                self.db.sw_interface.insert(name=val['Name'], switch=switch.uuid)
                self.db.commit()

        update_time = datetime.datetime.now()
        for key, val in data.items():
            if not ('Vlan' in val):
                val['Vlan'] = 0
            where = and_(self.db.sw_interface.switch == switch.uuid, self.db.sw_interface.name == val['Name'])
            interface = self.db.sw_interface.filter(where).one()

            # SNMP up = 1, down = 2
            interface.admin_status = 2 - int(val['AdminStatus'])
            interface.oper_status = 2 - int(val['OperStatus'])

            interface.speed = self.process_speed(
                val['Speed'], val['Name'], interface.admin_status, interface.oper_status
            )
            interface.vlan = self.process_vlan(val['Vlan'])

            interface.last_change = self.process_last_change(val['LastChange'], sw_uptime)

            self.db.mac_address.filter_by(interface=interface.uuid).delete()
            if interface.ignore_macs is False:
                if len(val['MACs']) > 0:
                    self.db.last_macs_on_interface.filter_by(interface=interface.uuid).delete()
                for mac in val['MACs']:
                    self.db.mac_address.insert(mac_address=mac, interface=interface.uuid,)
                    self.db.last_macs_on_interface.insert(
                        mac_address=mac, interface=interface.uuid, time=update_time)
                    try:
                        db_mac = self.db.last_interface_for_mac.filter(
                            self.db.last_interface_for_mac.mac_address == mac
                        ).one()
                        db_mac.interface = interface.uuid
                        db_mac.time = update_time
                    except NoResultFound:
                        self.db.last_interface_for_mac.insert(
                            mac_address=mac, interface=interface.uuid, time=update_time
                        )
            else:
                self.db.last_macs_on_interface.filter_by(interface=interface.uuid).delete()
                self.db.last_interface_for_mac.filter_by(interface=interface.uuid).delete()

        self.db.commit()

    def parallel_update(self, switch, output):
        start = time.time()
        try:
            output[switch.uuid]['interfaces'] = self.get_interfaces(
                switch.ip_address, switch.snmp_version,
                switch.snmp_community, switch.snmp_timeout
            )
            output[switch.uuid]['switch'] = self.get_switch_status(
                switch.ip_address, switch.snmp_version,
                switch.snmp_community, switch.snmp_timeout
            )
        except Exception as e:
            log.msg(('Error while getting data from {}({}), {}'.format(switch.name, switch.ip_address, e)))
            return
        log.msg('{} finished ({:.03f} s)'.format(switch.name, time.time() - start))

    def update(self):
        log.msg('Interface status sync started')
        start = time.time()
        threads = []
        data = {}
        for switch in self.db.switch.filter_by(enable=True, type='aruba').all():
            data[switch.uuid] = {'switch': None, 'interfaces': None}
            t = threading.Thread(target=self.parallel_update, args=(switch, data))
            t.start()
            threads.append(t)

        for t in threads:
            t.join()

        for switch in self.db.switch.filter_by(enable=True, type='aruba').all():
            if data[switch.uuid]:
                try:
                    self.save_to_db(switch, data[switch.uuid])
                except Exception as e:
                    log.msg(('Error during saving data from {}({}) to db, {}'.format(
                        switch.name, switch.ip_address, e,
                    )))

        log.msg('Interface status sync finished ({:.03f} s)'.format(time.time() - start))

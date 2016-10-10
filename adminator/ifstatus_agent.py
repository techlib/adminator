#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

# from twisted.internet import reactor
from twisted.internet import task
from twisted.python import log

import subprocess
import datetime
from sqlalchemy import and_

__all__ = ['IFStatusAgent']


class IFStatusAgent(object):
	def __init__(self, db):
		self.db = db

	def start(self):
		"""Start the periodic checking."""
		self.periodic = task.LoopingCall(self.update)
		self.periodic.start(300, True)

	def get_interfaces(self, ip, version, community, timeout):
		bashCommand = "snmpwalk -t {0} -Cc -c {1} -v {2} -ObentU {3} {4}"
		oids = {
			'Speed':('1.3.6.1.2.1.2.2.1.5', '#IF-MIB::ifSpeed.4227913 = Gauge32: 1000000000', 'Gauge32: ', 1),
			'AdminStatus':('1.3.6.1.2.1.2.2.1.7', '#IF-MIB::ifAdminStatus.4227913 = INTEGER: up(1)', 'INTEGER: ', 1),
			'Description':('1.3.6.1.2.1.2.2.1.2', '#IF-MIB::ifDescr.4227913 = STRING: GigabitEthernet1/0/37', 'STRING: ', 1),
			'OperStatus':('1.3.6.1.2.1.2.2.1.8', '#IF-MIB::ifOperStatus.4227913 = INTEGER: up(1)', 'INTEGER: ', 1),
			'LastChange':('1.3.6.1.2.1.2.2.1.9', '#IF-MIB::ifLastChange.4227913 = Timeticks: (1284900111) 148 days, 17:10:01.11', '', 1),
			'Name':('1.3.6.1.2.1.31.1.1.1.1', '#IF-MIB::ifName.4227913 = STRING: GigabitEthernet1/0/37', 'STRING: ', 1),
			'mapping-1':('1.3.6.1.2.1.17.1.4.1.2', '#mapping - SNMPv2-SMI::mib-2.17.1.4.1.2.37 = INTEGER: 4227913', 'INTEGER: ', 2),
			#~ 'MAC':('1.3.6.1.2.1.17.4.3.1.1', '#SNMPv2-SMI::mib-2.17.4.3.1.1.24.169.5.52.121.109 = Hex-STRING: 18 A9 05 34 79 6D ', 'Hex-STRING: ', 3),
			'Vlan':('1.3.6.1.2.1.17.7.1.4.5.1.1', '#SNMPv2-SMI::mib-2.17.7.1.4.5.1.1.4227913 = Gauge32: 13', 'Gauge32: ', 1),
			'mapping-2':('1.3.6.1.2.1.17.4.3.1.2', '#mapping - SNMPv2-SMI::mib-2.17.7.1.2.2.1.2.13.24.169.5.52.121.109 = INTEGER: 37', 'INTEGER: ', 3),
		}

		data = {}

		for key, val in oids.items():
			oid = val[0]
			command = bashCommand.format(timeout, community, version, ip, oid)
			#~ TODO: timeout
			process = subprocess.Popen(command.split(), stdout=subprocess.PIPE)
			output = process.communicate()[0].decode('utf-8')
			data[key] = []
			for x in output.split('\n')[:-1]:
				prefix_lenght = len(val[0]) + 2 
				parsed_value = x[prefix_lenght:].split(' = ' + val[2])
				data[key].append(parsed_value)

		mapped_vals = {}

		for prop, oid in oids.items():
			if not oid[3] in mapped_vals:
				mapped_vals[oid[3]] = {}
			for val in data[prop]:
				if not val[0] in mapped_vals[oid[3]]:
					mapped_vals[oid[3]][val[0]] = {}
				if len(val) is 2:
					mapped_vals[oid[3]][val[0]][prop] = val[1]

		for key, val in mapped_vals[3].items():
			if 'mapping-2' in val:
				if val['mapping-2'] in mapped_vals[2]:
					if not 'MACs' in mapped_vals[2][val['mapping-2']]:
						mapped_vals[2][val['mapping-2']]['MACs'] = []
					tmp_MAC = key.split('.')
					MAC = "{:02X} {:02X} {:02X} {:02X} {:02X} {:02X}".format(int(tmp_MAC[0]), int(tmp_MAC[1]), int(tmp_MAC[2]), int(tmp_MAC[3]), int(tmp_MAC[4]), int(tmp_MAC[5]))
					mapped_vals[2][val['mapping-2']]['MACs'].append(MAC)

		for key, val in mapped_vals[2].items():
			if not 'MACs' in val:
				val['MACs'] = []
			if val['mapping-1'] in mapped_vals[1]:
				mapped_vals[1][val['mapping-1']]['MACs'] = val['MACs']

		for key, val in mapped_vals[1].items():
			if not 'MACs' in val:
				val['MACs'] = []

		return  mapped_vals[1]

	def update(self):
		log.msg('Interface status sync started')
		data = {}
		for switch in self.db.switch.filter_by(enable = True).all():
			snmp_profile = self.db.snmp_profile.get(switch.snmp_profile)
			#~ reactor.callInThread(
				#~ data[switch.uuid] = self.get_interfaces(
					#~ switch.ip_address, snmp_profile.version,
					#~ snmp_profile.community, snmp_profile.timeout
				#~ ) 
			#~ )
			data[switch.uuid] = self.get_interfaces(
				switch.ip_address, snmp_profile.version,
				snmp_profile.community, snmp_profile.timeout
			)

		

		for switch in self.db.switch.filter_by(enable = True).all():
			for key, val in data[switch.uuid].items():
				if not 'Vlan' in val:
					val['Vlan'] = 0
				where = and_(self.db.interface.switch == switch.uuid, self.db.interface.name == val['Name'])
				#~ TODO:
				#~ no row (new sw in stack, etc) or multiple ((switch, name) is uniq pair -> no multiple)
				#~ http://docs.sqlalchemy.org/en/latest/orm/query.html#sqlalchemy.orm.query.Query.one
				interface = self.db.interface.filter(where).one()

				interface.admin_status = val['AdminStatus']
				interface.oper_status = val['OperStatus']
				interface.speed = int(val['Speed'])
				interface.vlan = int(val['Vlan'])
				self.db.mac_address.filter_by(interface = interface.uuid).delete()
				if interface.ignore_macs is False:
					for mac in val['MACs']:
						self.db.mac_address.insert(
							mac_address = mac,
							interface = interface.uuid,
						)
			switch.last_update = datetime.datetime.now()
			self.db.commit()
		log.msg('Interface status sync finished')


# vim:set sw=4 ts=4 et:
# -*- coding: utf-8 -*-

import flexmock
from adminator.snmp_hp_agent import SNMPHPAgent

agent = SNMPHPAgent(None, None, 0, 0)

data = [
    '.1.3.6.1.2.1.2.2.1.5.4227625 = Gauge32: 1000000000',
    '.1.3.6.1.2.1.2.2.1.7.4227625 = INTEGER: 1',
    '.1.3.6.1.2.1.2.2.1.8.4227625 = INTEGER: 1',
    '.1.3.6.1.2.1.2.2.1.2.4227625 = STRING: GigabitEthernet1/0/1',
    '.1.3.6.1.2.1.2.2.1.9.4227625 = 2495809143',
    '.1.3.6.1.2.1.31.1.1.1.1.4227625 = STRING: GigabitEthernet1/0/1',
    '.1.3.6.1.2.1.17.7.1.4.5.1.1.4227625 = Gauge32: 1',
    '.1.3.6.1.2.1.17.1.4.1.2.1 = INTEGER: 4227625',
    '.1.3.6.1.2.1.17.4.3.1.2.0.36.140.82.153.60 = INTEGER: 1',
]

data_out = {'4227625': {
    'AdminStatus': '1',
    'LastChange': '2495809143',
    'Name': 'GigabitEthernet1/0/1',
    'Description': 'GigabitEthernet1/0/1',
    'OperStatus': '1',
    'MACs': ['00 24 8C 52 99 3C'],
    'Vlan': '1',
    'Speed': '1000000000'
}}

speed_1M = '1000000'
speed_10M = '10000000'
speed_100M = '100000000'
speed_1G = '1000000000'
speed_special = '4294967295'
up = 1
down = 0

def test_process_speed():
    assert agent.process_speed('1', '', up, up) == None
    assert agent.process_speed(speed_1M, '', up, up) == 1
    assert agent.process_speed(speed_10M, '', up, up) == 10
    assert agent.process_speed(speed_100M, '', up, up) == 100
    assert agent.process_speed(speed_1G, '', up, up) == 1000

def test_process_speed_status():
    assert agent.process_speed(speed_1M, '', down, down) == None
    assert agent.process_speed(speed_1M, '', down, up) == None
    assert agent.process_speed(speed_1M, '', up, down) == None
    assert agent.process_speed(speed_1M, '', up, up) == 1

def test_process_speed_special():
    assert agent.process_speed(speed_special, '', up, up) == None
    assert agent.process_speed(speed_special, 'ten-gigabitethernet', up, up) == 10000
    assert agent.process_speed(speed_special, 'Ten-GigabitEthernet', up, up) == 10000
    assert agent.process_speed(speed_special, 'TEN-GIGABITETHERNET', up, up) == 10000

def test_process_vlan():
    assert agent.process_vlan('1') == 1
    assert agent.process_vlan('2000') == 2000
    assert agent.process_vlan('4096') == 4096
    assert agent.process_vlan('4097') == None
    assert agent.process_vlan('9999999') == None
    assert agent.process_vlan('-1') == None

def test_process_last_change():
    assert agent.process_last_change('100', '100') == '0 seconds'
    assert agent.process_last_change('100', '1100') == '10 seconds'
    assert agent.process_last_change('0', '1100') == None
    assert agent.process_last_change('4294967296', '100') == '1 seconds'

def test_oid():
    parsed_data = {}
    for name, oid in agent.inter_oids.items():
        acc = False
        for row in data:
            if row.startswith('.' + oid[0]):
                acc = True
                prefix_lenght = len(oid[0]) + 2
                parsed_value = row[prefix_lenght:].split(' = ' + oid[2])
                parsed_data[name] = [parsed_value,]
                break
        if not acc:
            print(name, oid)
        assert acc
    assert agent.join_data(parsed_data) == data_out

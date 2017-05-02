from adminator.config_comware_agent.parser import CfgParser
from adminator.config_comware_agent import ConfigComwareAgent
import flexmock

config = '''
#
 sysname FDS3.4
#
 ndp enable
#
 loopback-detection enable
 loopback-detection multi-port-mode enable
#
local-user admin
 password cipher HASH1
 authorization-attribute level 3
 service-type ssh telnet terminal
 service-type web
local-user manager
 password cipher HASH2
 authorization-attribute level 3
 service-type telnet terminal
 service-type web
#
interface GigabitEthernet1/0/1
 port link-type trunk
 port trunk permit vlan 1
 voice vlan 20 enable
 loopback-detection enable
 broadcast-suppression pps 3000
 undo jumboframe enable
 poe enable
 stp edged-port enable
 port-security port-mode mac-else-userlogin
#
'''

parsed = [
    ('sysname', ['sysname FDS3.4'], True), ('ndp', ['ndp enable'], True),
    ('loopback-detection', ['loopback-detection enable', 'loopback-detection multi-port-mode enable'], True),
    ('local-user admin', [
        'password cipher HASH1',
        'authorization-attribute level 3',
        'service-type ssh telnet terminal',
        'service-type web'
    ], False),
    ('local-user manager', [
        'password cipher HASH2',
        'authorization-attribute level 3',
        'service-type telnet terminal',
        'service-type web'
    ], False),
    ('interface GigabitEthernet1/0/1', [
        'port link-type trunk',
        'port trunk permit vlan 1',
        'voice vlan 20 enable',
        'loopback-detection enable',
        'broadcast-suppression pps 3000',
        'undo jumboframe enable',
        'poe enable',
        'stp edged-port enable',
        'port-security port-mode mac-else-userlogin'
    ], False),
]

tree = [
    {
        'name': 'sysname',
        'options': ['sysname FDS3.4'],
        'syscfg': True
    },{
        'name': 'ndp',
        'options': ['ndp enable'],
        'syscfg': True
    },{
        'name': 'loopback-detection',
        'options': [
            'loopback-detection enable',
            'loopback-detection multi-port-mode enable'
            ],
        'syscfg': True
    },{
        'name': 'local-user admin',
        'options': [
            'password cipher HASH1',
            'authorization-attribute level 3',
            'service-type ssh telnet terminal',
            'service-type web'
        ],
        'syscfg': False
    },{
        'name': 'local-user manager',
        'options': [
            'password cipher HASH2',
            'authorization-attribute level 3',
            'service-type telnet terminal',
            'service-type web'
        ],
        'syscfg': False
    },{
        'name': 'interface GigabitEthernet1/0/1',
        'options': [
                'port link-type trunk',
                'port trunk permit vlan 1',
                'voice vlan 20 enable',
                'loopback-detection enable',
                'broadcast-suppression pps 3000',
                'undo jumboframe enable',
                'poe enable',
                'stp edged-port enable',
                'port-security port-mode mac-else-userlogin'
            ],
        'syscfg': False
    }
]

interface = {
    'name': 'interface GigabitEthernet1/0/1',
    'options': [
        'port link-type trunk',
        'port trunk permit vlan 1',
        'voice vlan 20 enable',
        'loopback-detection enable',
        'broadcast-suppression pps 3000',
        'undo jumboframe enable',
        'poe enable',
        'stp edged-port enable',
        'port-security port-mode mac-else-userlogin'
    ],
    'syscfg': False
}

pattern_1 = flexmock(
    mandatory=[
        'port link-type trunk',
        'port trunk permit vlan 1',
        'voice vlan 20 enable',
        'loopback-detection enable',
        'broadcast-suppression pps 3000',
        'undo jumboframe enable',
        'poe enable',
        'stp edged-port enable',
        'port-security port-mode mac-else-userlogin'
    ], optional=[]
)

pattern_2 = flexmock(
    mandatory=[],
    optional=[
        'port link-type trunk',
        'port trunk permit vlan 1',
        'voice vlan 20 enable',
        'loopback-detection enable',
        'broadcast-suppression pps 3000',
        'undo jumboframe enable',
        'poe enable',
        'stp edged-port enable',
        'port-security port-mode mac-else-userlogin'
    ]
)

pattern_3 = flexmock(
    mandatory=['.*'], optional=[]
)

pattern_4 = flexmock(
    mandatory=[], optional=['.*']
)

pattern_5 = flexmock(
    mandatory=[
        'port link-type trunk',
        'port trunk permit vlan \d+',
        'voice vlan 20 enable',
        'loopback-detection enable',
        'broadcast-suppression pps 3000',
        'undo jumboframe enable',
        'stp edged-port enable',
        'port-security port-mode mac-else-userlogin'
    ], optional=[
        'poe enable',
        'shutdown'
    ]
)

pattern_6 = flexmock(
    mandatory=[
        'port link-type trunk',
        'port trunk permit vlan \d+',
        'loopback-detection enable',
        'broadcast-suppression pps 3000',
        'undo jumboframe enable',
        'stp edged-port enable',
        'port-security port-mode mac-else-userlogin'
    ], optional=[
        'poe enable',
        'shutdown'
    ]
)

pattern_7 = flexmock(
    mandatory=[
        'port link-type trunk',
        'port trunk permit vlan \d+',
        'voice vlan 20 enable',
        'loopback-detection enable',
        'broadcast-suppression pps 3000',
        'undo jumboframe enable',
        'stp edged-port enable',
        'port-security port-mode mac-else-userlogin'
    ], optional=[
        'shutdown'
    ]
)


def test_cfg_parser():
    parser = CfgParser()
    print(parser.parse(config))
    assert parser.parse(config) == parsed


def test_cfg_tree():
    parser = CfgParser()
    conf = []
    for item in parser.parse(config):
        conf.append({'name': item[0], 'options': item[1], 'syscfg': item[2]})
    assert conf == tree

def test_pattern_match():
    agent = ConfigComwareAgent(None, None, 0, '', '', '')
    assert agent.pattern_match(pattern_1, interface['options']) == True
    assert agent.pattern_match(pattern_2, interface['options']) == True
    assert agent.pattern_match(pattern_3, interface['options']) == True
    assert agent.pattern_match(pattern_4, interface['options']) == True
    assert agent.pattern_match(pattern_5, interface['options']) == True
    assert agent.pattern_match(pattern_6, interface['options']) == False
    assert agent.pattern_match(pattern_7, interface['options']) == False

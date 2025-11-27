#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

__all__ = ['generate_kea_config', 'DEFAULTS']

from copy import deepcopy
from collections import Mapping
from uuid import UUID
from struct import unpack
from codecs import encode, decode
from sqlmodel import select
from adminator.db_entity.network import Network, NetworkPool, DhcpOption, DhcpOptionValue, Interface
import ipaddress

DEFAULTS = {
    'Dhcp4': {
        'valid-lifetime': 4000,
        'renew-timer':    1000,
        'rebind-timer':   2000,

        'interfaces-config': {
            'interfaces': ['*'],
        },

        'lease-database': {
            'type': 'postgresql',
            'name': 'network',
            'user': 'network',
        },
    }
}

DEFAULTS6 = {
    'Dhcp6': {
        'valid-lifetime': 4000,
        'renew-timer':    1000,
        'rebind-timer':   2000,

        'interfaces-config': {
            'interfaces': ['*'],
        },

        'lease-database': {
            'type': 'postgresql',
            'name': 'network',
            'user': 'network',
        },
    }
}

def generate_kea_config(db, tpl=DEFAULTS):
    """
    Generate KEA configuration file from database.

    If a ``tpl`` is specified, all configuration within is kept and a
    version that merely extends it is produced. If no template is given,
    missing options will have sane default values.

    :param db: SQLSoup object to get data from.
    :param tpl: Template to extend instead of starting from scratch.
    :return: Dictionary that can be JSON-encoded and written out.
    """
    def get_global_option_value_by_code(code, family='inet'):
        """
        Find DHCP option value by code.

        family: 'inet' for IPv4, 'inet6' for IPv6.
        Finds DhcpOption(family=family, code=code) and its DhcpOptionValue
        with network=None, device=None.
        """
        # Find (DhcpOption)
        opt = None
        for o in db().exec(
            select(DhcpOption).filter_by(family=family).where(DhcpOption.code == code)
        ):
            opt = o
            break

        if opt is None:
            return None

        # Get option value (DhcpOptionValue)
        val = None
        for v in db().exec(
            select(DhcpOptionValue).filter_by(
                network=None,
                device=None,
                option=opt.name
            )
        ):
            val = v
            break

        return val.value if val is not None else None

    def update_boot_file_client_classes(config):
        """
        Take options 224 (BIOS) and 225 (UEFI) and fill them into
        Dhcp4.client-classes[].option-data[].data instead of 'boot.bios'/'boot.uefi'.
        """
        dhcp4 = config.get('Dhcp4', {})
        classes = dhcp4.get('client-classes', [])
        if not classes:
            return

        bios_boot = get_global_option_value_by_code(224, family='inet')
        uefi_boot = get_global_option_value_by_code(225, family='inet')

        for cls in classes:
            name = cls.get('name')
            opts = cls.get('option-data', []) or []

            for od in opts:
                if od.get('name') != 'boot-file-name':
                    continue

                # UEFI class
                if name == 'UEFI' and uefi_boot:
                    od['data'] = uefi_boot

                # BIOS class
                if name == 'BIOS' and bios_boot:
                    od['data'] = bios_boot

    def dhcp4_config():
        config = {
            'option-data': list(options(None, None, 4)),
            'subnet4': list(subnets(4)),
        }

        nexts = next_server(None, None)
        if nexts:
            config['next-server'] = nexts

        return config

    def dhcp6_config():
        return {
            'option-data': list(options(None, None, 6)),
            'subnet6': list(subnets(6)),
        }

    def subnets(v):
        for net in db().exec(select(Network)):
            if v == 4 and net.prefix4 is not None:
                config = {
                    'id': uuid2bigint(str(net.uuid)),
                    'subnet': net.prefix4,
                    'pools': list(pools(str(net.uuid), v)),
                    'option-data': list(options(str(net.uuid), None, 4)),
                    'reservations': list(reservations(str(net.uuid), 4)),
                    'reservation-mode': 'all',
                    'user-context': {
                        'description': net.description,
                        'vlan': net.vlan
                    },
                }

                nexts = next_server(str(net.uuid), None)
                if nexts is not None:
                    config['next-server'] = nexts

                yield config

            elif v == 6 and net.prefix6 is not None:
                yield {
                    'id': uuid2bigint(str(net.uuid)),
                    'subnet': net.prefix6,
                    'pools': list(pools(str(net.uuid), v)),
                    'option-data': list(options(str(net.uuid), None, 6)),
                    'reservations': list(reservations(str(net.uuid), 6)),
                    'reservation-mode': 'all',
                    'user-context': {
                        'description': net.description,
                        'vlan': net.vlan
                    },
                }

    def pools(net, v):
        for pool in db().exec(select(NetworkPool).filter(NetworkPool.network == net)):
            if v == 4 and '.' in pool.range[0]:
                yield {'pool': '{} - {}'.format(*pool.range)}
            elif v == 6 and ':' in pool.range[0]:
                yield {'pool': '{} - {}'.format(*pool.range)}

    def next_server(net=None, dev=None):
        options = db().exec(select(DhcpOptionValue).filter_by(network=net, device=dev, option='next-server'))

        for option in options:
            return option.value

        return None

    def options(net, dev, family):
        f = 'inet' if family == 4 else 'inet6'

        types = {o.name: o for o in db().exec(select(DhcpOption).filter_by(family=f))}

        for v in db().exec(select(DhcpOptionValue).filter_by(network=net, device=dev)):
            if v.option not in types:
                continue

            otype = types[v.option]

            if family == 4 and otype.code in (224, 225):
                continue

            if otype.name == 'next-server':
                continue

            if otype.type == 'binary':
                csv = False
                value = decode(encode(bytes(v.value, 'utf8'), 'hex'), 'utf8')
            else:
                csv = True
                value = v.value

            yield {
                'name': otype.name,
                'code': otype.code,
                'space': 'dhcp4' if family == 4 else 'dhcp6',
                'csv-format': csv,
                'data': value,
            }

    def reservations(net, family):

        for iface in db().exec(select(Interface).filter_by(network=net)):
            reservation = {
                'hw-address': iface.macaddr,
            }

            if iface.hostname:
                reservation['hostname'] = iface.hostname

            if family == 4 and iface.ip4addr is not None and \
                    ipaddress.ip_address(iface.ip4addr) in ipaddress.ip_network(iface.network_.prefix4):
                reservation['ip-address'] = iface.ip4addr
            elif family == 6 and iface.ip6addr is not None and \
                    ipaddress.ip_address(iface.ip6addr) in ipaddress.ip_network(iface.network_.prefix6):
                reservation['ip-address'] = iface.ip6addr
            else:
                continue

            yield reservation

    c = deepcopy(tpl)
    dict_update_r(c, {
        'Dhcp4': dhcp4_config(),
#        'Dhcp6': dhcp6_config(),
    })
    update_boot_file_client_classes(c)
    return c


def dict_update_r(dst, src):
    """Recursive dict merge."""

    for k, v in src.items():
        if isinstance(dst.get(k), Mapping) and isinstance(src[k], Mapping):
            dict_update_r(dst[k], src[k])
        else:
            dst[k] = src[k]


def uuid2bigint(uuid):
    """Compress UUID string to a 32 bit integer."""
    a, b, c, d = unpack('!LLLL', UUID(uuid).bytes)
    return (a ^ b ^ c ^ d)


# vim:set sw=4 ts=4 et:

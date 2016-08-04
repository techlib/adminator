#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

__all__ = ['generate_kea_config', 'DEFAULTS']

from copy import deepcopy
from collections import Mapping
from uuid import UUID
from struct import unpack

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
    },

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
        for net in db.network.all():
            if v == 4 and net.prefix4 is not None:
                config = {
                    'id': uuid2bigint(net.uuid),
                    'subnet': net.prefix4,
                    'pools': list(pools(net.uuid, v)),
                    'option-data': list(options(net.uuid, None, 4)),
                    'reservations': list(reservations(net.uuid, 4)),
                    'reservation-mode': 'all',
                }

                nexts = next_server(net.uuid, None)
                if nexts is not None:
                    config['next-server'] = nexts

                yield config

            elif v == 6 and net.prefix6 is not None:
                yield {
                    'id': uuid2bigint(net.uuid),
                    'subnet': net.prefix6,
                    'pools': list(pools(net.uuid, v)),
                    'option-data': list(options(net.uuid, None, 6)),
                    'reservations': list(reservations(net.uuid, 6)),
                    'reservation-mode': 'all',
                }

    def pools(net, v):
        for pool in db.network_pool.filter_by(network=net).all():
            if v == 4 and '.' in pool.range[0]:
                yield {'pool': '{} - {}'.format(*pool.range)}
            elif v == 6 and ':' in pool.range[0]:
                yield {'pool': '{} - {}'.format(*pool.range)}

    def next_server(net=None, dev=None):
        options = db.option_value.filter_by(network=net, device=dev, option='next-server').all()

        for option in options:
            return option.value

        return None

    def options(net, dev, family):
        f = 'inet' if family == 4 else 'inet6'
        types = {o.name: o for o in db.option.filter_by(family=f).all()}

        for v in db.option_value.filter_by(network=net, device=dev).all():
            if v.option not in types:
                continue

            otype = types[v.option]

            if otype.name == 'next-server':
                continue

            yield {
                'name': otype.name,
                'code': otype.code,
                'space': 'dhcp4' if family == 4 else 'dhcp6',
                'csv-format': True,
                'data': v.value,
            }

    def reservations(net, family):
        for iface in db.interface.filter_by(network=net).all():
            reservation = {
                'hw-address': iface.macaddr,
            }

            if iface.hostname:
                reservation['hostname'] = iface.hostname

            if family == 4 and iface.ip4addr is not None:
                reservation['ip-address'] = iface.ip4addr
            elif family == 6 and iface.ip6addr is not None:
                reservation['ip-address'] = iface.ip6addr
            else:
                continue

            yield reservation

    c = deepcopy(tpl)
    dict_update_r(c, {
        'Dhcp4': dhcp4_config(),
        'Dhcp6': dhcp6_config(),
    })

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

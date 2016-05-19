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
        return {
            'option-data': list(options(None, None, 4)),
            'subnet4': list(subnets(4)),
        }

    def dhcp6_config():
        return {
            'option-data': list(options(None, None, 6)),
            'subnet6': list(subnets(6)),
        }

    def subnets(v):
        for net in db.network.all():
            if v == 4 and net.prefix4 is not None:
                yield {
                    'id': uuid2bigint(net.uuid),
                    'subnet': net.prefix4,
                    'pools': list(pools(net.uuid, v)),
                    'option-data': list(options(net.uuid, None, 4)),
                    'reservations': list(reservations(net.uuid, 4)),
                }
            elif v == 6 and net.prefix6 is not None:
                yield {
                    'id': uuid2bigint(net.uuid),
                    'subnet': net.prefix6,
                    'pools': list(pools(net.uuid, v)),
                    'option-data': list(options(net.uuid, None, 6)),
                    'reservations': list(reservations(net.uuid, 6)),
                }

    def pools(net, v):
        for pool in db.network_pool.filter_by(network=net).all():
            if v == 4 and '.' in pool.range[0]:
                yield {'pool': '{} - {}'.format(*pool.range)}
            elif v == 6 and ':' in pool.range[0]:
                yield {'pool': '{} - {}'.format(*pool.range)}

    def options(net, dev, family):
        f = 'inet' if family == 4 else 'inet6'
        types = {o.name: o for o in db.option.filter_by(family=f).all()}

        for v in db.option_value.filter_by(network=net, device=dev).all():
            if v.option not in types:
                continue

            otype = types[v.option]

            yield {
                'name': otype.name,
                'code': otype.code,
                'space': 'dhcp4' if family == 4 else 'dhcp6',
                'csv-format': True,
                'data': v.value,
            }

    def reservations(net, family):
        for iface in db.interface.filter_by(network=net).all():
            if family == 4 and iface.ip4addr is not None:
                yield {
                    'hw-address': iface.macaddr,
                    'ip-address': iface.ip4addr,
                    'hostname': iface.hostname or '',
                }
            elif family == 6 and iface.ip6addr is not None:
                yield {
                    'hw-address': iface.macaddr,
                    'ip-address': iface.ip6addr,
                    'hostname': iface.hostname or '',
                }

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
    """Return lower 64 bits of the uuid as an integer."""
    return unpack('!Q', UUID(uuid).bytes[-8:])[0]


# vim:set sw=4 ts=4 et:

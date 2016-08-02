#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

import re

from sys import argv, stdin, stdout, stderr, exit
from datetime import datetime
from getopt import gnu_getopt
from ipaddress import ip_address, ip_network
from struct import unpack
from json import load

def parse_leases(data):
    leases = {}
    data = data.replace('\n', '\v')

    for address, section in re.findall(r'lease ([0-9.]+) {(.*?)}', data):
        fields = dict([tuple(re.split('\s+', row.strip(' ;'), 1)) \
                      for row in section.split('\v')
                      if len(row.strip()) > 0])

        if 'uid' in fields:
            del fields['uid']

        if 'starts' not in fields or 'ends' not in fields or 'hardware' not in fields:
            continue

        if fields.get('binding') != 'state active':
            continue

        hwaddr = fields['hardware'].split(' ')[1]
        ends = datetime.strptime(fields['ends'], '%w %Y/%m/%d %H:%M:%S')

        leases[address] = {
            'address': address,
            'hwaddr': hwaddr,
            'expire': ends.strftime('%Y-%m-%d %H:%M:%S+00'),
        }

    return leases


if __name__ == '__main__':
    import csv

    def do_convert(kea_conf, leases, postgres, **kwargs):
        with open(leases) as fp:
            leases = parse_leases(fp.read())

        with open(kea_conf) as fp:
            kea = load(fp)

        subnets = []
        for subnet in kea['Dhcp4']['subnet4']:
            subnets.append((subnet['id'], ip_network(subnet['subnet'])))

        def find_subnet_id(address):
            for subnet_id, subnet in subnets:
                if address in subnet:
                    return str(subnet_id)

            print('No subnet for {}'.format(address), file=stderr)
            exit(1)

        for lease in leases.values():
            lease['subnet_id'] = find_subnet_id(ip_address(lease['address']))

        if postgres:
            for lease in leases.values():
                address = ip_address(lease['address']).packed
                hwaddr = lease['hwaddr'].replace(':', '')


                lease.update({
                    'address': unpack('!I', address)[0],
                    'hwaddr': r'\x' + hwaddr,
                })

        w = csv.DictWriter(stdout, ['address', 'hwaddr', 'expire', 'subnet_id'])
        w.writerows(leases.values())

    def do_help(*args, **kwargs):
        print('Usage: leases2csv.py [--kea-conf=kea.conf] [--leases=dhcpd.leases]')
        print('Generate CSV from the lease file with network numbers from kea.conf.')
        print('')
        print('OPTIONS:')
        print('  --help, -h           Display this help.')
        print('  --version, -V        Display version info.')
        print('')
        print('  --kea-conf, -k path  Path to the KEA configuration file.')
        print('  --leases, -l path    Path to the ISC DHCPd lease file.')
        print('')
        print('  --postgres, -P       Use PostgreSQL-compatible output.')
        print('')
        print('Report bugs at <http://github.com/techlib/adminator>.')

    def do_version(*args, **kwargs):
        print('leases2csv.py (NTK) 1')

    # Parse command line arguments.
    opts, args = gnu_getopt(argv, 'hVk:l:P', ['help', 'version', 'kea-conf=', 'leases=', 'postgres'])
    action = do_convert
    kea_conf = 'kea.conf'
    leases = 'dhcpd.leases'
    postgres = False

    for k, v in opts:
        if k in ('--help', '-h'):
            action = do_help
        elif k in ('--version', '-V'):
            action = do_version
        elif k in ('--kea-conf', '-k'):
            kea_conf = v
        elif k in ('--leases', '-l'):
            leases = v
        elif k in ('--postgres', '-P'):
            postgres = True

    # Perform the selected action.
    action(kea_conf, leases, postgres)


# vim:set sw=4 ts=4 et:

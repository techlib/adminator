#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

from setuptools import setup
import os.path

setup(
    name = 'adminator',
    version = '1',
    author = 'NTK',
    description = ('PDNS, Kea and FreeRADIUS Configuration Tool'),
    license = 'MIT',
    keywords = 'pdns DNS DHCP Kea FreeRADIUS configuration',
    url = 'http://github.com/techlib/adminator',
    include_package_data = True,
    package_data = {
        '': ['*.png', '*.js', '*.html'],
    },
    packages = [
        'adminator',
    ],
    classifiers = [
        'License :: OSI Approved :: MIT License',
    ],
    scripts = ['adminator-daemon']
)


# vim:set sw=4 ts=4 et:

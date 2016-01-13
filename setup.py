#!/usr/bin/python -tt

from setuptools import setup

setup(
    name = 'python-adminator',
    version = '1',
    author = 'NTK',
    description = ('example application for NTK'),
    license = 'MIT',
    keywords = 'example NTK',
    url = 'http://redmine.ntkcz.cz/',
    packages=['ntk',
              'ntk.common',
              'ntk.adminator'],
    classifiers=[
        'License :: OSI Approved :: MIT License',
    ],
    scripts=['adminator']
)


# vim:set sw=4 ts=4 et:
# -*- coding: utf-8 -*-

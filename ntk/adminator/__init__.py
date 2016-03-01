#!/usr/bin/python -tt

from manager import *
from site import *

from psycopg2.extras import DateTimeRange, Range
from sqlalchemy.types import UserDefinedType
from sqlalchemy.dialects.postgresql.base import ischema_names


class TSRangeType(UserDefinedType):
    def get_col_spec(self):
        return 'TSRANGE'

    def bind_processor(self, dialect):
        def process(value):
            if value:
                return DateTimeRange(value[0], value[1])
        return process

    def result_processor(self, dialect, coltype):
        def process(value):
            if value:
                return (value.lower.isoformat(), value.upper.isoformat())
            else:
                return None
        return process


class RangeType(UserDefinedType):
    def get_col_spec(self):
        return 'RANGE'

    def bind_processor(self, dialect):
        def process(value):
            if value:
                return Range(value[0], value[1])
        return process

    def result_processor(self, dialect, coltype):
        def process(value):
            return (value.lower, value.upper)
        return process


ischema_names['tsrange'] = TSRangeType
ischema_names['range'] = RangeType
ischema_names['inetrange'] = RangeType

# vim:set sw=4 ts=4 et:
# -*- coding: utf-8 -*-

#!/usr/bin/python -tt
from datetime import datetime
from pprint import pprint as pp
import inspect
from psycopg2._range import DateTimeRange, Range
from sqlalchemy.orm import class_mapper
from psycopg2.extras import Inet

__all__ = ['object_to_dict']


def process_value(obj, c):
    if isinstance(getattr(obj, c), datetime):
        return (c, getattr(obj, c).isoformat())
    elif isinstance(getattr(obj, c), DateTimeRange):
        return (c, (getattr(obj, c).lower.isoformat(), getattr(obj, c).upper.isoformat()))
    elif issubclass(type(getattr(obj, c)), Range):
        return (c, (getattr(obj, c).lower, getattr(obj, c).upper))
    elif isinstance(getattr(obj, c), Inet):
        return (c, getattr(obj, c).addr)
    else:
        return (c, getattr(obj, c))

def object_to_dict(obj, found=None, include=[]):
    mapper = class_mapper(obj.__class__)
    columns = [column.key for column in mapper.columns]
    get_key_value = lambda c: process_value(obj, c)
    out = dict(map(get_key_value, columns))
    for name, relation in mapper.relationships.items():
        related_obj = getattr(obj, name)
        if related_obj is not None and name in include:
            if relation.uselist:
                out[name] = [object_to_dict(child, found) for child in related_obj]
            else:
                out[name] = object_to_dict(related_obj, found)
    return out

# vim:set sw=4 ts=4 et:
# -*- coding: utf-8 -*-

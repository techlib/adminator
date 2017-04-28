#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

from datetime import datetime, timedelta
from pprint import pprint as pp
import inspect
from psycopg2._range import Range
from sqlalchemy.orm import class_mapper
from psycopg2.extras import Inet

from functools import wraps

__all__ = ['object_to_dict']


def process_value(obj, c):
    if isinstance(getattr(obj, c), datetime):
        return (c, getattr(obj, c).isoformat())
    elif isinstance(getattr(obj, c), timedelta):
        return (c, getattr(obj, c).total_seconds())
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

def audit(f):
    @wraps(f)
    def func_wrapper(self, *args, **kwargs):
        uid  = kwargs['uid'] if 'uid' in kwargs else args[2]
        data = kwargs['data'] if 'data' in kwargs else args[0]
        if f.__name__ in ('patch', 'delete'):
            if f.__name__ == 'patch':
                data = kwargs['data'] if 'data' in kwargs else args[0]
                key = data[self.pkey]
            elif f.__name__ == 'delete':
                key = kwargs['key'] if 'key' in kwargs else args[0]
                data = None
            old = self.e().filter_by(**{self.pkey: key}).one()
            old = object_to_dict(old, include=self.include_relations.get('item'))
        elif f.__name__ == 'insert':
            old = None
            data = kwargs['data'] if 'data' in kwargs else args[0]

        audit = self.db.entity('audit')
        audit.insert(entity=self.table_name, old=old, new=data, actor=uid)
        return f(self, *args, **kwargs)
    return func_wrapper

# vim:set sw=4 ts=4 et:

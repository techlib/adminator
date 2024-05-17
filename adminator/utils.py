#!/usr/bin/python3 -tt
# -*- coding: utf-8 -*-

from datetime import datetime, timedelta
from psycopg2.extras import Inet
from sqlmodel import select
from functools import wraps
from sqlalchemy.orm import class_mapper
from .db_entity.network import Audit
from uuid import UUID

__all__ = ['object_to_dict']


def process_value(obj, c):
    if isinstance(getattr(obj, c), datetime):
        return (c, getattr(obj, c).isoformat())
    elif isinstance(getattr(obj, c), timedelta):
        return (c, getattr(obj, c).total_seconds())
    elif isinstance(getattr(obj, c), Inet):
        return (c, getattr(obj, c).addr)
    elif isinstance(getattr(obj, c), UUID):
        return (c, str(getattr(obj, c)))
    else:
        return (c, getattr(obj, c))


def object_to_dict(obj, found=None, include=[]):
    mapper = class_mapper(obj.__class__)
    columns = [column.key for column in mapper.columns]
    get_key_value = lambda c: process_value(obj, c)
    out = dict(map(get_key_value, columns))
    for name, relation in mapper.relationships.items():
        if name not in include:
            continue
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
        uid = kwargs['uid'] if 'uid' in kwargs else args[2]
        data = kwargs['data'] if 'data' in kwargs else args[0]

        if f.__name__ in ('patch', 'delete'):
            if f.__name__ == 'patch':
                data = kwargs['data'] if 'data' in kwargs else args[0]
                key = data[self.pkey]
            elif f.__name__ == 'delete':
                key = kwargs['key'] if 'key' in kwargs else args[0]
                data = None
            old = self.db().exec(select(self.db_entity).filter_by(**{self.pkey: key})).one()
            old = object_to_dict(old, include=self.include_relations.get('item'))
        elif f.__name__ == 'insert':
            old = None
            data = kwargs['data'] if 'data' in kwargs else args[0]

        audit_item = Audit(entity=self.table_name, old=old, new=data, actor=str(uid))
        self.db().add(audit_item)
        return f(self, *args, **kwargs)

    return func_wrapper

# vim:set sw=4 ts=4 et:

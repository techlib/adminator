from datetime import datetime
from typing import Optional, List
from uuid import UUID

from pydantic import ConfigDict
from sqlalchemy import String, text, Boolean
from sqlalchemy.dialects.postgresql import CIDR, INET, MACADDR, TSRANGE, Range, ARRAY, JSON

from sqlalchemy.orm import mapped_column
from sqlmodel import Field, SQLModel, Relationship
from ..db import TSRangeType, InetRangeType


class Domain(SQLModel, table=True):
    __tablename__ = 'domains'
    __table_args__ = {'schema': 'pdns'}

    id: Optional[int] = Field(primary_key=True, sa_column_kwargs={'autoincrement': True})
    name: str
    type: str
    last_check: int
    master: Optional[str]
    records: List['Record'] = Relationship(back_populates='domain',
                                           sa_relationship_kwargs={'passive_deletes': True, 'lazy': 'subquery'})


class Record(SQLModel, table=True):
    __tablename__ = 'records'
    __table_args__ = {'schema': 'pdns'}

    id: Optional[int] = Field(primary_key=True, sa_column_kwargs={'autoincrement': True})
    domain_id: Optional[int] = Field(foreign_key='pdns.domains.id')
    name: Optional[str]
    type: Optional[str]
    content: Optional[str]
    ttl: Optional[int]
    domain: Optional['Domain'] = Relationship(back_populates='records')

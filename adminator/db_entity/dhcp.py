from datetime import datetime
from typing import Optional, List, Any
from uuid import UUID

from pydantic import ConfigDict
from sqlalchemy import String, text, Boolean
from sqlalchemy.dialects.postgresql import CIDR, INET, MACADDR, TSRANGE, Range, ARRAY, JSON

from sqlalchemy.orm import mapped_column
from sqlmodel import Field, SQLModel, Relationship
from ..db import TSRangeType, InetRangeType


class Lease4(SQLModel, table=True):
    __table_args__ = {'schema': 'kea'}
    model_config = ConfigDict(arbitrary_types_allowed=True)


    address: int = Field(primary_key=True)
    pool_id: int = Field(sa_column_kwargs={'server_default': text('0')})
    hwaddr: Optional[bytes]  # = Field(default=None, sa_column=mapped_column('hwaddr', LargeBinary))
    client_id: Optional[bytes]  # = Field(default=None, sa_column=mapped_column('client_id', LargeBinary))
    valid_lifetime: Optional[int]
    expire: Optional[datetime]
    subnet_id: Optional[int]
    fqdn_fwd: Optional[bool]
    fqdn_rev: Optional[bool]
    hostname: Optional[str]
    state: Optional[int] = Field(foreign_key='kea.lease_state.state',sa_column_kwargs={'server_default': text('0')})
    user_context: Optional[str]
    relay_id: Optional[bytes]
    remote_id: Optional[bytes]

    lease_state: Optional['LeaseState'] = Relationship(back_populates='lease4')


class Lease6(SQLModel, table=True):
    __table_args__ = {'schema': 'kea'}
    model_config = ConfigDict(arbitrary_types_allowed=True)


    address: INET = Field(primary_key=True, sa_type=INET)
    pool_id: int = Field(sa_column_kwargs={'server_default': text('0')})
    duid: Optional[bytes]# = Field(default=None, sa_column=mapped_column('duid', LargeBinary))
    valid_lifetime: Optional[int]
    expire: Optional[datetime]
    subnet_id: Optional[int]
    pref_lifetime: Optional[int]
    lease_type: Optional[int]
    iaid: Optional[int]
    prefix_len: Optional[int]
    fqdn_fwd: Optional[bool]
    fqdn_rev: Optional[bool]
    hostname: Optional[str]
    state: Optional[int] = Field(foreign_key='kea.lease_state.state',sa_column_kwargs={'server_default': text('0')})
    hwaddr: Optional[bytes]# = Field(default=None, sa_column=mapped_column('hwaddr', LargeBinary))
    hwtype: Optional[int]
    hwaddr_source: Optional[int]
    user_context: Optional[str]

    #lease6_types: Optional['Lease6Types'] = Relationship(back_populates='lease6')
    lease_state: Optional['LeaseState'] = Relationship(back_populates='lease6')


class LeaseState(SQLModel, table=True):
    __tablename__ = 'lease_state'
    __table_args__ = {'schema': 'kea'}

    state: int = Field(primary_key=True)
    name: str

    lease4: List['Lease4'] = Relationship(back_populates='lease_state')
    lease6: List['Lease6'] = Relationship(back_populates='lease_state')

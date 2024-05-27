from datetime import datetime
from typing import Optional, List
from uuid import UUID

from pydantic import ConfigDict
from sqlalchemy import String, text, Boolean
from sqlalchemy.dialects.postgresql import CIDR, INET, MACADDR, TSRANGE, Range, ARRAY, JSON

from sqlalchemy.orm import mapped_column
from sqlmodel import Field, SQLModel, Relationship
from ..db import TSRangeType, InetRangeType


class Audit(SQLModel, table=True):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    uuid: UUID = Field(primary_key=True, sa_column_kwargs={'server_default': text('uuid_generate_v4()')})
    timestamp: datetime = Field(sa_column_kwargs={'server_default': text('(now())::timestamp without time zone')})
    actor: str
    entity: str
    old: Optional[JSON] = Field(sa_type=JSON)
    new: Optional[JSON] = Field(sa_type=JSON)


class Network(SQLModel, table=True):
    uuid: UUID = Field(primary_key=True, sa_column_kwargs={'server_default': text('uuid_generate_v4()')})
    vlan: int
    description: str
    max_lease: int
    prefix4: Optional[str]
    prefix6: Optional[str]

    network_acl: List['NetworkAcl'] = Relationship(back_populates='network_')
    pools: List['NetworkPool'] = Relationship(back_populates='network_')
    interface: List['Interface'] = Relationship(back_populates='network_')
    dhcp_options: List['DhcpOptionValue'] = Relationship(back_populates='network_')


class DhcpOption(SQLModel, table=True):
    __tablename__ = 'option'
    name: str = Field(primary_key=True)
    code: int
    family: str
    array: Optional[bool]
    type: Optional[str]

    dhcp_options: List['DhcpOptionValue'] = Relationship(back_populates='option_')


class Device(SQLModel, table=True):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    uuid: UUID = Field(sa_column_kwargs={'server_default': text('uuid_generate_v4()')}, primary_key=True)
    description: str
    location: str = Field(default='')
    type: Optional[str]
    user: Optional[str] = Field(foreign_key='user.cn')
    valid: Optional[TSRangeType] = Field(sa_type=TSRangeType)

    # users: Optional['User'] = Relationship(back_populates='device')
    interfaces: List['Interface'] = Relationship(back_populates='device_',
                                                 sa_relationship_kwargs={'passive_deletes': True, 'lazy': 'subquery'})
    dhcp_options: List['DhcpOptionValue'] = Relationship(back_populates='device_',
                                                         sa_relationship_kwargs={'passive_deletes': True,
                                                                                 'lazy': 'subquery'})


class User(SQLModel, table=True):
    cn: str = Field(primary_key=True)
    display_name: str
    enabled: bool = Field(sa_column=mapped_column('enabled', Boolean, server_default=text('true')))


class NetworkAcl(SQLModel, table=True):
    __tablename__ = 'network_acl'

    network: str = Field(primary_key=True, foreign_key='network.uuid')
    device_types: list[str] = Field(sa_type=ARRAY(String))
    role: str

    network_: Optional['Network'] = Relationship(back_populates='network_acl')


class NetworkPool(SQLModel, table=True):
    __tablename__ = 'network_pool'
    model_config = ConfigDict(arbitrary_types_allowed=True)

    uuid: UUID = Field(sa_column_kwargs={'server_default': text('uuid_generate_v4()')}, primary_key=True)
    network: UUID = Field(foreign_key='network.uuid')
    range: InetRangeType = Field(sa_type=InetRangeType)

    network_: Optional['Network'] = Relationship(back_populates='pools')


class Interface(SQLModel, table=True):
    uuid: UUID = Field(primary_key=True, sa_column_kwargs={'server_default': text('uuid_generate_v4()')})
    network: str = Field(foreign_key='network.uuid')
    device: str = Field(foreign_key='device.uuid')
    macaddr: str
    ip4addr: Optional[str] = Field(sa_type=INET)
    ip6addr: Optional[str] = Field(sa_type=INET)
    hostname: Optional[str]

    device_: Optional['Device'] = Relationship(back_populates='interfaces')
    network_: Optional['Network'] = Relationship(back_populates='interface')


class DhcpOptionValue(SQLModel, table=True):
    __tablename__ = 'option_value'
    uuid: UUID = Field(primary_key=True, sa_column_kwargs={'server_default': text('uuid_generate_v4()')}, )
    option: str = Field(foreign_key="option.name")
    value: str
    network: Optional[str] = Field(foreign_key='network.uuid')
    device: Optional[str] = Field(foreign_key='device.uuid')

    device_: Optional['Device'] = Relationship(back_populates='dhcp_options')
    network_: Optional['Network'] = Relationship(back_populates='dhcp_options')
    option_: Optional['DhcpOption'] = Relationship(back_populates='dhcp_options')

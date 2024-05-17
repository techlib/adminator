from datetime import datetime
from typing import Optional, List, Any
from uuid import UUID

from pydantic import ConfigDict
from sqlalchemy import String, text, Boolean
from sqlalchemy.dialects.postgresql import CIDR, INET, MACADDR, TSRANGE, Range, ARRAY, JSON, INTERVAL, JSONB

from sqlmodel import Field, SQLModel, Relationship
from ..db import TSRangeType, InetRangeType


class Port(SQLModel, table=True):
    __table_args__ = {'schema': 'topology'}
    model_config = ConfigDict(arbitrary_types_allowed=True)

    uuid: UUID = Field(primary_key=True, sa_column_kwargs={'server_default': text('uuid_generate_v4()')})
    description: str = Field(sa_column_kwargs={'server_default': text("''::character varying")})
    name: str = Field(sa_column_kwargs={'server_default': text("''::character varying")})
    type: str = Field(sa_column_kwargs={'server_default': text("''::character varying")})
    position_on_pp: int
    patch_panel: UUID = Field(foreign_key='topology.patch_panel.uuid')
    connect_to: Optional[UUID] = Field(foreign_key='topology.port.uuid')

    #port: Optional['Port'] = Relationship(back_populates='port_reverse')
    #port_reverse: List['Port'] = Relationship(back_populates='port', sa_relationship_kwargs={'remote_side': []})

    patch_panel_: Optional['PatchPanel'] = Relationship(back_populates='port')
    sw_interface: List['SwInterface'] = Relationship(back_populates='port_')


class PatchPanel(SQLModel, table=True):
    __tablename__ = 'patch_panel'
    __table_args__ = {'schema': 'topology'}
    model_config = ConfigDict(arbitrary_types_allowed=True)

    uuid: UUID = Field(primary_key=True, sa_column_kwargs={'server_default': text('uuid_generate_v4()')})
    description: str = Field(sa_column_kwargs={'server_default': text("''::character varying")})
    analyzer: UUID = Field(foreign_key='topology.analyzer.uuid')
    pp_id_in_analyzer: int

    analyzer_: Optional['Analyzer'] = Relationship(back_populates='patch_panel')
    port: List['Port'] = Relationship(back_populates='patch_panel_')


class Analyzer(SQLModel, table=True):
    __table_args__ = {'schema': 'topology'}
    model_config = ConfigDict(arbitrary_types_allowed=True)

    uuid: UUID = Field(primary_key=True, sa_column_kwargs={'server_default': text('uuid_generate_v4()')})
    name: str = Field(sa_column_kwargs={'server_default': text("''::character varying")})
    data_url: str = Field(sa_column_kwargs={'server_default': text("''::character varying")})
    username: str = Field(sa_column_kwargs={'server_default': text("''::character varying")})
    password: str = Field(sa_column_kwargs={'server_default': text("''::character varying")})
    analyzer_id_in_group: int = Field(sa_column_kwargs={'server_default': text("1")})
    description: str = Field(sa_column_kwargs={'server_default': text("''::character varying")})
    analyzer_group: UUID = Field(foreign_key='topology.analyzer_group.uuid')

    analyzer_group_: Optional['AnalyzerGroup'] = Relationship(back_populates='analyzer')
    patch_panel: List['PatchPanel'] = Relationship(back_populates='analyzer_')


class AnalyzerGroup(SQLModel, table=True):
    __tablename__ = 'analyzer_group'
    __table_args__ = {'schema': 'topology'}
    model_config = ConfigDict(arbitrary_types_allowed=True)

    uuid: UUID = Field(primary_key=True, sa_column_kwargs={'server_default': text('uuid_generate_v4()')})
    description: str = Field(sa_column_kwargs={'server_default': text("''::character varying")})
    name: str
    update_in_progress: bool = Field(sa_column_kwargs={'server_default': text('false')})
    last_update: Optional[datetime]

    analyzer: List['Analyzer'] = Relationship(back_populates='analyzer_group_')


class Switch(SQLModel, table=True):
    __table_args__ = {'schema': 'topology'}
    model_config = ConfigDict(arbitrary_types_allowed=True)

    uuid: UUID = Field(primary_key=True, sa_column_kwargs={'server_default': text('uuid_generate_v4()')})
    ip_address: INET = Field(sa_type=INET)
    enable: Optional[bool] = Field(sa_column_kwargs={'server_default': text('false')})
    name: Optional[str]
    uptime: Optional[INTERVAL] = Field(sa_type=INTERVAL)
    last_update: Optional[datetime]
    sys_description: Optional[str]
    sys_objectID: Optional[str]
    sys_contact: Optional[str]
    sys_name: Optional[str]
    sys_location: Optional[str]
    sys_services: Optional[int]
    configuration: Optional[JSON] = Field(sa_type=JSON)
    snmp_version: Optional[str]
    snmp_timeout: Optional[int]
    snmp_community: Optional[str]
    type: Optional[str]
    type: str

    interfaces: List['SwInterface'] = Relationship(back_populates='switch_', sa_relationship_kwargs={'passive_deletes': True})


class SwInterface(SQLModel, table=True):
    __tablename__ = 'sw_interface'
    __table_args__ = {'schema': 'topology'}
    model_config = ConfigDict(arbitrary_types_allowed=True)

    uuid: UUID = Field(primary_key=True, sa_column_kwargs={'server_default': text('uuid_generate_v4()')})
    switch: UUID = Field(foreign_key='topology.switch.uuid')
    ignore_macs: bool = Field(sa_column_kwargs={'server_default': text('false')})
    name: Optional[str]
    vlan: Optional[int]
    speed: Optional[int]
    port: Optional[UUID] = Field(foreign_key='topology.port.uuid')
    last_change: Optional[INTERVAL] = Field(sa_type=INTERVAL)
    configuration: Optional[JSONB] = Field(sa_type=JSONB, sa_column_kwargs={'server_default': text("'[]'::jsonb")})
    admin_status: Optional[int]
    oper_status: Optional[int]

    #if_config_pattern: List['IfConfigPattern'] = Relationship(back_populates='sw_interface')
    port_: Optional['Port'] = Relationship(back_populates='sw_interface')
    switch_: Optional['Switch'] = Relationship(back_populates='interfaces', )
    last_interface_for_mac: List['LastInterfaceForMac'] = Relationship(back_populates='sw_interface')
    last_macs_on_interface: List['LastMacsOnInterface'] = Relationship(back_populates='sw_interface')
    mac_address: List['MacAddress'] = Relationship(back_populates='sw_interface')


class IfConfigPattern(SQLModel, table=True):
    __tablename__ = 'if_config_pattern'
    __table_args__ = {'schema': 'topology'}
    model_config = ConfigDict(arbitrary_types_allowed=True)

    uuid: UUID = Field(primary_key=True, sa_column_kwargs={'server_default': text('uuid_generate_v4()')})
    name: str
    mandatory: JSONB = Field(sa_type=JSONB, sa_column_kwargs={'server_default': text("'[]'::jsonb")})
    optional: JSONB = Field(sa_type=JSONB, sa_column_kwargs={'server_default': text("'[]'::jsonb")})
    style: Optional[str]

    #sw_interface: List['SwInterface'] = Relationship(back_populates='if_config_pattern')


class LastInterfaceForMac(SQLModel, table=True):
    __tablename__ = 'last_interface_for_mac'
    __table_args__ = {'schema': 'topology'}
    model_config = ConfigDict(arbitrary_types_allowed=True)


    mac_address: MACADDR = Field(sa_type=MACADDR, primary_key=True)
    interface: Optional[UUID] = Field(foreign_key='topology.sw_interface.uuid')
    time: Optional[datetime]

    sw_interface: Optional['SwInterface'] = Relationship(back_populates='last_interface_for_mac')


class LastMacsOnInterface(SQLModel, table=True):
    __tablename__ = 'last_macs_on_interface'
    __table_args__ = {'schema': 'topology'}
    model_config = ConfigDict(arbitrary_types_allowed=True)

    interface: UUID = Field(foreign_key='topology.sw_interface.uuid', primary_key=True)
    mac_address: MACADDR = Field(sa_type=MACADDR, primary_key=True)
    time: Optional[datetime]

    sw_interface: Optional['SwInterface'] = Relationship(back_populates='last_macs_on_interface')

class MacAddress(SQLModel, table=True):
    __tablename__ = 'mac_address'
    __table_args__ = {'schema': 'topology'}
    model_config = ConfigDict(arbitrary_types_allowed=True)

    mac_address: MACADDR = Field(sa_type=MACADDR, primary_key=True)
    interface: UUID = Field(primary_key=True, foreign_key='topology.sw_interface.uuid')
    written: Optional[datetime]

    sw_interface: Optional['SwInterface'] = Relationship(back_populates='mac_address')

class InterfaceToPattern(SQLModel, table=True):
    __tablename__ = 'if_to_pattern'
    __table_args__ = {'schema': 'topology'}
    model_config = ConfigDict(arbitrary_types_allowed=True)

    interface: UUID = Field(primary_key=True, foreign_key='topology.sw_interface.uuid')
    if_config_pattern: UUID = Field(primary_key=True, foreign_key='topology.if_config_pattern.uuid')


import * as Reflux from 'reflux-core'

export var DomainActions = Reflux.createActions([
    'create', 'read', 'update', 'delete', 'list'
])

export var RecordActions = Reflux.createActions([
    'create', 'read', 'update', 'delete', 'list'
])

export var DeviceActions = Reflux.createActions([
    'create', 'read', 'update', 'delete', 'list', 'select'
])

export var NetworkActions = Reflux.createActions([
    'create', 'read', 'update', 'delete', 'list'
])

export var InterfaceActions = Reflux.createActions([
    'create', 'read', 'update', 'delete', 'list'
])

export var UserActions = Reflux.createActions([
    'create', 'read', 'update', 'delete', 'list', 'listEnabled'
])

export var Lease6Actions = Reflux.createActions([
    'read', 'delete', 'list'
])

export var Lease4Actions = Reflux.createActions([
    'read', 'delete', 'list'
])

export var DhcpOptionActions = Reflux.createActions([
    'list'
])

export var DhcpValuesActions = Reflux.createActions([
    'listGlobal', 'saveGlobal'
])

export var FeedbackActions = Reflux.createActions([
    'clear', 'set'
])

export var UserInfoActions = Reflux.createActions([
    'read'
])

export var NetworkAclActions = Reflux.createActions([
    'read', 'update', 'list'
])

export var TopologyActions = Reflux.createActions([
    'list'
])

export var MacHistoryActions = Reflux.createActions([
    'list'
])

export var SwitchInterfaceActions = Reflux.createActions([
    'read', 'update', 'list'
])

export var ConfigPatternActions = Reflux.createActions([
    'create', 'read', 'update', 'delete', 'list', 'recalculate', 'recalculateall'
])

export var SwitchActions = Reflux.createActions([
    'create', 'read', 'update', 'delete', 'list'
])
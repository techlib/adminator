
var DomainActions = Reflux.createActions([
  'create', 'read', 'update', 'delete', 'list'
])

var RecordActions = Reflux.createActions([
  'create', 'read', 'update', 'delete', 'list'
])

var DeviceActions = Reflux.createActions([
  'create', 'read', 'update', 'delete', 'list'
])

var NetworkActions = Reflux.createActions([
  'create', 'read', 'update', 'delete', 'list'
])

var InterfaceActions = Reflux.createActions([
  'create', 'read', 'update', 'delete', 'list'
])

var UserActions = Reflux.createActions([
  'create', 'read', 'update', 'delete', 'list'
])

var Lease6Actions = Reflux.createActions([
  'read', 'delete', 'list'
])

var Lease4Actions = Reflux.createActions([
  'read', 'delete', 'list'
])

var DhcpOptionActions = Reflux.createActions([
    'list'
])

var DhcpValuesActions = Reflux.createActions([
    'listGlobal', 'saveGlobal'
])

var FeedbackActions = Reflux.createActions([
    'clear', 'set'
])


var DomainActions = Reflux.createActions([
  'create', 'read', 'update', 'delete', 'list'
])

var RecordActions = Reflux.createActions([
  'create', 'read', 'update', 'delete', 'list'
])

var DeviceActions = Reflux.createActions([
  'create', 'read', 'update', 'delete', 'list'
])
DeviceActions.read.preEmit = (args) => {console.log(args)}

var NetworkActions = Reflux.createActions([
  'create', 'read', 'update', 'delete', 'list'
])

var InterfaceActions = Reflux.createActions([
  'create', 'read', 'update', 'delete', 'list'
])

var UserActions = Reflux.createActions([
  'create', 'read', 'update', 'delete', 'list'
])

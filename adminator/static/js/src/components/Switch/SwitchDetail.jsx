import * as React from 'react'
import * as Reflux from 'reflux'
import {SwitchStore} from '../../stores/Switch'
import {SwitchActions} from '../../actions'
import {SwitchForm} from './SwitchForm'
import {SwitchDetected} from './SwitchDetected'

export var SwitchDetail = React.createClass({
  mixins: [Reflux.connect(SwitchStore, 'data')],

  componentDidMount() {
    SwitchActions.read(this.props.params.id)
  },

  getInitialState() {
    return {data: {switch: {}}}
  },

  saveHandler() {
    var data = this.refs.configurable.getValues()
    data['uuid'] = this.state.data.switch.uuid
    SwitchActions.update(data)
  },

  render() {
    return <div className='container-fluid'>
      <h1>{this.state.data.switch.name}</h1>
      <div className="row">
        <div className="col-xs-12 col-md-6">
          <SwitchForm ref="configurable"
            enable={this.state.data.switch.enable}
            ip_address={this.state.data.switch.ip_address}
            name={this.state.data.switch.name}
            snmp_community={this.state.data.switch.snmp_community}
            snmp_timeout={this.state.data.switch.snmp_timeout}
            snmp_version={this.state.data.switch.snmp_version}
            type={this.state.data.switch.type}
            saveHandler={this.saveHandler} />
        </div>
        <div className="col-xs-12 col-md-6">
          <SwitchDetected ref="detected"
            last_update={this.state.data.switch.last_update}
            sys_contact={this.state.data.switch.sys_contact}
            sys_description={this.state.data.switch.sys_description}
            sys_location={this.state.data.switch.sys_location}
            sys_name={this.state.data.switch.sys_name}
            sys_objectID={this.state.data.switch.sys_objectID}
            sys_services={this.state.data.switch.sys_services}
            uptime={this.state.data.switch.uptime} />
        </div>
      </div>
    </div>
  }
})

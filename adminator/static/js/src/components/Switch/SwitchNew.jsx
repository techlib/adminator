import * as React from 'react'
import {SwitchActions} from '../../actions'
import {SwitchForm} from './SwitchForm'

export var SwitchNew = React.createClass({

  getInitialState() {
    return {'switch': {}}
  },

  saveHandler() {
    SwitchActions.create(this.refs.configurable.getValues())
  },

  render() {
    return <div className='container-fluid'>
      <h1>{this.state.switch.name}</h1>
      <div className="row">
        <div className="col-xs-12 col-md-3"></div>
        <div className="col-xs-12 col-md-6">
          <SwitchForm ref="configurable"
            enable={this.state.switch.enable}
            ip_address={this.state.switch.ip_address}
            name={this.state.switch.name}
            snmp_community={this.state.switch.snmp_community}
            snmp_timeout={this.state.switch.snmp_timeout}
            snmp_version={this.state.switch.snmp_version}
            type={this.state.switch.type}
            saveHandler={this.saveHandler} />
        </div>
        <div className="col-xs-12 col-md-3"></div>
      </div>
    </div>
  }
})

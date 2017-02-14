import * as React from 'react'
import {SwitchActions, FeedbackActions} from '../../actions'
import {SwitchForm} from './SwitchForm'
import {Feedback} from '../Feedback'

export var SwitchNew = React.createClass({

  getInitialState() {
    return {'switch': {}}
  },

  saveHandler() {
    var errors = this.refs.configurable.validate()
    if (errors.length > 0) {
      FeedbackActions.set('error', 'Form contains invalid data', errors)
    } else {
      SwitchActions.create(this.refs.configurable.getValues())
    }
  },

  render() {
    return <div className='container-fluid'>
      <h1>{this.state.switch.name}</h1>
      <Feedback />
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

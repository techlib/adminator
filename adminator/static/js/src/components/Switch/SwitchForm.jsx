import * as React from 'react'
import {Input} from 'react-bootstrap'
import {isIP} from '../../util/simple-validators'

export var SwitchForm = React.createClass({

  componentWillReceiveProps(p) {
    this.setState(p)
  },

  getInitialState() {
    return {
      "enable": false,
      "ip_address": "",
      "name": "",
      "snmp_community": "",
      "snmp_timeout": 5,
      "snmp_version": "",
      "type": "",
    }
  },

  getValues() {
    return this.state
  },

  validate() {
    var result = []
    if (!isIP(this.state.ip_address)) {
      result.push(`${this.state.ip_address} is not valid ip address`)
    }
    return result
  },

  handleChange(evt) {
    var target = evt.target
    this.state[target.name] = target.type === 'checkbox' ? target.checked : target.value
    this.setState(this.state)
  },

  renderEnable(){
    var className = 'glyphicon glyphicon-' + (this.state.enable ? 'ok text-success' : 'remove text-danger')
    return <span className={className}></span>
  },

  render(){
    // because of patternfly and bootstrap CSSs are fighting
    var checkbox_margine = {'margin-left': '20px'}
    // TODO: validate IP
    return <div className="panel panel-default">
      <div className="panel-heading">
        <h3 className="panel-title">Configurable parameters</h3>
      </div>
      <div className="panel-body">
        <div className="form-horizontal">
          <div className='row'>
            <label className="control-label col-xs-5">Name</label>
            <div className="col-xs-6">
              <Input type="text"
                onChange={this.handleChange}
                value={this.state.name}
                name='name' />
            </div>
          </div>
          <div className='row'>
            <label className="control-label col-xs-5">IP address</label>
            <div className="col-xs-6">
              <Input type="text"
                onChange={this.handleChange}
                value={this.state.ip_address}
                name='ip_address' />
            </div>
          </div>
          <div className='row'>
            <label className="control-label col-xs-5">Type</label>
            <div className="col-xs-6">
              <Input type="text"
                onChange={this.handleChange}
                value={this.state.type}
                name='type' />
            </div>
          </div>
          <div className='row'>
            <label className="control-label col-xs-5">SNMP community</label>
            <div className="col-xs-6">
              <Input type="text"
                onChange={this.handleChange}
                value={this.state.snmp_community}
                name='snmp_community' />
            </div>
          </div>
          <div className='row'>
            <label className="control-label col-xs-5">SNMP version</label>
            <div className="col-xs-6">
              <Input type="text"
                onChange={this.handleChange}
                value={this.state.snmp_version}
                name='snmp_version' />
            </div>
          </div>
          <div className='row'>
            <label className="control-label col-xs-5">SNMP timeout</label>
            <div className="col-xs-6">
              <Input type="text"
                onChange={this.handleChange}
                value={this.state.snmp_timeout}
                name='snmp_timeout' />
            </div>
          </div>
          <div className='row'>
            <label className="control-label col-xs-5">MAC detection</label>
            <div className="col-xs-6" style={checkbox_margine}>
              <Input type="checkbox"
                onChange={this.handleChange}
                checked={this.state.enable}
                name='enable' />
            </div>
          </div>
        </div>
      </div>
      <div className="panel-footer">
        <button onClick={this.props.saveHandler}
                className="btn btn-primary">Save</button>
      </div>
    </div>
  }
})

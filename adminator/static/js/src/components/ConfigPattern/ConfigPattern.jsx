import * as React from 'react'
import * as Reflux from 'reflux'
import {ConfigPatternOptions} from './ConfigPatternOptions'
import {ConfigPatternForm} from './ConfigPatternForm'
import {Feedback} from '../Feedback'

export var ConfigPattern = React.createClass({
  getInitialState() {
      return {'pattern': {'mandatory': [], 'optimal': [],'name': '', 'sytle': ''}}
  },

  componentWillReceiveProps(p) {
    this.setState(p)
  },

  save() {
    var data = this.refs.basic.getValues()
    data['uuid'] = this.state.pattern.uuid
    data['mandatory'] = this.refs.mandatory.getValues()
    data['optimal'] = this.refs.optimal.getValues()
    this.props.save_handler(data)
  },

  render() {
    return <div className='container-fluid'>
      <h1>{this.state.pattern.name}</h1>
      <Feedback />
      <div className="row">
        <div className="col-xs-12 col-md-2">
          <ConfigPatternForm ref="basic"
            name={this.state.pattern.name}
            style={this.state.pattern.style}
            saveHandler={this.save} />
        </div>
        <div className="col-xs-12 col-md-5">
          <ConfigPatternOptions ref="mandatory"
            options={this.state.pattern.mandatory}
            name="Mandatory" />
        </div>
        <div className="col-xs-12 col-md-5">
          <ConfigPatternOptions ref="optimal"
            options={this.state.pattern.optimal}
            name="Optimal" />
        </div>
      </div>
    </div>
  }
})

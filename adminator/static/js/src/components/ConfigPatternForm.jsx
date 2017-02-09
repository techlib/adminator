import * as React from 'react'
import {Input} from 'react-bootstrap'
import {OverlayTrigger, Tooltip} from 'react-bootstrap'

export var ConfigPatternForm = React.createClass({

  componentWillReceiveProps(p) {
    this.setState(p)
  },

  getInitialState() {
    return {'name': '', 'style': ''}
  },

  handleChange(evt) {
    this.state[evt.target.name] = evt.target.value
    this.setState(this.state)
  },

  renderPatternStyle() {
    if(!this.state.style || !this.state.name) return null
    var className = 'label label-ifpattern-' + this.state.style.toLowerCase()
    return <span className={className}>{this.state.name}</span>
  },

  render(){
    return <div className="panel panel-default">
      <div className="panel-heading">
        <h3 className="panel-title">Basic setting</h3>
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
            <label className="control-label col-xs-5">
              Style
              <OverlayTrigger placement="right" overlay=
                <Tooltip id='title'>Expect that there is CSS class label-ifpattern-STYLE</Tooltip>>
                <span className="glyphicon glyphicon-question-sign" key="title"></span>
              </OverlayTrigger>
            </label>
            <div className="col-xs-6">
              <Input type="text"
                onChange={this.handleChange}
                value={this.state.style}
                name='style' />
            </div>
          </div>
          <div className='row'>
            <label className="control-label col-xs-5"></label>
            <div className="col-xs-7">{this.renderPatternStyle()}</div>
          </div>
        </div>
      </div>
      <div className="panel-footer">
      </div>
    </div>
  }
})

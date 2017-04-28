import * as React from 'react'
import {OverlayTrigger, Tooltip} from 'react-bootstrap'
import moment from 'moment'

export var SwitchDetected = React.createClass({

  componentWillReceiveProps(p) {
    this.setState(p)
  },

  getInitialState() {
    return {
      "last_update": "",
      "sys_contact": "",
      "sys_description": "",
      "sys_location": "",
      "sys_name": "",
      "sys_objectID": "",
      "sys_services": 0,
      "uptime": 0,
    }
  },

  renderDate(date) {
    if(date == null) return null
    var txt = moment.parseZone(date).format('YYYY-MM-DD HH:mm:ss')
    return <span>{txt}</span>
  },

  renderTimedelta(seconds, tooltip_key, suffix=true) {
    if(seconds == null) return null
    var duration = moment.duration(seconds, 's')
    var txt = moment.duration(-1 * seconds, 's').humanize(suffix)
    var d_seconds = ("0" + duration.seconds()).slice(-2)
    var d_minutes = ("0" + duration.minutes()).slice(-2)
    var d_hours = ("0" + duration.hours()).slice(-2)
    var d_days = duration.asDays() < 1 ? '' : Math.floor(duration.asDays())
    if (d_days != '') d_days += d_days > 1 ? ' days ' : ' day '
    return <div>
      <div key={tooltip_key}>
        <OverlayTrigger placement="right" overlay=
          <Tooltip id={tooltip_key}>
            {d_days + d_hours + ':' + d_minutes + ':' + d_seconds + (suffix ? ' ago' : '')}
          </Tooltip>>
          <code className='gray-blue-code'>
            {txt}
          </code>
        </OverlayTrigger>
      </div>
    </div>
  },

  render(){
    return <div className="panel panel-default">
      <div className="panel-heading">
        <h3 className="panel-title">Detected parameters</h3>
      </div>
      <div className="panel-body">
        <div className="form-horizontal">
          <div className='row'>
            <label className="control-label col-xs-5">System name</label>
            <div className="col-xs-7">{this.state.sys_name}</div>
          </div>
        </div>
        <div className="form-horizontal">
          <div className='row'>
            <label className="control-label col-xs-5">Location</label>
            <div className="col-xs-7">{this.state.sys_location}</div>
          </div>
        </div>
        <div className="form-horizontal">
          <div className='row'>
            <label className="control-label col-xs-5">System contact</label>
            <div className="col-xs-7">{this.state.sys_contact}</div>
          </div>
        </div>
        <div className="form-horizontal">
          <div className='row'>
            <label className="control-label col-xs-5">Uptime</label>
            <div className="col-xs-7">{this.renderTimedelta(this.state.uptime, 'uptime', false)}</div>
          </div>
        </div>
        <div className="form-horizontal">
          <div className='row'>
            <label className="control-label col-xs-5">Last update</label>
            <div className="col-xs-7">{this.renderDate(this.state.last_update)}</div>
          </div>
        </div>
      </div>
    </div>
  }
})

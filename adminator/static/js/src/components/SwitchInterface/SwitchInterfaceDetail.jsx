import * as React from 'react'
import * as Reflux from 'reflux'
import {SwitchInterfaceStore} from '../../stores/SwitchInterface'
import {SwitchInterfaceActions} from '../../actions'
import {Link} from 'react-router'
import {Input} from 'react-bootstrap'
import {OverlayTrigger, Tooltip} from 'react-bootstrap'
import Griddle from 'griddle-react'
import {Pager} from '../Pager'
import {regexGridFilter} from '../../util/griddle-components'
import moment from 'moment'
import {Feedback} from '../Feedback'

var EmptyTr = React.createClass({
  render() {
    return null
  }
})

// TODO: check name convention
var DeviceDescComponent = React.createClass({
  render() {
    return (
      <Link to={`/device/${this.props.rowData.device}`}>
        {this.props.data}
      </Link>
    )
  }
})

var DeviceInterfacesComponent = React.createClass({
  render() {
    if (this.props.rowData.vlan == null) var net = 'No VLAN'
    else var net = `${this.props.rowData.network_name} (${this.props.rowData.vlan})`
    return <div>
      <div key={this.props.rowData.uuid}>
        <OverlayTrigger placement="right" overlay=
          <Tooltip id={this.props.rowData.uuid}>
            {this.props.rowData.hostname? this.props.rowData.hostname: 'No hostname'} <br/>
            {this.props.rowData.ip4addr? this.props.rowData.ip4addr: 'Dynamic IPv4'} <br/>
            {this.props.rowData.ip6addr? this.props.rowData.ip6addr: 'Dynamic IPv6'} <br/>
            {net}
          </Tooltip>>
          <code>
            {this.props.rowData.mac_address}
          </code>
        </OverlayTrigger>
      </div>
    </div>
  }
})

var DeviceDateComponent = React.createClass({
    render() {
        var txt = moment.parseZone(this.props.data).format('YYYY-MM-DD HH:mm:ss')
        return <span>{txt}</span>
    }
})

export var SwitchInterfaceDetail = React.createClass({
  mixins: [Reflux.connect(SwitchInterfaceStore, 'data')],

  componentDidMount() {
    let { id } = this.props.params
    SwitchInterfaceActions.read(id)
  },

  getInitialState() {
    return {data: {interface: {
      switch: {}, patterns:[], configuration:[],
      last_interface_for_mac:[], last_macs_on_interface:[]
    }}}
  },

  renderLinkStatus(link_status) {
    var styles = {
      'Adm. down': 'admdown',
      'Down': 'down',
      'Up': 'up',
      'Unknown': 'unknown',
    }
    var className = 'label label-link-status-' + styles[link_status]
    return <span className={className}>{link_status}</span>
  },

  changeInterfaceHandler(evt) {
    var target = evt.target
    this.state.data.interface[target.name] = target.name === 'ignore_macs' ? !target.checked : target.value
    this.setState(this.state)
  },

  saveHandler() {
    var data = {
      'uuid': this.state.data.interface.uuid,
      'ignore_macs': this.state.data.interface.ignore_macs,
    }
    SwitchInterfaceActions.update(data)
  },

  renderLinkSpeed(speed) {
    if(speed == null) {
      return null
    }
    var className = 'label label-link-speed-' + speed.toLowerCase()
    return <span className={className}>{speed}</span>
  },

  renderPatterns(patterns) {
    return <div>
      {patterns.map((item) => {
        var className = 'label label-ifpattern-' + item.style.toLowerCase()
        if (item.uuid) {
          return <span>
            <Link to={`/cfgPattern/${item.uuid}`}>
              <span className={className}>{item.name}</span>
            </Link>
            &nbsp;
          </span>
        }
        return <span><span className={className}>{item.name}</span>&nbsp;</span>
      })}
    </div>
  },

  renderDate(date) {
    if(date == null) return null
    var txt = moment.parseZone(date).format('YYYY-MM-DD HH:mm:ss')
    return <span>{txt}</span>
  },

  renderBoolIcon(val) {
    if(val == null) return null
    var className = 'glyphicon glyphicon-' + (val ? 'ok text-success' : 'remove text-danger')
    return <span className={className}></span>
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
            {d_days + d_hours + ':' + d_minutes + ':' + d_seconds + (suffix ? ' ago' : '')} <br/>
            Value may be overflowed <br/>
            Max value 497 days
          </Tooltip>>
          <code>
            {txt}
          </code>
        </OverlayTrigger>
      </div>
    </div>
  },

  renderConfig(config){
    return <pre><code>{config.join('\n')}</code></pre>
  },

  renderInterface(sw_interface) {
    var checkbox_margine = {'margin-left': '0px'}
    return <div className="panel panel-default">
      <div className="panel-heading">
        <h3 className="panel-title">Interface</h3>
      </div>
      <div className="panel-body">
        <div className="form-horizontal">
          <div className='row'>
            <label className="control-label col-xs-5">Name</label>
            <div className="col-xs-7">{sw_interface.name}</div>
          </div>
          <div className='row'>
            <label className="control-label col-xs-5">Link status</label>
            <div className="col-xs-7">{this.renderLinkStatus(sw_interface.link_status)}</div>
          </div>
          <div className='row'>
            <label className="control-label col-xs-5">Link speed</label>
            <div className="col-xs-7">{this.renderLinkSpeed(sw_interface.speed_label)}</div>
          </div>
          <div className='row'>
            <label className="control-label col-xs-5">Last link change</label>
            <div className="col-xs-7">{this.renderTimedelta(sw_interface.last_change, sw_interface.uuid)}</div>
          </div>
          <div className='row'>
            <label className="control-label col-xs-5">Detected VLAN</label>
            <div className="col-xs-7">{sw_interface.vlan}</div>
          </div>
          <div className='row'>
            <label className="control-label col-xs-5">Last update</label>
            <div className="col-xs-7">{this.renderDate(sw_interface.switch.last_update)}</div>
          </div>
          <div className='row'>
            <label className="control-label col-xs-5">Port</label>
            <div className="col-xs-7">{sw_interface.port? sw_interface.port.name : ''}</div>
          </div>
          <div className='row'>
            <label className="control-label col-xs-5">Config patterns</label>
            <div className="col-xs-7">{this.renderPatterns(sw_interface.patterns)}</div>
          </div>
          <div className='row'>
            <label className="control-label col-xs-5">MAC detection</label>
            <div className="col-xs-7">
              <Input type="checkbox"
                style={checkbox_margine}
                onChange={this.changeInterfaceHandler}
                checked={!sw_interface.ignore_macs}
                name='ignore_macs' />
            </div>
          </div>
        </div>
        <hr></hr>
        <div className='row'>
          <label className="control-label col-xs-12">Configuration</label>
          <div className="col-xs-12">{this.renderConfig(sw_interface.configuration)}</div>
        </div>
      </div>
      <div className="panel-footer">
        <button onClick={this.saveHandler}
                className="btn btn-primary">Save</button>
      </div>
    </div>
  },

  renderSwitch(switch_data) {
    return <div className="panel panel-default">
      <div className="panel-heading">
        <h3 className="panel-title">Switch</h3>
      </div>
      <div className="panel-body">
        <div className="form-horizontal">
          <div className='row'>
            <label className="control-label col-xs-5">Name</label>
            <div className="col-xs-7">
              <Link to={`/switch/${switch_data.uuid}`}>
                {switch_data.name}
              </Link>
            </div>
          </div>
          <div className='row'>
            <label className="control-label col-xs-5">System name</label>
            <div className="col-xs-7">{switch_data.sys_name}</div>
          </div>
          <div className='row'>
            <label className="control-label col-xs-5">IP address</label>
            <div className="col-xs-7">{switch_data.ip_address}</div>
          </div>
          <div className='row'>
            <label className="control-label col-xs-5">Uptime</label>
            <div className="col-xs-7">{this.renderTimedelta(switch_data.uptime, switch_data.uuid, false)}</div>
          </div>
          <div className='row'>
            <label className="control-label col-xs-5">Last update</label>
            <div className="col-xs-7">{this.renderDate(switch_data.last_update)}</div>
          </div>
          <div className='row'>
            <label className="control-label col-xs-5">Enable</label>
            <div className="col-xs-7">{this.renderBoolIcon(switch_data.enable)}</div>
          </div>
          <div className='row'>
            <label className="control-label col-xs-5">Location</label>
            <div className="col-xs-7">{switch_data.sys_location}</div>
          </div>
        </div>
      </div>
    </div>
  },

  renderMacList(macs){
    var columnMeta = [
      {
        columnName: 'mac_address',
        displayName: 'MAC address',
        customComponent: DeviceInterfacesComponent
      },
      {
        columnName: 'dev_desc',
        displayName: 'Description',
        customComponent: DeviceDescComponent
      },
      {
        columnName: 'display_name',
        displayName: 'Owner',
      },
      {
        columnName: 'time',
        displayName: 'Detected',
        customComponent: DeviceDateComponent
      },
      {
        columnName: 'c',
        displayName: '',
        customComponent: EmptyTr
      }
    ]

    return <Griddle results={macs}
      tableClassName='table table-bordered table-striped table-hover'
      useGriddleStyles={false}
      showFilter={true}
      useCustomPagerComponent='true'
      customPagerComponent={Pager}
      sortAscendingComponent={<span className='fa fa-sort-alpha-asc'></span>}
      sortDescendingComponent={<span className='fa fa-sort-alpha-desc'></span>}
      columns={[
        'mac_address',
        'dev_desc',
        'display_name',
        'time',
        'c'
      ]}
      resultsPerPage='10'
      customFilterer={regexGridFilter}
      useCustomFilterer='true'
      columnMetadata={columnMeta}
    />
  },

  renderRelatedMACS(last_if_for_mac, last_mac_on_if) {
    return <div>
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Last interface for MACs</h3>
        </div>
        {this.renderMacList(last_if_for_mac)}
      </div>
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Last MACs on interface</h3>
        </div>
        {this.renderMacList(last_mac_on_if)}
      </div>
    </div>
  },

  render() {
    return (
        <div className='container-fluid'>
          <h1>{this.state.data.interface.switch.name + " " + this.state.data.interface.name}</h1>
          <Feedback />
          <div className="row">
            <div className="col-xs-12 col-md-4">
              {this.renderInterface(this.state.data.interface)}
            </div>
            <div className="col-xs-12 col-md-3">
              {this.renderSwitch(this.state.data.interface.switch)}
            </div>
            <div className="col-xs-12 col-md-5">
              {this.renderRelatedMACS(
                this.state.data.interface.last_interface_for_mac,
                this.state.data.interface.last_macs_on_interface
              )}
            </div>
          </div>
        </div>
    )
  }
})

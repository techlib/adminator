import * as React from 'react'
import * as Reflux from 'reflux'
import {SwitchStore} from '../../stores/Switch'
import {SwitchActions, FeedbackActions} from '../../actions'
import {SwitchForm} from './SwitchForm'
import {SwitchDetected} from './SwitchDetected'
import {Link} from 'react-router'
import {OverlayTrigger, Tooltip} from 'react-bootstrap'
import Griddle from 'griddle-react'
import {Pager} from '../Pager'
import {regexGridFilter} from '../../util/griddle-components'
import moment from 'moment'
import {Feedback} from '../Feedback'
import {pseudoNaturalCompare} from '../../util/general'

var EmptyTr = React.createClass({
  render() {
    return null
  }
})

var SwitchInterfaceLinkStatusComponent = React.createClass({
  render() {
    var styles = {
      'Adm. down': 'admdown',
      'Down': 'down',
      'Up': 'up',
      'Unknown': 'unknown',
    }
    var className = 'label label-link-status-' + styles[this.props.data]
    return <span className={className}>{this.props.data}</span>
  }
})

var SwitchInterfaceSpeedComponent = React.createClass({
  render() {
    if(this.props.rowData.speed_label == null) {
      return null
    }
    var className = 'label label-link-speed-' + this.props.rowData.speed_label.toLowerCase()
    return <span className={className}>{this.props.rowData.speed_label}</span>
  }
})

var SwitchInterfaceTimedeltaComponent = React.createClass({
    render() {
      if(this.props.data == null) return null
      var duration = moment.duration(this.props.data, 's')
      var txt = moment.duration(-1 * this.props.data, 's').humanize(true)
      var d_seconds = ("0" + duration.seconds()).slice(-2)
      var d_minutes = ("0" + duration.minutes()).slice(-2)
      var d_hours = ("0" + duration.hours()).slice(-2)
      var d_days = duration.asDays() < 1 ? '' : Math.floor(duration.asDays())
      if (d_days != '') d_days += d_days > 1 ? ' days ' : ' day '
      return <div>
        <div key={this.props.rowData.uuid}>
          <OverlayTrigger placement="right" overlay=
            <Tooltip id={this.props.rowData.uuid}>
              {d_days + d_hours + ':' + d_minutes + ':' + d_seconds + ' ago'} <br/>
              Value may be overflowed <br/>
              Max value 497 days
            </Tooltip>>
            <code className='gray-blue-code'>
              {txt}
            </code>
          </OverlayTrigger>
        </div>
      </div>
    }
})

var SwitchInterfaceNameComponent = React.createClass({
  render() {
    return (
      <Link to={`/swInterface/${this.props.rowData.uuid}`}>
        {this.props.data}
      </Link>
    )
  }
})

var SwitchInterfaceMACDetectComponent = React.createClass({
  render() {
    var className = 'glyphicon glyphicon-' + (!this.props.data ? 'ok text-success' : 'remove text-danger')
    return <span className={className}></span>
  }
})

export var SwitchDetail = React.createClass({
  mixins: [Reflux.connect(SwitchStore, 'data')],

  componentDidMount() {
    SwitchActions.read(this.props.params.id)
  },

  getInitialState() {
    return {data: {switch: {}}}
  },

  saveHandler() {
    var errors = this.refs.configurable.validate()
    if (errors.length > 0) {
      FeedbackActions.set('error', 'Form contains invalid data', errors)
    } else {
      var data = this.refs.configurable.getValues()
      data['uuid'] = this.state.data.switch.uuid
      SwitchActions.update(data)
    }
  },

  render() {
    var columnMeta = [
      {
        columnName: 'c',
        displayName: '',
        customComponent: EmptyTr
      },
      {
        columnName: 'link_status',
        displayName: 'Link',
        customComponent: SwitchInterfaceLinkStatusComponent
      },
      {
        columnName: 'speed',
        displayName: 'Speed',
        customComponent: SwitchInterfaceSpeedComponent
      },
      {
        columnName: 'vlan',
        displayName: 'VLAN',
      },
      {
        columnName: 'name',
        displayName: 'Interface',
        customComponent: SwitchInterfaceNameComponent,
        customCompareFn: pseudoNaturalCompare
      },
      {
        columnName: 'last_change',
        displayName: 'Last link change',
        customComponent: SwitchInterfaceTimedeltaComponent
      },
      {
        columnName: 'ignore_macs',
        displayName: 'MAC detection',
        customComponent: SwitchInterfaceMACDetectComponent
      },
    ]
    return <div className='container-fluid'>
      <h1>{this.state.data.switch.name}</h1>
      <Feedback />
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
      <div className="row">
        <div className="col-xs-12">
          <Griddle results={this.state.data.switch.interfaces}
            tableClassName='table table-bordered table-striped table-hover'
            useGriddleStyles={false}
            showFilter={true}
            useCustomPagerComponent='true'
            customPagerComponent={Pager}
            sortAscendingComponent={<span className='fa fa-sort-alpha-asc'></span>}
            sortDescendingComponent={<span className='fa fa-sort-alpha-desc'></span>}
            columns={[
              'name',
              'link_status',
              'last_change',
              'speed',
              'vlan',
              'ignore_macs',
              'c'
            ]}
            resultsPerPage='10'
            customFilterer={regexGridFilter}
            useCustomFilterer='true'
            columnMetadata={columnMeta} />
        </div>
      </div>
    </div>
  }
})

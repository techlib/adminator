import * as React from 'react'
import * as Reflux from 'reflux'
import {SwitchStore} from '../../stores/Switch'
import {SwitchActions} from '../../actions'
import {ModalConfirmMixin} from '../ModalConfirmMixin'
import {Link} from 'react-router'
import {ButtonGroup, Button, OverlayTrigger, Tooltip} from 'react-bootstrap'
import Griddle from 'griddle-react'
import {Pager} from './../Pager'
import {regexGridFilter} from '../../util/griddle-components'
import moment from 'moment'

var SwitchActionsComponent = React.createClass({

    mixins: [ModalConfirmMixin],

  deleteSwitch() {
    var name = this.props.rowData.name
    var ip = this.props.rowData.ip_address
    this.modalConfirm(
      'Confirm delete', `Delete switch ${name} (${ip})?`, {'confirmLabel': 'DELETE', 'confirmClass': 'danger'}
    ).then(() => { SwitchActions.delete(this.props.rowData.uuid)})
  },

  render() {
    return <ButtonGroup>
      <OverlayTrigger placement="top" overlay=<Tooltip id={this.props.rowData.uuid}>Delete</Tooltip>>
        <Button bsStyle='danger' onClick={this.deleteSwitch}>
          <i className="fa fa-trash-o"></i>
        </Button>
      </OverlayTrigger>
    </ButtonGroup>
  }
})

var EmptyTr = React.createClass({
  render() {
    return null
  }
})

var SwitchLinkComponent = React.createClass({
  render() {
    return (
      <Link to={`/switch/${this.props.rowData.uuid}`}>
        {this.props.data}
      </Link>
    )
  }
})

var SwitchDateComponent = React.createClass({
  render() {
    var txt = moment.parseZone(this.props.data).format('YYYY-MM-DD HH:mm:ss')
    return <span>{txt}</span>
  }
})

var SwitchEnableComponent = React.createClass({
  render() {
    var className = 'glyphicon glyphicon-' + (this.props.data ? 'ok text-success' : 'remove text-danger')
    return <span className={className}></span>
  }
})

var SwitchTimeDeltaComponent = React.createClass({
  render() {
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
            {d_days + d_hours + ':' + d_minutes + ':' + d_seconds + ' ago'}
          </Tooltip>>
          <code>
            {txt}
          </code>
        </OverlayTrigger>
      </div>
    </div>
  }
})

export var SwitchList = React.createClass({
  mixins: [Reflux.connect(SwitchStore, 'data')],

  componentDidMount() {
    SwitchActions.list()
  },

  getInitialState() {
    return {data: {list: []}}
  },

  render() {
    var columnMeta = [
      {
        columnName: 'name',
        displayName: 'Name',
        customComponent: SwitchLinkComponent,
      },
      {
        columnName: 'type',
        displayName: 'Type',
      },
      {
        columnName: 'enable',
        displayName: 'Mac detection',
        customComponent: SwitchEnableComponent,
      },
      {
        columnName: 'ip_address',
        displayName: 'IP address',
      },
      {
        columnName: 'uptime',
        displayName: 'Uptime',
        customComponent: SwitchTimeDeltaComponent,
      },
      {
        columnName: 'sys_name',
        displayName: 'System name',
      },
      {
        columnName: 'sys_location',
        displayName: 'System location',
      },
      {
        columnName: 'sys_contact',
        displayName: 'System contact',
      },
      {
        columnName: 'last_update',
        displayName: 'Last update',
        customComponent: SwitchDateComponent
      },
      {
        columnName: 'c',
        displayName: '',
        customComponent: SwitchActionsComponent,
      },
    ]

    return <div className='container-fluid col-xs-12'>
      <div className="row">
        <div className="col-xs-12 col-sm-10">
          <h1>Switches</h1>
        </div>
        <div className="col-xs-12 col-sm-2 h1 text-right">
          <Link className='btn btn-success' to="/switch/new">
            <i className='fa fa-plus'></i> New switch
          </Link>
        </div>
      </div>
      <Griddle results={this.state.data.list}
               tableClassName='table table-bordered table-striped table-hover'
               useGriddleStyles={false}
               showFilter={true}
               useCustomPagerComponent='true'
               customPagerComponent={Pager}
               sortAscendingComponent={<span className='fa fa-sort-alpha-asc'></span>}
               sortDescendingComponent={<span className='fa fa-sort-alpha-desc'></span>}
               columns={[
                'name',
                'type',
                'enable',
                'ip_address',
                'uptime',
                'sys_name',
                'sys_location',
                'sys_contact',
                'last_update',
                'c'
               ]}
               resultsPerPage='20'
               customFilterer={regexGridFilter}
               useCustomFilterer='true'
               columnMetadata={columnMeta}
               />
    </div>
  }
})

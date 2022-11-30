import * as React from 'react'
import * as Reflux from 'reflux'
import { Feedback } from './Feedback'
import { DeviceStore } from '../stores/Device'
import { DeviceActions } from '../actions'
import { ModalConfirmMixin } from './ModalConfirmMixin'
import { Link } from 'react-router'
import { ButtonGroup, Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import Griddle from 'griddle-react'
import { Pager } from './Pager'
import { regexGridFilter } from '../util/griddle-components'
import moment from 'moment'
import _ from 'lodash'
import { pseudoNaturalCompare } from '../util/general'

var DeviceDescComponent = React.createClass({
  render() {
    return (
      <Link to={`/device/${this.props.rowData.uuid}`}>
        {this.props.data}
      </Link>
    )
  }
})

var DeviceActionsComponent = React.createClass({

  mixins: [ModalConfirmMixin],

  selectDevice() {
    DeviceActions.select(this.props.rowData.uuid)
  },

  pingDevice() {
    DeviceActions.ping(this.props.rowData.uuid)
  },

  deleteDevice() {
    var name = this.props.rowData.description
    this.modalConfirm('Confirm delete', `Delete ${name}?`,
      { 'confirmLabel': 'DELETE', 'confirmClass': 'danger' })
      .then(() => {
        DeviceActions.delete(this.props.rowData.uuid)
      })

  },
  render() {
    return (
      <ButtonGroup>
        <OverlayTrigger placement="top" overlay=<Tooltip id={this.props.rowData.uuid}>Delete</Tooltip>>
        <Button bsStyle='danger' onClick={this.deleteDevice}>
            <i className="fa fa-trash-o"></i>
          </Button>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay=<Tooltip id={this.props.rowData.uuid}>Select</Tooltip> >
          <Button bsStyle={this.props.rowData.selected ? 'info' : 'secondary'} onClick={this.selectDevice}>
            <i className="fa fa-check-circle-o"></i>
          </Button>
        </OverlayTrigger >
        <OverlayTrigger placement="top" overlay=<Tooltip id={this.props.rowData.uuid}>Ping</Tooltip>>
        <Button bsStyle={this.props.rowData.ping ? 'success' : 'secondary'} onClick={this.pingDevice}>
            <i className="fa fa-hand-o-up"></i>
          </Button>
        </OverlayTrigger>

      </ButtonGroup >
    )
  }
})

var DeviceInterfacesComponent = React.createClass({
  render() {
    return <div>
      {this.props.data.map((item) => {
        var net = `${item.network_name} (${item.vlan})`
        return (
          <div key={item.uuid}>
            <OverlayTrigger placement="right" overlay=
              <Tooltip id={item.uuid}>
              {item.hostname ? item.hostname : 'No hostname'} <br />
              {item.ip4addr ? item.ip4addr : 'Dynamic IPv4 ' + (item.lease4 ? '(' + item.lease4 + ')' : '')} <br />
              {item.ip6addr ? item.ip6addr : 'Dynamic IPv6 '} <br />
              {net}
            </Tooltip>>
            <code>
              {item.macaddr}
            </code>
          </OverlayTrigger>
          </div>
          )
        }
      )}
    </div >
  }

})

var DeviceValidComponent = React.createClass({
  render() {

    if (this.props.rowData.type != 'visitor') {
      return <span>{this.props.rowData.active}</span>
    } else {
      var start = moment(this.props.data[0]).format('YYYY-MM-DD HH:mm:ss')
      var end = moment(this.props.data[1]).format('YYYY-MM-DD HH:mm:ss')
      return <span>{start} - {end} ({this.props.rowData.active})</span>
    }


  }
})

var DeviceUserComponent = React.createClass({
  render() {
    var name = (this.props.rowData.user) ? this.props.rowData.users.display_name : ''
    var id = (this.props.rowData.user) ? this.props.rowData.user : ''
    return (
      <div>
        <OverlayTrigger placement="left" overlay=<Tooltip id={42}>{id}</Tooltip>>
        <div>
          {name}
        </div>
      </OverlayTrigger>
        </div >
    )
  }
})


export var DeviceList = React.createClass({
  mixins: [ModalConfirmMixin, Reflux.listenTo(DeviceStore, 'handleData')],

  handleData(data) {
    var devices = []
    _.each(data.list, (item) => {
      item.selected = data.selected.includes(item.uuid)
      item.ping = data.ping[item.uuid]

      var isExpired = (item.type == 'visitor') &&
        !moment().isBetween(item.valid[0], item.valid[1])
      item.active = ((item.users && !item.users.enabled) || isExpired) ? 'inactive' : 'active'
      devices.push(item)
    })
    this.state.data.list = devices
    this.state.data.selected = data.selected
    this.state.data.ping = data.ping
    this.setState(this.state)
  },

  componentDidMount() {
    DeviceActions.list()
  },

  getInitialState() {
    return { data: { list: [], selected: [], ping: {} } }
  },

  deleteSelected() {
    this.modalConfirm('Confirm delete', `Delete all selected devices?`,
      { 'confirmLabel': 'DELETE', 'confirmClass': 'danger' })
      .then(() => {
        _.each(this.state.data.selected, (item) => {
          DeviceActions.delete(item)
        })
      })
  },

  clearSelected() {
    DeviceActions.clearSelected()
  },

  pingSelected() {
      _.each(this.state.data.selected, (item) => {
        DeviceActions.ping(item)
      })
  },

  selectAll() {
    var items = []
    _.each(this.refs.Griddle.getCurrentResults(), (item) => {
      items.push(item.uuid)
    })
    DeviceActions.select(items)
  },

  render() {
    var columnMeta = [
      {
        columnName: 'c',
        displayName: '',
        customComponent: DeviceActionsComponent
      },
      {
        columnName: 'description',
        displayName: 'Description',
        customComponent: DeviceDescComponent,
        customCompareFn: pseudoNaturalCompare
      },
      {
        columnName: 'valid',
        displayName: 'Valid',
        customComponent: DeviceValidComponent
      },
      {
        columnName: 'user',
        displayName: 'User',
        customComponent: DeviceUserComponent
      },
      {
        columnName: 'location',
        displayName: 'Location'
      },
      {
        columnName: 'type',
        displayName: 'Type'
      },
      {
        columnName: 'interfaces',
        displayName: 'Interfaces',
        customComponent: DeviceInterfacesComponent
      }
    ]

    var rowMetadata = {
      'bodyCssClassName': function (rowData) {
        if (rowData.selected) {
          return 'info'
        }
        if (rowData.active == 'inactive') {
          return 'warning'
        }
        return 'default-row'
      }
    }

    return (
      <div className='container-fluid col-xs-12'>
        <div className="row">
          <div className="col-xs-12 col-sm-8">
            <h1>Devices</h1>
          </div>
          <div className="col-xs-12 col-sm-4 h1 text-right">
            <a className='btn btn-success' href='#/device/new'>
              <i className='fa fa-plus'></i> New device
            </a>
            <Button bsStyle='pink' disabled={this.state.data.selected.length == 0} onClick={this.pingSelected}>
              <i className="fa fa-hand-o-up"></i> Ping selected
            </Button>
            <Button bsStyle='danger' disabled={this.state.data.selected.length == 0} onClick={this.deleteSelected}>
              <i className="fa fa-trash-o"></i> Delete selected
            </Button>
            <Button bsStyle='info' disabled={this.state.data.selected.length == 0} onClick={this.clearSelected}>
              <i className="fa fa-ban"></i> Clear selected
            </Button>
            <Button bsStyle='warning' onClick={this.selectAll}>
              <i className="fa fa-list"></i> Select all (filtered)
            </Button>

          </div>
        </div>
        <Feedback />
        <Griddle ref="Griddle" results={this.state.data['list']}
          tableClassName='table table-bordered table-striped table-hover'
          useGriddleStyles={false}
          showFilter={true}
          rowMetadata={rowMetadata}
          useCustomPagerComponent='true'
          customPagerComponent={Pager}
          sortAscendingComponent={<span className='fa fa-sort-alpha-asc'></span>}
          sortDescendingComponent={<span className='fa fa-sort-alpha-desc'></span>}
          columns={['interfaces', 'description', 'location', 'type', 'user', 'valid', 'c']}
          resultsPerPage='20'
          customFilterer={regexGridFilter}
          useCustomFilterer='true'
          columnMetadata={columnMeta}
        />
      </div>
    )
  }
})

import * as React from 'react'
import * as Reflux from 'reflux'
import {MacHistoryStore} from '../stores/MacHistory'
import {MacHistoryActions} from '../actions'
import {Link} from 'react-router'
import {OverlayTrigger, Tooltip} from 'react-bootstrap'
import Griddle from 'griddle-react'
import {Pager} from './Pager'
import {regexGridFilter} from '../util/griddle-components'
import moment from 'moment'

var EmptyTr = React.createClass({
  render() {
    return null
  }
})

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
    var net = `${this.props.rowData.network_name} (${this.props.rowData.vlan})`
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

export var MacHistoryList = React.createClass({
  mixins: [Reflux.connect(MacHistoryStore, 'data')],

  componentDidMount() {
    MacHistoryActions.list()
  },

  getInitialState() {
    return {data: {list: []}}
  },


  render() {
    var columnMeta = [
      {
        columnName: 'mac_address',
        displayName: 'MAC address',
        customComponent: DeviceInterfacesComponent
      },
      {
        columnName: 'sw_name',
        displayName: 'Switch name',
      },
      {
        columnName: 'if_name',
        displayName: 'Interface',
      },
      {
        columnName: 'port_name',
        displayName: 'Port',
      },
      {
        columnName: 'dev_desc',
        displayName: 'Description',
        customComponent: DeviceDescComponent
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

    return (
        <div className='container-fluid col-xs-12'>
            <div className="row">
                <div className="col-xs-12 col-sm-10">
                    <h1>MacHistory</h1>
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
                         'mac_address',
                         'sw_name',
                         'if_name',
                         'port_name',
                         'dev_desc',
                         'time',
                         'c'
                     ]}
                     resultsPerPage='20'
                     customFilterer={regexGridFilter}
                     useCustomFilterer='true'
                     columnMetadata={columnMeta}
                     />
          </div>
    )
  }
})

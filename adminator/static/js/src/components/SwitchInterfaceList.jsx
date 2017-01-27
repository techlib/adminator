import * as React from 'react'
import * as Reflux from 'reflux'
import {SwitchInterfaceStore} from '../stores/SwitchInterface'
import {SwitchInterfaceActions} from '../actions'
// import {Link} from 'react-router'
// import {OverlayTrigger, Tooltip} from 'react-bootstrap'
import Griddle from 'griddle-react'
import {Pager} from './Pager'
import {regexGridFilter} from '../util/griddle-components'

var EmptyTr = React.createClass({
  render() {
    return null
  }
})

export var LinkStatusComponent = React.createClass({
  render() {
    var className = 'label label-'
    if (this.props.rowData.admin_status == '2') {
      return <span className={className+'danger'}>Adm down</span>
    } else {
      if (this.props.rowData.oper_status == '2') return <span className={className+'warning'}>Down</span>
      else return <span className={className+'success'}>Up</span>
    }
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

export var SwitchInterfaceList = React.createClass({
  mixins: [Reflux.connect(SwitchInterfaceStore, 'data')],

  componentDidMount() {
    SwitchInterfaceActions.list()
  },

  getInitialState() {
    return {data: {list: []}}
  },


  render() {
    var columnMeta = [
      {
        columnName: 'c',
        displayName: '',
        customComponent: EmptyTr
      },
      {
        columnName: 'admin_status',
        displayName: 'Link',
        customComponent: LinkStatusComponent
      }
    ]

    return (
        <div className='container-fluid col-xs-12'>
            <div className="row">
                <div className="col-xs-12 col-sm-10">
                    <h1>SwitchInterface</h1>
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
                         'sw_name',
                         'name',
                         'admin_status',
                         'speed',
                         'vlan',
                         'port_name',
                         'patterns',
                         'last_change',
                         'last_update',
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

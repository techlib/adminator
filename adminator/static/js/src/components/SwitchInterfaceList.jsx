import * as React from 'react'
import * as Reflux from 'reflux'
import {SwitchInterfaceStore} from '../stores/SwitchInterface'
import {SwitchInterfaceActions} from '../actions'
import Griddle from 'griddle-react'
import {Pager} from './Pager'
import {regexGridFilter} from '../util/griddle-components'
import moment from 'moment'

var EmptyTr = React.createClass({
  render() {
    return null
  }
})

export var SwitchInterfaceLinkStatusComponent = React.createClass({
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

export var SwitchInterfaceSpeedComponent = React.createClass({
  render() {
    if(this.props.data == null) {
      return null
    }
    var className = 'label label-link-speed-' + this.props.data.toLowerCase()
    return <span className={className}>{this.props.data}</span>
  }
})

var SwitchInterfacePatternsComponent = React.createClass({
  render() {
    return <div>
      {this.props.data.map((item) => {
        var className = 'label label-ifpattern-' + item[1].toLowerCase()
        return <span><span className={className}>{item[0]}</span>&nbsp;</span>
      })}
    </div>
  }
})

var SwitchInterfaceDateComponent = React.createClass({
    render() {
        var txt = moment.parseZone(this.props.data).format('YYYY-MM-DD HH:mm:ss')
        return <span>{txt}</span>
    }
})

var SwitchInterfaceTimedeltaComponent = React.createClass({
    render() {
        var txt = moment.duration(-1 * this.props.data, 's').humanize(true)
        return <span>{txt}</span>
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
        // customComponent: SwitchInterfaceVlanComponent
      },
      {
      columnName: 'sw_name',
      displayName: 'Switch name',
      },
      {
        columnName: 'name',
        displayName: 'Interface',
      },
      {
        columnName: 'port_name',
        displayName: 'Port',
      },
      {
        columnName: 'last_change',
        displayName: 'Last link change',
        customComponent: SwitchInterfaceTimedeltaComponent
      },
      {
        columnName: 'last_update',
        displayName: 'Last update',
        customComponent: SwitchInterfaceDateComponent
      },
      {
        columnName: 'patterns',
        displayName: 'Patterns',
        customComponent: SwitchInterfacePatternsComponent
      },
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
                         'link_status',
                         'last_change',
                         'speed',
                         'vlan',
                         'port_name',
                         'patterns',
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

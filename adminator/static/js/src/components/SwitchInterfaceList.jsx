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

export var SwitchInterfaceLinkComponent = React.createClass({
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

export var SwitchInterfaceVlanComponent = React.createClass({
  render() {
    return (
      <div>
        {((this.props.data > 4096) || (this.props.data < 1)) ? '' : this.props.data}
      </div>
    )
  }
})

export var SwitchInterfaceSpeedComponent = React.createClass({
  render() {
    var className = 'label label-'
    var profiles = {
      4294967295: ['primary', '24G'],
      1000000000: ['success', '1G'],
       100000000: ['warning', '100M'],
        10000000: ['info', '10M'],
         1000000: ['danger', '1M'],
               0: ['default', '0'],
    }
    var key = this.props.data
    // var key = this.props.rowData.speed
    if (key in profiles) return <span className={className+profiles[key][0]}>{profiles[key][1]}</span>
    return <span className={className+'default'}>{key}</span>
  }
})

var SwitchInterfacePatternsComponent = React.createClass({
  render() {
    var className = 'label label-'
    var profiles = {
      0: 'default',
      1: 'primary',
      2: 'success',
      3: 'info',
      4: 'warning',
      5: 'danger',
    }
    if (this.props.data.length == 0) return <div><span className={className+'danger'}>{'None'}</span></div>
    return <div>
      {this.props.data.map((item) => {
        var style = item[1] in profiles ? profiles[item[1]] : 'default'
        return <span><span className={className+style}>{item[0]}</span>&nbsp;</span>
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
        // var txt = moment().subtract(this.props.data, 's').fromNow()
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
        columnName: 'admin_status',
        displayName: 'Link',
        customComponent: SwitchInterfaceLinkComponent
      },
      {
        columnName: 'speed',
        displayName: 'Speed',
        customComponent: SwitchInterfaceSpeedComponent
      },
      {
        columnName: 'vlan',
        displayName: 'VLAN',
        customComponent: SwitchInterfaceVlanComponent
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
                         'admin_status',
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

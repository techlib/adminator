import * as React from 'react'
import * as Reflux from 'reflux'
import {SwitchInterfaceStore} from '../../stores/SwitchInterface'
import {SwitchInterfaceActions} from '../../actions'
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

var SwitchInterfacePatternsComponent = React.createClass({
  render() {
    return <div>
      {this.props.data.map((item) => {
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
  }
})

var SwitchInterfaceDateComponent = React.createClass({
    render() {
      if(this.props.data == null) return null
      var txt = moment.parseZone(this.props.data).format('YYYY-MM-DD HH:mm:ss')
      return <span>{txt}</span>
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

var SwitchInterfaceSwitchComponent = React.createClass({
  render() {
    return (
      <Link to={`/switch/${this.props.rowData.switch}`}>
        {this.props.data}
      </Link>
    )
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
      },
      {
      columnName: 'sw_name',
      displayName: 'Switch name',
      customComponent: SwitchInterfaceSwitchComponent,
      customCompareFn: pseudoNaturalCompare
      },
      {
        columnName: 'name',
        displayName: 'Interface',
        customComponent: SwitchInterfaceNameComponent,
        customCompareFn: pseudoNaturalCompare
      },
      {
        columnName: 'port_name',
        displayName: 'Port',
        customCompareFn: pseudoNaturalCompare
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
            <Feedback />
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

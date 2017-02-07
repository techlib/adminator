import * as React from 'react'
import * as Reflux from 'reflux'
import {ConfigPatternStore} from '../stores/ConfigPattern'
import {ConfigPatternActions} from '../actions'
import {Link} from 'react-router'
import {OverlayTrigger, Tooltip} from 'react-bootstrap'
import Griddle from 'griddle-react'
import {Pager} from './Pager'
import {regexGridFilter} from '../util/griddle-components'

var EmptyTr = React.createClass({
  render() {
    return null
  }
})

var ConfigPatternStyleComponent = React.createClass({
  render() {
    var className = 'label label-ifpattern-' + this.props.data.toLowerCase()
    return <span className={className}>{this.props.data}</span>
  }
})

var ConfigPatternMandatoryComponent = React.createClass({
  render() {
    return <div className='div-overflowed' key={'mandatory' + this.props.rowData.uuid}>
      <OverlayTrigger placement="left" overlay=
        <Tooltip id={'mandatory' + this.props.rowData.uuid}>
          {this.props.data.map((item) => { return <span>{item}<br/></span> })}
        </Tooltip>>
        <code>
          {this.props.data.join(', ')}
        </code>
      </OverlayTrigger>
    </div>

  }
})

var ConfigPatternOptimalComponent = React.createClass({
  render() {
    return <div className='div-overflowed' key={'optimal' + this.props.rowData.uuid}>
      <OverlayTrigger placement="left" overlay=
        <Tooltip id={'optimal' + this.props.rowData.uuid}>
          {this.props.data.map((item) => { return <span>{item}<br/></span> })}
        </Tooltip>>
        <code>
          {this.props.data.join(', ')}
        </code>
      </OverlayTrigger>
    </div>
  }
})

var ConfigPatternNameComponent = React.createClass({
  render() {
    return (
      <Link to={`/cfgPattern/${this.props.rowData.uuid}`}>
        {this.props.data}
      </Link>
    )
  }
})

export var ConfigPatternList = React.createClass({
  mixins: [Reflux.connect(ConfigPatternStore, 'data')],

  componentDidMount() {
    ConfigPatternActions.list()
  },

  getInitialState() {
    return {data: {list: []}}
  },


  render() {
    var columnMeta = [
      {
        columnName: 'name',
        displayName: 'Name',
        cssClassName: 'col-xs-1',
        customComponent: ConfigPatternNameComponent
      },
      {
        columnName: 'mandatory',
        displayName: 'Mandatory',
        cssClassName: 'col-xs-6 td-overflowed',
        customComponent: ConfigPatternMandatoryComponent
      },
      {
        columnName: 'optimal',
        displayName: 'Optimal',
        cssClassName: 'col-xs-4 td-overflowed',
        customComponent: ConfigPatternOptimalComponent
      },
      {
        columnName: 'style',
        displayName: 'Style',
        cssClassName: 'col-xs-1',
        customComponent: ConfigPatternStyleComponent
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
                    <h1>Interface configuration patterns</h1>
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
                      'style',
                      'mandatory',
                      'optimal',
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

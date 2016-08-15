import * as React from 'react'
import * as Reflux from 'reflux'
import {TopologyStore} from '../stores/Topology'
import {TopologyActions} from '../actions'
import Griddle from 'griddle-react'
import {Pager} from './Pager'
import {regexGridFilter} from '../util/griddle-components'

var EmptyTr = React.createClass({
  render() {
    return null
  }
})

export var TopologyList = React.createClass({
  mixins: [Reflux.connect(TopologyStore, 'data')],

  componentDidMount() {
    TopologyActions.list()
  },

  getInitialState() {
    return {data: {list: []}}
  },


  render() {
    var columnMeta = [
      {
        columnName: 'src_analyzer_group_name',
        displayName: 'SRC switchroom',
      },
      {
        columnName: 'dst_analyzer_group_name',
        displayName: 'DST switchroom',
      },
      {
        columnName: 'src_name',
        displayName: 'SRC name',
      },
      {
        columnName: 'dst_name',
        displayName: 'DST name',
      },
      {
        columnName: 'src_position_on_pp',
        displayName: 'SRC position on panel',
      },
      {
        columnName: 'dst_position_on_pp',
        displayName: 'DST position on panel',
      },
      {
        columnName: 'src_type',
        displayName: 'SRC type',
      },
      {
        columnName: 'dst_type',
        displayName: 'DST type',
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
                    <h1>Topology</h1>
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
                         'src_analyzer_group_name',
                         'src_name',
                         'src_position_on_pp',
                         'src_type',
                         'dst_analyzer_group_name',
                         'dst_name',
                         'dst_position_on_pp',
                         'dst_type',
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
});


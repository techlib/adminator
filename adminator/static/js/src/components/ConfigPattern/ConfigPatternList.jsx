import * as React from 'react'
import * as Reflux from 'reflux'
import {ConfigPatternStore} from '../../stores/ConfigPattern'
import {ConfigPatternActions} from '../../actions'
import {ModalConfirmMixin} from '../ModalConfirmMixin'
import {Link} from 'react-router'
import {ButtonGroup, Button, OverlayTrigger, Tooltip} from 'react-bootstrap'
import Griddle from 'griddle-react'
import {Pager} from './../Pager'
import {regexGridFilter} from '../../util/griddle-components'
import {Feedback} from '../Feedback'

var ConfigPatternRecalculateAllComponent = React.createClass({

    mixins: [ModalConfirmMixin],

  recalculateHandler() {
    this.modalConfirm(
      'Confirm recalculate',
      'Do you want to recalculate all interface-pattern pairs? It may take a while (tens of seconds).',
      {'confirmLabel': 'RECALCULATE', 'confirmClass': 'warning'}
    ).then(() => { ConfigPatternActions.recalculateall()})
  },

  render() {
    return<Button bsStyle='warning' onClick={this.recalculateHandler}>
      <span className='glyphicon glyphicon-repeat'></span> Recalculate all
    </Button>
  }
})

var ConfigPatternActionsComponent = React.createClass({

    mixins: [ModalConfirmMixin],

  deleteConfigPattern() {
    var name = this.props.rowData.name
    this.modalConfirm(
      'Confirm delete', `Delete pattern ${name}?`, {'confirmLabel': 'DELETE', 'confirmClass': 'danger'}
    ).then(() => { ConfigPatternActions.delete(this.props.rowData.uuid)})
  },

  recalculateConfigPattern(uuid) {
    ConfigPatternActions.recalculate(this.props.rowData.uuid)
  },

  render() {
    return <ButtonGroup>
      <OverlayTrigger placement="top" overlay=<Tooltip id={this.props.rowData.uuid+'recalc'}>
        Recalculate
      </Tooltip>>
        <Button bsStyle='warning' onClick={this.recalculateConfigPattern}>
          <span className='glyphicon glyphicon-repeat'></span>
        </Button>
      </OverlayTrigger>
      <OverlayTrigger placement="top" overlay=<Tooltip id={this.props.rowData.uuid+'delete'}>Delete</Tooltip>>
        <Button bsStyle='danger' onClick={this.deleteConfigPattern}>
          <i className="fa fa-trash-o"></i>
        </Button>
      </OverlayTrigger>
    </ButtonGroup>
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
        <code className='gray-blue-code'>
          {this.props.data.join(', ')}
        </code>
      </OverlayTrigger>
    </div>

  }
})

var ConfigPatternOptionalComponent = React.createClass({
  render() {
    return <div className='div-overflowed' key={'optional' + this.props.rowData.uuid}>
      <OverlayTrigger placement="left" overlay=
        <Tooltip id={'optional' + this.props.rowData.uuid}>
          {this.props.data.map((item) => { return <span>{item}<br/></span> })}
        </Tooltip>>
        <code className='gray-blue-code'>
          {this.props.data.join(', ')}
        </code>
      </OverlayTrigger>
    </div>
  }
})

var ConfigPatternNameComponent = React.createClass({
  render() {
    return <Link to={`/cfgPattern/${this.props.rowData.uuid}`}>
      {this.props.data}
    </Link>
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
        columnName: 'optional',
        displayName: 'Optional',
        cssClassName: 'col-xs-4 td-overflowed',
        customComponent: ConfigPatternOptionalComponent
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
        customComponent: ConfigPatternActionsComponent
      }
    ]

    return <div className='container-fluid col-xs-12'>
      <div className="row">
        <div className="col-xs-12 col-sm-8">
          <h1>Interface configuration patterns</h1>
        </div>
        <div className="col-xs-12 col-sm-4 h1 text-right">
          <Link className='btn btn-success' to="/cfgPattern/new">
            <i className='fa fa-plus'></i> New pattern
          </Link>
          <ConfigPatternRecalculateAllComponent />
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
                'name',
                'style',
                'mandatory',
                'optional',
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

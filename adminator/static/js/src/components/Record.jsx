import * as React from 'react'
import * as Reflux from 'reflux'
import {RecordStore} from '../stores/Record'
import {RecordActions} from '../actions'
import {RecordCreate} from './RecordCreate'
import {Link} from 'react-router'
import Griddle from 'griddle-react'
import {ModalConfirmMixin} from './ModalConfirmMixin'
import {Pager} from './Pager'
import {ButtonGroup, Button, OverlayTrigger, Tooltip} from 'react-bootstrap'
import * as _ from 'lodash'
import {regexGridFilter} from '../util/griddle-components'
import {isIP4, isIP6} from '../util/simple-validators'

export var RecordNameComponent = React.createClass({
  render() {
    return (
      <Link to={`/record/${this.props.rowData.id}`}>
        {this.props.data}
      </Link>
    )
  }
})

export var RecordContentComponent = React.createClass({
  render() {
    return (
      <span>{this.props.rowData.content}</span>
    )
  }
})


export var RecordTypeComponent = React.createClass({
  render() {
    if(this.props.data == null) {
      return null
    }
    var className = 'label label-' + this.props.data.toLowerCase()
    return <span className={className}>{this.props.data}</span>
  }
})

export var RecordActionsComponent = React.createClass({
  mixins: [ModalConfirmMixin],

  handleDelete() {
    var name = this.props.rowData.name
    var type = this.props.rowData.type
      this.modalConfirm('Confirm delete', `Delete ${type} record ${name}?`,
                          {'confirmLabel': 'DELETE', 'confirmClass': 'danger'})
      .then(() => {
        RecordActions.delete(this.props.rowData.id)
      })

  },
  render() {
    return (
      <ButtonGroup>
        <OverlayTrigger placement="top" overlay=<Tooltip id={'recdelete' + this.props.rowData.id}>Delete</Tooltip>>
          <Button bsStyle='danger' onClick={this.handleDelete}>
            <i className="fa fa-trash-o"></i>
          </Button>
        </OverlayTrigger>
      </ButtonGroup>
    )
  }
})

export var Record = React.createClass({
  mixins: [Reflux.listenTo(RecordStore, 'handleData')],


  componentDidMount() {
    RecordActions.list()
  },

  handleData(data) {
    var records = []
    _.each(data.list, (item) => {
     if(isIP4(item.content)) {
       item.content_sort = item.content.replace(/\./g, '')
      } else if(isIP6(item.content)) {
       item.content_sort = item.content.replace(/\:/g, '')
      } else { 
       item.content_sort = item.content
      }
     records.push(item)
    })
    this.state.data.list = records
    this.setState(this.state)
  },

  getInitialState() {
    return {data: {records: []}, showNewForm: false}
  },

  showNewRecord() {
    this.setState({showNewForm: !this.state.showNewForm})
  },

  hideNewRecord() {
    this.setState({showNewForm: false})
  },

  getNewRecordForm() {
    if (this.state.showNewForm) {
      return <RecordCreate hideHandler={this.hideNewRecord}
        records={this.state.data['list']}/>
    }
  },

  render() {
    var columnMeta = [
      {
        columnName: 'type',
        displayName: 'Type',
        customComponent: RecordTypeComponent
      },{
        columnName: 'c',
        displayName: '',
        customComponent: RecordActionsComponent
      },{
        columnName: 'name',
        displayName: 'Name',
        customComponent: RecordNameComponent
      }, {
        columnName: 'type',
        displayName: 'Type'
      }, {
        columnName: 'content_sort',
        displayName: 'Content',
        customComponent: RecordContentComponent
      }

    ]

    return (
        <div className='col-xs-12 container-fluid'>
            <div className="row">
                <div className="col-xs-12 col-sm-10">
                    <h1>Records</h1>
                </div>
                <div className="col-xs-12 col-sm-2 h1 text-right">
                    <a className='btn btn-success' onClick={this.showNewRecord}>
                        <i className='fa fa-plus'></i> New record
                    </a>
                </div>
            </div>
            {this.getNewRecordForm()}
            <Griddle results={this.state.data['list']}
                     tableClassName='datatable table table-striped table-hover table-bordered datatable'
                     useGriddleStyles={false}
                     showFilter={true}
                     useCustomPagerComponent='true'
                     customPagerComponent={Pager}
                     sortAscendingComponent={<span className='fa fa-sort-alpha-asc'></span>}
                     sortDescendingComponent={<span className='fa fa-sort-alpha-desc'></span>}
                     columns={['name', 'type','content_sort', 'c']}
                     resultsPerPage='20'
                     customFilterer={regexGridFilter}
                     useCustomFilterer='true'
                     columnMetadata={columnMeta}
                     />
          </div>
    )
  },

})


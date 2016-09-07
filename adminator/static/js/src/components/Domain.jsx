import * as React from 'react'
import * as Reflux from 'reflux'
import {DomainActions} from '../actions'
import {DomainStore} from '../stores/Domain'
import {Link} from 'react-router'
import {ModalConfirmMixin} from './ModalConfirmMixin'
import Griddle from 'griddle-react'
import {Pager} from './Pager'
import {ButtonGroup, OverlayTrigger, Tooltip, Button} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'

var DomainNameComponent = React.createClass({
  render() {
    return (
      <div>
          <Link to={`/domainEdit/${this.props.rowData.id}`}>
            {this.props.data}
          </Link>
      </div>
    )
  }
})


var DomainActionsComponent = React.createClass({

  mixins: [ModalConfirmMixin],

  handleDelete() {
        var name = this.props.rowData.name
        this.modalConfirm('Confirm delete', `Delete ${name}?`,
                            {'confirmLabel': 'DELETE', 'confirmClass': 'danger'})
        .then(() => {
          DomainActions.delete(this.props.rowData.id)
        })
  },
  render() {
    return (
        <ButtonGroup>
          <LinkContainer to={`/domain/${this.props.rowData.id}`}>
            <OverlayTrigger placement="top" overlay=<Tooltip id={'record'+this.props.rowData.id}>Records</Tooltip>>
              <Button bsStyle='info'>
                <i className="fa fa-list-alt"></i>
              </Button>
            </OverlayTrigger>
          </LinkContainer>

            <OverlayTrigger placement="top" overlay=<Tooltip id={'delete'+this.props.rowData.id}>Delete</Tooltip>>
              <Button bsStyle='danger' onClick={this.handleDelete}>
                <i className="fa fa-trash-o"></i>
              </Button>
            </OverlayTrigger>
        </ButtonGroup>
        )
  }
})

export var Domain = React.createClass({

  mixins: [Reflux.connect(DomainStore, 'data')],

  componentDidMount() {
    DomainActions.list()
  },

  getInitialState() {
    return {data: {list: []}}
  },


  getList() {
    var columnMeta = [
      {
        columnName: 'name',
        displayName: 'Name',
        customComponent: DomainNameComponent
      }, {
        columnName: 'c',
        displayName: '',
        customComponent: DomainActionsComponent
      },


    ]

     return (
        <div className='container-fluid col-xs-12'>
            <div className="row">
                <div className="col-xs-12 col-sm-10">
                    <h1>Domains</h1>
                </div>
                <div className="col-xs-12 col-sm-2 h1 text-right">
                    <a className='btn btn-success' href='#/domainEdit/new'>
                    <i className='fa fa-plus'></i> New domain
                    </a>
                </div>
            </div>
            <Griddle results={this.state.data['list']}
                     tableClassName='table table-bordered table-striped table-hover'
                     useGriddleStyles={false}
                     showFilter={false}
                     useCustomPagerComponent='true'
                     customPagerComponent={Pager}
                     sortAscendingComponent={<span className='fa fa-sort-alpha-asc'></span>}
                     sortDescendingComponent={<span className='fa fa-sort-alpha-desc'></span>}
                     resultsPerPage='20'
                     columns={['name', 'c']}
                     columnMetadata={columnMeta}
                     />
          </div>
    )
  },

  render() {
   return this.getList()
  }
})


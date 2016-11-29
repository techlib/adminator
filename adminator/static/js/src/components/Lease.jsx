import * as React from 'react'
import * as Reflux from 'reflux'
import {Lease4Actions, Lease6Actions} from '../actions'
import {Lease4Store, Lease6Store} from '../stores/Lease'
import Griddle from 'griddle-react'
import {Pager} from './Pager'
import {Link} from 'react-router'
import * as _ from 'lodash'
import {ButtonGroup, OverlayTrigger, Button, Tooltip, Tabs, Tab} from 'react-bootstrap'
import {regexGridFilter} from '../util/griddle-components'
import moment from 'moment'
import {ModalConfirmMixin} from './ModalConfirmMixin'

var Lease4ActionsComponent = React.createClass({
    mixins: [ModalConfirmMixin],

    deleteLease4() {
        var name = this.props.rowData.address
        this.modalConfirm('Confirm delete', `Delete ${name}?`,
                            {'confirmLabel': 'DELETE', 'confirmClass': 'danger'})
        .then(() => {
            Lease4Actions.delete(this.props.rowData.address)
    })

  },
  render() {
    return (
      <ButtonGroup>
        <OverlayTrigger placement="top" overlay=<Tooltip id={this.props.rowData.uuid}>Delete</Tooltip>>
          <Button bsStyle='danger' onClick={this.deleteLease4}>
            <i className="fa fa-trash-o"></i>
          </Button>
        </OverlayTrigger>
      </ButtonGroup>
    )
  }
})

var Lease6ActionsComponent = React.createClass({
    mixins: [ModalConfirmMixin],

    deleteLease6() {
        var name = this.props.rowData.address
        this.modalConfirm('Confirm delete', `Delete ${name}?`,
                            {'confirmLabel': 'DELETE', 'confirmClass': 'danger'})
        .then(() => {
            Lease6Actions.delete(this.props.rowData.address)
    })

  },
  render() {
    return (
      <ButtonGroup>
        <OverlayTrigger placement="top" overlay=<Tooltip id={this.props.rowData.uuid}>Delete</Tooltip>>
          <Button bsStyle='danger' onClick={this.deleteLease6}>
            <i className="fa fa-trash-o"></i>
          </Button>
        </OverlayTrigger>
      </ButtonGroup>
    )
  }
})

var LeaseStateComponent = React.createClass({
    render() {
        var txt = this.props.data
        switch (this.props.data) {
            case 0:
                txt = 'default'
                break
            case 1:
                txt = 'declined'
                break
            case 2:
                txt = 'expired-reclaimed'
                break
        }
        return <span>{txt}</span>
    }
})

var LeaseMacComponent = React.createClass({
    render() {
        if(this.props.rowData.device){
          return  <OverlayTrigger placement="right" overlay=
                      <Tooltip id={this.props.data}>
                        {this.props.rowData.description} <br/>
                        {this.props.rowData.display_name}
                      </Tooltip>>
                      <code>
                      <Link to={`/device/${this.props.rowData.device}`}>
                        {this.props.data}
                      </Link>
                      </code>
                </OverlayTrigger>
        } else {
            return <code>{this.props.data}</code>
        }
    }
})

var LeaseDateComponent = React.createClass({
    render() {
        var txt = moment.parseZone(this.props.data).format('YYYY-MM-DD HH:mm:ss')
        return <span>{txt}</span>
    }
})


export var Lease = React.createClass({
  mixins: [Reflux.connect(Lease4Store, 'lease4data'), Reflux.connect(Lease6Store, 'lease6data')],

  componentDidMount() {
    Lease4Actions.list()
    Lease6Actions.list()
  },

  getInitialState() {
    return {lease4data: {}, lease6data: {}}
  },


  render() {
    var lease4ColumnMeta = [
      {
        columnName: 'c',
        displayName: '',
        customComponent: Lease4ActionsComponent
      },
      {
        columnName: 'address',
        displayName: 'IP'
      },
      {
        columnName: 'hwaddr',
        displayName: 'MAC',
        customComponent: LeaseMacComponent
      },
      {
        columnName: 'expire',
        displayName: 'Expire',
        customComponent: LeaseDateComponent
      },
      {
        columnName: 'valid_lifetime',
        displayName: 'Valid lifetime',
      },
      {
        columnName: 'state',
        displayName: 'State',
        customComponent: LeaseStateComponent
      },
      {
        columnName: 'hostname',
        displayName: 'Hostname',
      }
    ]

    var lease6ColumnMeta = _.cloneDeep(lease4ColumnMeta)
    lease6ColumnMeta[0].customComponent = Lease6ActionsComponent

      return (
        <div className='col-xs-12 container-fluid'>

            <h1>Leases</h1>
                        <Tabs defaultActiveKey={1}>
                            <Tab eventKey={1} animation={false} title="IPv4">

                                <Griddle results={this.state.lease4data['list']}
                                                 tableClassName='datatable table table-striped table-hover table-bordered datatable'
                                                 useGriddleStyles={false}
                                                 showFilter={true}
                                                 useCustomPagerComponent='true'
                                                 customPagerComponent={Pager}
                                                 sortAscendingComponent={<span classNameName='fa fa-sort-alpha-asc'></span>}
                                                 sortDescendingComponent={<span classNameName='fa fa-sort-alpha-desc'></span>}
                                                 resultsPerPage='20'
                                                 customFilterer={regexGridFilter}
                                                 useCustomFilterer='true'
                                                 columns={['address', 'hwaddr', 'expire', 'valid_lifetime', 'state', 'hostname', 'c']}
                                                 columnMetadata={lease4ColumnMeta}
                                                 />


                            </Tab>
                            <Tab eventKey={2} title="IPv6">
                <Griddle results={this.state.lease6data['list']}
                         tableClassName='datatable table table-striped table-hover table-bordered datatable'
                         useGriddleStyles={false}
                         showFilter={true}
                         useCustomPagerComponent='true'
                         customPagerComponent={Pager}
                         sortAscendingComponent={<span classNameName='fa fa-sort-alpha-asc'></span>}
                         sortDescendingComponent={<span classNameName='fa fa-sort-alpha-desc'></span>}
                         resultsPerPage='20'
                         customFilterer={regexGridFilter}
                         useCustomFilterer='true'
                         columns={['address', 'hwaddr', 'expire', 'valid_lifetime', 'state', 'hostname', 'c']}
                                                 columnMetadata={lease6ColumnMeta}
                         />
                            </Tab>
                        </Tabs>

          </div>
    )
  },

})

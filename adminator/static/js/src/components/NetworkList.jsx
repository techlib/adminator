import * as React from 'react'
import * as Reflux from 'reflux'
import {Feedback} from './Feedback'
import {NetworkActions} from '../actions'
import {NetworkStore} from '../stores/Network'
import {UserInfoStore} from '../stores/UserInfo'
import Griddle from 'griddle-react'
import {ModalConfirmMixin} from './ModalConfirmMixin'
import {Pager} from './Pager'
import {Link} from 'react-router'
import {OverlayTrigger, Button, Tooltip} from 'react-bootstrap'

let NetLink = React.createClass({
  render: function () {
    return  <Link to={`/network/${this.props.rowData.uuid}`}>
                {this.props.data}
            </Link>
  }
})

let NetActions = React.createClass({

    mixins: [ModalConfirmMixin],

    handleDelete: function () {
        var name = this.props.rowData.description
        this.modalConfirm('Confirm delete', `Delete ${name}?`,
                            {'confirmLabel': 'DELETE', 'confirmClass': 'danger'})
        .then(() => {
            NetworkActions.delete(this.props.rowData.uuid)
        })
    },

    render: function () {
        var id = 'row' + this.props.rowData.uuid
        return (
        <OverlayTrigger placement="top" overlay=<Tooltip id={id}>Delete</Tooltip>>
              <Button bsStyle="danger" onClick={this.handleDelete}>
                <i className="fa fa-trash-o"></i>
              </Button>
        </OverlayTrigger>
        )
    }
})

export var NetworkList = React.createClass({

  mixins: [Reflux.connect(NetworkStore, 'data')],

  componentDidMount() {
    NetworkActions.list()
  },

  getInitialState() {
    this.state = {'data': {'list': [], 'network': {}}}
    return this.state
  },

  colMetadata: [
        {columnName: 'description', displayName: 'Description',
            customComponent: NetLink},
        {columnName: 'vlan', displayName: 'VLAN'},
        {columnName: 'prefix4', displayName: 'Prefix IPv4'},
        {columnName: 'prefix6', displayName: 'Prefix IPv6'},
        {columnName: 'max_lease', displayName: 'Max. lease'},
        {columnName: 'c', displayName: '',
            customComponent: NetActions},
  ],

  getAclButton() {
     if (UserInfoStore.isAllowed('networkacl')) {
        return (
			<a className='btn btn-default' href='#/network/acl'> ACL</a>
        )
    }
  },

   render() {
    return (
        <div className='container-fluid col-xs-12'>
                <div className="row">
                    <div className="col-xs-12 col-sm-6">
                        <h1>Networks</h1>
                    </div>
                    <div className="col-xs-12 col-sm-6 h1 text-right">
						{this.getAclButton()} <a className='btn btn-default' href='#/dhcp/'>
                            Global DHCP options
                        </a> <a className='btn btn-success' href='#/network/new'>
                            <i className='fa fa-plus'></i> New network
                        </a>
                    </div>
                </div>
                <Feedback />
            <Griddle results={this.state.data['list']}
                tableClassName='table table-bordered table-striped table-hover'
                columnMetadata={this.colMetadata}
                useGriddleStyles={false}
                showFilter={true}
                columns={['description', 'vlan', 'prefix4', 'prefix6', 
                          'max_lease', 'c']}
                showPager={true}
                resultsPerPage="50"
                useCustomPagerComponent={true}
                customPagerComponent={Pager}
                initialSort="description"
            />
        </div>
         )
   }
})


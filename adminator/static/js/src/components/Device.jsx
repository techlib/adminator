import * as React from 'react'
import * as Reflux from 'reflux'
import {NetworkStore} from '../stores/Network'
import {UserStore} from '../stores/User'
import {UserInfoStore} from '../stores/UserInfo'
import {DeviceForm} from './DeviceForm'
import {DeviceInterfaceList} from './DeviceInterfaceList'
import {ModalConfirmMixin} from './ModalConfirmMixin'
import {DeviceActions, FeedbackActions, NetworkActions, UserActions} from '../actions'
import {Feedback} from './Feedback'
import * as _ from 'lodash'
import {notEmpty} from '../util/simple-validators'

export var Device = React.createClass({

    mixins: [Reflux.connect(NetworkStore, 'networks'),
             Reflux.connect(UserStore, 'users'),
       ModalConfirmMixin],

    componentDidMount() {
        UserInfoStore.listen(this.setUserConstraints)
        NetworkActions.list()
        UserActions.list()
    },

    setUserConstraints() {
        if (this.state.device.type == null) {
            var networks = UserInfoStore.getDeviceTypePermissions()
            var perms = ['staff', 'device', 'visitor']
            if (networks !== null) {
                perms = _.keys( UserInfoStore.getDeviceTypePermissions())
            }
            this.setState({device: {type: perms[0]}})
        }
    },

    getInitialState() {
       var perms = _.keys( UserInfoStore.getDeviceTypePermissions())
       if (perms == null) {
        perms = ['staff']
       }
       return {networks: {}, users: {}, device: {type: perms[0]}}
    },

    componentWillReceiveProps(p) {
        if (this.state.device.uuid) {
            p = _.omit(p, ['device'])
        }
        this.setState(p)
    },

    addInterface() {
        this.refs.interfaceList.addInterface()
    },

    validate() {
        var r = []
        r = r.concat(this.refs.device.validate())
        r = r.concat(this.refs.interfaceList.validate())
        return r.filter(item => {return notEmpty(item)})
    },

    getValues() {
        var data = this.refs.device.getValues()
        data.interfaces = this.refs.interfaceList.getValues()

        return data
    },

    save() {
        var errors = this.validate()

        if (errors.length > 0) {
            FeedbackActions.set('error', 'Form contains invalid data:', errors)
        } else {
            this.props.saveHandler(this.getValues())
        }
    },

    delete() {
		var uuid = this.props.device.uuid
        this.modalConfirm('Confirm delete', `Delete ${this.props.device.description}?`,
                            {'confirmLabel': 'DELETE', 'confirmClass': 'danger'})
        .then(() => {
            DeviceActions.delete(uuid)
		})
    },

	getDeleteLink() {
		if (this.props.device.uuid !== true) {
			return (
				<button type="button" className="btn btn-link" onClick={this.delete}>
					<span className="text-danger">
						<span className="pficon pficon-delete"></span> Delete this device
					</span>
				</button>
			)
		}
	},

    getAllowedTypes() {
        var perms = UserInfoStore.getDeviceTypePermissions()
        if (perms == null) {
            return ['staff', 'visitor', 'device']
        } else {
            return _.keys(UserInfoStore.getDeviceTypePermissions())
        }
    },

    getAllowedNetworks() {
        var permissions = UserInfoStore.getDeviceTypePermissions()
        if (permissions == null) {
            return this.state.networks.list
        }

        var allowedNetworks = permissions[this.state.device.type]
        return _.filter(this.state.networks.list, function (item) {
            return _.includes(allowedNetworks, item.uuid)
        })
    },

    handleTypeChange(value) {
        this.setState({device: {'type': value}})
    },

    render() {
    return (
        <div className='col-xs-12 container-fluid'>
            <h1>{this.props.title}</h1>
                <Feedback />
            <div className='row'>
            <div className='col-xs-12 col-md-6'>
                <div className='panel panel-default'>
                    <div className='panel-heading'>
                        <h3 className='panel-title'>Device</h3>
                    </div>
                    <div className='panel-body'>
                        <DeviceForm device={this.state.device}
                                    users={this.state.users.list}
                                    allowedTypes={this.getAllowedTypes()}
                                    typeChangeHandler={this.handleTypeChange}
                                    ref='device' />
                    </div>
                    <div className='panel-footer'>
                        <div className="row">
                            <div className="col-xs-6">
                                <button className='btn btn-primary'
                                        onClick={this.save}>Save</button>
                            </div>
                            <div className="col-xs-6 text-right">
								{this.getDeleteLink()}
							</div>
                        </div>
                    </div>
                </div>
            </div>

        <div className='col-xs-12 col-md-6'>
            <div className='panel panel-default'>
                <div className='panel-heading'>
                    <h3 className='panel-title'>Interfaces</h3>
                </div>
                <div className='panel-body'>
                    <DeviceInterfaceList networks={this.getAllowedNetworks()}
                                         interfaces={this.props.device.interfaces}
                                         ref='interfaceList' />

                </div>

                <div className='panel-footer'>
                    <a onClick={this.addInterface}>
                        <span className="pficon pficon-add-circle-o"></span> Add new interface</a>
                </div>
            </div>

        </div>
    </div>
</div>
    )
    }
})

var Device = React.createClass({

    mixins: [Reflux.connect(networkStore, 'networks'),
             Reflux.connect(userStore, 'users'),
			 ModalConfirmMixin],

    componentDidMount() {
        NetworkActions.list()
        UserActions.list()
    },

    getInitialState() {
       return {networks: {}, users: {}}
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
		var uuid = this.props.device.uuid;
        this.modalConfirm('Confirm delete', `Delete ${this.props.device.description}?`,
                            {'confirmLabel': 'DELETE', 'confirmClass': 'danger'})
        .then(() => {
            DeviceActions.delete(uuid)
		})
    },

	getDeleteLink() {
		if (this.props.device.uuid) {
			return (
				<button type="button" className="btn btn-link" onClick={this.delete}>
					<span className="text-danger">
						<span className="pficon pficon-delete"></span> Delete this device
					</span>
				</button>
			)
		}
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
                        <DeviceForm device={this.props.device}
                                    users={this.state.users.list} 
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
                    <DeviceInterfaceList networks={this.state.networks.list}
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

var DeviceTypeSelector = React.createClass({

types: ['device', 'staff', 'visitor'],

getState() {
	return _.invert(this.state, true)[1] || []
},

handleChange(evt) {
	var v = {}
	v[evt.target.value] = + evt.target.checked
	this.setState(v)
},

getInitialState() {
	return {device: + this.props.device,
			staff: + this.props.staff,
			visitor: + this.props.visitor}	
},

render() {
	return (
	<div className="form-group" key={this.props.name}>
		<label className="col-sm-6 control-label">{this.props.name} ({this.props.vlan})</label>
		<div className="col-sm-6">

			{this.types.map((item) => {
				return (
				<label className="checkbox-inline" key={item}>
				<input type="checkbox"
					   value={item}
					   onChange={this.handleChange}
					   checked={this.state[item]} /> {item}
				</label>
				)
			})
			}
		</div>
	</div>
	)
}

})


var NetworkAcl = React.createClass({

    mixins: [Reflux.connect(networkStore, 'networks')
],

    componentDidMount() {
        NetworkActions.list();
    },

    save() {
		var data = _.filter(_.map(this.state.networks.list, (item) => {
			var types = this.refs[item.uuid].getState()
			if (types.length > 0) {
				return {
					'network': item.uuid,
					'device_types': types
				}
			}
		}))
		this.props.save_handler(data)
    },

    getInitialState() {
        return {'networks': {list: []},
                'role': {}}
    },

    render() {

		var data = []
		var me = this;

		_.map(this.state.networks.list, function(item) {
			var i = {
				uuid: item.uuid,
				name: item.description,
				vlan: item.vlan,
				device: 0,
				staff: 0,
				visitor: 0
			}
			if (_.has(me.props.role, item.uuid)) {
				var role = me.props.role[item.uuid]
				i.device = _.contains(role, 'device');
				i.staff = _.contains(role, 'staff');
				i.visitor = _.contains(role, 'visitor');
			}
			data.push(i)
        })

        data = _.sortBy(data, 'name')

        return (
            <div className="col-xs-12 container-fluid">
                <h1>{this.props.title}</h1>
                <Feedback />
                <div className="row">
				<div className='col-xs-12 col-md-4'>

                    <div className='panel panel-default'>
                    <div className='panel-heading'>
                       <h3 className='panel-title'>Allowed network types for role</h3>
                    </div>

                    <div className='panel-body'>
						<form className="form-horizontal">
						  { data.map(function(item) {
							  return (
								<DeviceTypeSelector
									key={item.uuid}
									ref={item.uuid}
									vlan={item.vlan}
									name={item.name}
									device={item.device}
									staff={item.staff}
									visitor={item.visitor}
								/>)
							})
						  }
						</form>
                    </div>
                    <div className='panel-footer'>
                        <div className="row">
                            <div className="col-xs-6">
                                <button className='btn btn-primary'
                                        onClick={this.save}>Save</button>
                            </div>
                            <div className="col-xs-6 text-right">
                            </div>
                        </div>
                    </div>
                </div>
			</div>
          </div>
        </div>
    )
  }
});



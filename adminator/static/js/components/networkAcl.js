'use strict';

var DeviceTypeSelector = React.createClass({
	displayName: 'DeviceTypeSelector',

	types: ['device', 'staff', 'visitor'],

	getState: function getState() {
		return _.invert(this.state, true)[1] || [];
	},

	handleChange: function handleChange(evt) {
		var v = {};
		v[evt.target.value] = +evt.target.checked;
		this.setState(v);
	},

	getInitialState: function getInitialState() {
		return { device: +this.props.device,
			staff: +this.props.staff,
			visitor: +this.props.visitor };
	},

	render: function render() {
		var _this = this;

		return React.createElement(
			'div',
			{ className: 'form-group', key: this.props.name },
			React.createElement(
				'label',
				{ className: 'col-sm-6 control-label' },
				this.props.name,
				' (',
				this.props.vlan,
				')'
			),
			React.createElement(
				'div',
				{ className: 'col-sm-6' },
				this.types.map(function (item) {
					return React.createElement(
						'label',
						{ className: 'checkbox-inline', key: item },
						React.createElement('input', { type: 'checkbox',
							value: item,
							onChange: _this.handleChange,
							checked: _this.state[item] }),
						' ',
						item
					);
				})
			)
		);
	}

});

var NetworkAcl = React.createClass({
	displayName: 'NetworkAcl',

	mixins: [Reflux.connect(networkStore, 'networks')],

	componentDidMount: function componentDidMount() {
		NetworkActions.list();
	},

	save: function save() {
		var _this2 = this;

		var data = _.filter(_.map(this.state.networks.list, function (item) {
			var types = _this2.refs[item.uuid].getState();
			if (types.length > 0) {
				return {
					'network': item.uuid,
					'device_types': types
				};
			}
		}));
		this.props.save_handler(data);
	},

	getInitialState: function getInitialState() {
		return { 'networks': { list: [] },
			'role': {} };
	},

	render: function render() {

		var data = [];
		var me = this;

		_.map(this.state.networks.list, function (item) {
			var i = {
				uuid: item.uuid,
				name: item.description,
				vlan: item.vlan,
				device: 0,
				staff: 0,
				visitor: 0
			};
			if (_.has(me.props.role, item.uuid)) {
				var role = me.props.role[item.uuid];
				i.device = _.contains(role, 'device');
				i.staff = _.contains(role, 'staff');
				i.visitor = _.contains(role, 'visitor');
			}
			data.push(i);
		});

		data = _.sortBy(data, 'name');

		return React.createElement(
			'div',
			{ className: 'col-xs-12 container-fluid' },
			React.createElement(
				'h1',
				null,
				this.props.title
			),
			React.createElement(Feedback, null),
			React.createElement(
				'div',
				{ className: 'row' },
				React.createElement(
					'div',
					{ className: 'col-xs-12 col-md-4' },
					React.createElement(
						'div',
						{ className: 'panel panel-default' },
						React.createElement(
							'div',
							{ className: 'panel-heading' },
							React.createElement(
								'h3',
								{ className: 'panel-title' },
								'Allowed network types for role'
							)
						),
						React.createElement(
							'div',
							{ className: 'panel-body' },
							React.createElement(
								'form',
								{ className: 'form-horizontal' },
								data.map(function (item) {
									return React.createElement(DeviceTypeSelector, {
										key: item.uuid,
										ref: item.uuid,
										vlan: item.vlan,
										name: item.name,
										device: item.device,
										staff: item.staff,
										visitor: item.visitor
									});
								})
							)
						),
						React.createElement(
							'div',
							{ className: 'panel-footer' },
							React.createElement(
								'div',
								{ className: 'row' },
								React.createElement(
									'div',
									{ className: 'col-xs-6' },
									React.createElement(
										'button',
										{ className: 'btn btn-primary',
											onClick: this.save },
										'Save'
									)
								),
								React.createElement('div', { className: 'col-xs-6 text-right' })
							)
						)
					)
				)
			)
		);
	}
});
'use strict';

var InterfaceForm = React.createClass({
  displayName: 'InterfaceForm',

  mixins: [Reflux.connect(interfaceStore, 'data')],

  componentDidMount: function componentDidMount() {
    var uuid = this.props.item.uuid;

    InterfaceActions.read(uuid);
  },

  getInitialState: function getInitialState() {
    return { data: { 'interface': {} } };
  },

  render: function render() {
    return React.createElement(
      'div',
      { className: 'well' },
      React.createElement(Input, {
        type: 'text',
        label: 'MAC',
        value: this.props.item.macaddr,
        onChange: this.handleChange }),
      React.createElement(Input, {
        type: 'text',
        label: 'Hostname',
        value: this.props.item.hostname,
        onChange: this.handleChange }),
      React.createElement(Input, {
        type: 'text',
        label: 'IPv4 address',
        value: this.props.item.ip4addr,
        onChange: this.handleChange }),
      React.createElement(Input, {
        type: 'text',
        label: 'IPv6 address',
        value: this.props.item.ip6addr,
        onChange: this.handleChange }),
      React.createElement(
        Input,
        {
          type: 'select',
          label: 'Network',
          ref: 'network',
          value: this.props.item.network,
          onChange: this.handleChange },
        this.props.networks.list.map(function (network) {
          return React.createElement(
            'option',
            { value: network.uuid },
            network.description,
            ' (VLAN ',
            network.vlan,
            ')'
          );
        })
      )
    );
  }
});

var DeviceDetail = React.createClass({
  displayName: 'DeviceDetail',

  mixins: [Reflux.connect(deviceStore, 'data'), Reflux.connect(networkStore, 'networks')],

  componentDidMount: function componentDidMount() {
    var id = this.props.params.id;

    DeviceActions.read(id);
    NetworkActions.list();
  },

  getInitialState: function getInitialState() {
    return { data: { device: { interfaces: [] } }, networks: { list: [] }, alerts: [] };
  },

  render: function render() {
    var _this = this;

    return React.createElement(
      'div',
      null,
      React.createElement(AlertSet, { alerts: this.state.alerts }),
      React.createElement(AdminNavbar, null),
      React.createElement(
        'div',
        { className: 'col-sm-6 col-xs-12' },
        React.createElement(
          'h3',
          null,
          'Details'
        ),
        React.createElement(
          'div',
          { className: 'well' },
          React.createElement(Input, {
            type: 'text',
            label: 'Description',
            onChange: this.handleChange,
            value: this.state.data.device.description }),
          React.createElement(Input, {
            type: 'text',
            label: 'Type',
            onChange: this.handleChange,
            value: this.state.data.device.type }),
          React.createElement(Input, {
            type: 'text',
            label: 'User',
            onChange: this.handleChange,
            value: this.state.data.device.user }),
          React.createElement(Input, {
            type: 'text',
            label: 'Valid',
            onChange: this.handleChange,
            value: this.state.data.device.valid })
        )
      ),
      React.createElement(
        'div',
        { className: 'col-sm-6 col-xs-12' },
        React.createElement(
          'h3',
          null,
          'Interfaces'
        ),
        this.state.data.device.interfaces.map(function (item) {
          return React.createElement(InterfaceForm, { networks: _this.state.networks, item: item });
        })
      )
    );
  }
});
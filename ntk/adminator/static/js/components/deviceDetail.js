'use strict';

var DateRangePicker = React.createClass({
  displayName: 'DateRangePicker',

  componentWillReceiveProps: function componentWillReceiveProps() {
    if (this.props.range) {
      this.setState({ range: this.props.range });
    }
  },

  handleValidSince: function handleValidSince(since) {
    this.state.range[0] = since;
    this.setState({ range: this.state.range });
  },

  handleValidUntil: function handleValidUntil(until) {
    this.state.range[1] = until;
    this.setState({ range: this.state.range });
  },

  getInitialState: function getInitialState() {
    return { range: [moment().format('YYYY-MM-DDTHH:mm:ss'), moment().add(1, 'y').format('YYYY-MM-DDTHH:mm:ss')] };
  },

  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'form-group' },
        React.createElement(
          'label',
          { className: 'control-label col-xs-2' },
          'Not before'
        ),
        React.createElement(
          'div',
          { className: 'col-xs-10' },
          React.createElement(DateTimeField, {
            ref: 'valid_since',
            format: 'YYYY-MM-DDTHH:mm:ss',
            inputFormat: 'DD.MM.YYYY HH:mm',
            maxDate: moment(this.state.range[1]),
            onChange: this.handleValidSince,
            dateTime: this.state.range[0] })
        )
      ),
      React.createElement(
        'div',
        { className: 'form-group' },
        React.createElement(
          'label',
          { className: 'control-label col-xs-2' },
          'Not after'
        ),
        React.createElement(
          'div',
          { className: 'col-xs-10' },
          React.createElement(DateTimeField, {
            ref: 'valid_until',
            onChange: this.handleValidUntil,
            format: 'YYYY-MM-DDTHH:mm:ss',
            inputFormat: 'DD.MM.YYYY HH:mm',
            minDate: moment(this.state.range[0]),
            dateTime: this.state.range[1] })
        )
      )
    );
  }
});

var InterfaceForm = React.createClass({
  displayName: 'InterfaceForm',

  mixins: [Reflux.connect(interfaceStore, 'data')],

  componentDidMount: function componentDidMount() {
    var uuid = this.props.item.uuid;

    this.setState({ item: this.props.item });
  },

  getInitialState: function getInitialState() {
    return { item: { macaddr: '', hostname: '', ip4addr: '', ip6addr: '', network: '' } };
  },

  handleChangeNetwork: function handleChangeNetwork(event) {
    this.state.item.network = event.target.value;
    this.setState({ item: this.state.item });
  },

  handleChange: function handleChange() {
    for (var key in this.refs) {
      this.state.item[key] = this.refs[key].getValue();
    }
    this.setState({ item: this.state.item });
  },

  render: function render() {
    return React.createElement(
      'div',
      { className: 'form-horizontal' },
      React.createElement(Input, {
        type: 'text',
        label: 'MAC',
        ref: 'macaddr',
        labelClassName: 'col-xs-2',
        wrapperClassName: 'col-xs-10',
        value: this.state.item.macaddr,
        onChange: this.handleChange }),
      React.createElement(Input, {
        type: 'text',
        label: 'Hostname',
        labelClassName: 'col-xs-2',
        wrapperClassName: 'col-xs-10',
        ref: 'hostname',
        value: this.state.item.hostname,
        onChange: this.handleChange }),
      React.createElement(Input, {
        type: 'text',
        label: 'IPv4 address',
        labelClassName: 'col-xs-2',
        wrapperClassName: 'col-xs-10',
        ref: 'ip4addr',
        value: this.state.item.ip4addr,
        onChange: this.handleChange }),
      React.createElement(Input, {
        type: 'text',
        label: 'IPv6 address',
        labelClassName: 'col-xs-2',
        wrapperClassName: 'col-xs-10',
        ref: 'ip6addr',
        value: this.state.item.ip6addr,
        onChange: this.handleChange }),
      React.createElement(
        BootstrapSelect,
        {
          label: 'Network',
          labelClassName: 'col-xs-2',
          wrapperClassName: 'col-xs-10',
          ref: 'network',
          value: this.state.item.network,
          onChange: this.handleChangeNetwork },
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

  mixins: [Reflux.connect(deviceStore, 'data'), Reflux.connect(networkStore, 'networks'), Reflux.connect(userStore, 'users')],

  componentDidMount: function componentDidMount() {
    var id = this.props.params.id;

    DeviceActions.read(id);
    NetworkActions.list();
    UserActions.list();
  },

  getInitialState: function getInitialState() {
    return {
      data: {
        device: {
          interfaces: [],
          valid: null,
          type: 'visitor'
        }
      },
      networks: {
        list: []
      },
      users: {
        list: []
      },
      createInterfaces: [],
      deleteInterfaces: [],
      alerts: []
    };
  },

  addInterface: function addInterface(event) {
    var newState = this.state.createInterfaces.concat([{ 'device': this.state.data.device.uuid }]);
    this.setState({ createInterfaces: newState });
  },

  removeInterface: function removeInterface(item) {
    var newInterfaces = this.state.data.device.interfaces.filter(function (el) {
      return el.uuid !== item.uuid;
    });
    this.state.data.device.interfaces = newInterfaces;
    this.state.deleteInterfaces = this.state.deleteInterfaces.concat([item.uuid]);
    this.setState({
      deleteInterfaces: this.state.deleteInterfaces,
      data: this.state.data
    });
  },

  removeInterfaceToAdd: function removeInterfaceToAdd(key) {
    this.state.createInterfaces.splice(key - 1, 1);
    this.setState({ createInterfaces: this.state.createInterfaces });
  },

  handleUpdate: function handleUpdate() {

    DeviceActions.update(_.compact(this.state.data.device));

    this.state.data.device.interfaces.map(function (item) {
      InterfaceActions.update(_.compact(item));
    });

    this.state.createInterfaces.map(function (item) {
      InterfaceActions.create(_.compact(item));
    });

    this.state.deleteInterfaces.map(function (item) {
      InterfaceActions['delete'](_.compact(item));
    });
  },

  handleSave: function handleSave() {
    this.setState({ alerts: this.state.alerts.concat([new SuccessAlert('Device updated')]) });
    this.handleUpdate();
    // TODO Handle create
  },

  handleChangeType: function handleChangeType(event) {
    this.state.data.device.type = event.target.value;
    this.setState({ data: { device: this.state.data.device } });
  },

  handleChangeUser: function handleChangeUser(event) {
    this.state.data.device.user = event.target.value;
    this.setState({ data: { device: this.state.data.device } });
  },

  handleChangeDescription: function handleChangeDescription(event) {
    this.state.data.device.description = event.target.value;
    this.setState({ data: { device: this.state.data.device } });
  },

  getDisplayOption: function getDisplayOption(option, index) {
    return option.display_name;
  },

  setUser: function setUser(value) {
    this.state.data.device.user = value.cn;
    // TODO Remove this
    this.forceUpdate();
  },

  getUser: function getUser(cn) {
    return this.state.users.list.filter(function (el) {
      return el.cn == cn;
    });
  },

  render: function render() {
    var _this = this;

    var display_name = (this.getUser(this.state.data.device.user)[0] || { 'display_name': '' }).display_name;
    if (this.state.data.device.type == 'staff') {
      this.state.data.device.valid = null;
    } else if (this.state.data.device.type == 'device') {
      this.state.data.device.user = null;
      this.state.data.device.valid = null;
    } else if (this.state.data.device.type == 'visitor') {
      this.state.data.device.user = null;
    }

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
          { className: 'well form-horizontal' },
          React.createElement(Input, {
            type: 'text',
            labelClassName: 'col-xs-2',
            wrapperClassName: 'col-xs-10',
            ref: 'description',
            label: 'Description',
            onChange: this.handleChangeDescription,
            value: this.state.data.device.description }),
          React.createElement(
            BootstrapSelect,
            {
              labelClassName: 'col-xs-2',
              wrapperClassName: 'col-xs-10',
              ref: 'type',
              label: 'Type',
              onChange: this.handleChangeType,
              value: this.state.data.device.type },
            React.createElement(
              'option',
              { value: 'visitor' },
              'Visitor'
            ),
            React.createElement(
              'option',
              { value: 'staff' },
              'Staff'
            ),
            React.createElement(
              'option',
              { value: 'device' },
              'Device'
            )
          ),
          (function () {
            if (_this.state.data.device.type == 'staff') {
              return React.createElement(
                BootstrapSelect,
                {
                  labelClassName: 'col-xs-2',
                  wrapperClassName: 'col-xs-10',
                  label: 'User',
                  onChange: _this.handleChangeUser,
                  'data-live-search': 'true',
                  value: _this.state.data.device.user
                },
                _this.state.users.list.map(function (item) {
                  return React.createElement(
                    'option',
                    { value: item.cn },
                    item.display_name
                  );
                })
              );
            }
          })(),
          (function () {
            if (_this.state.data.device.type == 'visitor') {
              return React.createElement(DateRangePicker, { range: _this.state.data.device.valid });
            }
          })()
        ),
        React.createElement(
          Button,
          { bsStyle: 'primary', onClick: this.handleSave },
          'Save'
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
          return React.createElement(
            'div',
            { className: 'well' },
            React.createElement(InterfaceForm, { networks: _this.state.networks, item: item }),
            React.createElement(
              Button,
              { bsStyle: 'danger',
                onClick: _this.removeInterface.bind(_this, item), value: item },
              React.createElement('i', { className: 'fa fa-trash-o' })
            )
          );
        }),
        this.state.createInterfaces.map(function (item, key) {
          return React.createElement(
            'div',
            { className: 'well' },
            React.createElement(InterfaceForm, { networks: _this.state.networks, item: item }),
            React.createElement(
              Button,
              { bsStyle: 'danger',
                onClick: _this.removeInterfaceToAdd.bind(_this, key), value: key },
              React.createElement('i', { className: 'fa fa-trash-o' })
            )
          );
        }),
        React.createElement(
          Button,
          { bsStyle: 'success',
            onClick: this.addInterface },
          React.createElement('i', { className: 'fa fa-plus' })
        )
      )
    );
  }
});
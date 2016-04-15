'use strict';

var DateRangePicker = React.createClass({
  displayName: 'DateRangePicker',

  componentWillReceiveProps: function componentWillReceiveProps() {
    if (this.props.range) {
      this.setState({ range: this.props.range });
    }
  },

  componentDidMount: function componentDidMount() {
    this.props.onChange(this.state.range);
  },

  handleValidSince: function handleValidSince(since) {
    this.state.range[0] = since;
    this.setState({ range: this.state.range });
    this.props.onChange(this.state.range);
  },

  handleValidUntil: function handleValidUntil(until) {
    this.state.range[1] = until;
    this.setState({ range: this.state.range });
    this.props.onChange(this.state.range);
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

    // Default value for select
    if (_.isUndefined(this.props.item.network)) {
      this.props.item.network = _.first(this.props.networks.list).uuid;
    }
    this.setState({ item: this.props.item });
  },

  getInitialState: function getInitialState() {
    return { item: { macaddr: '', hostname: '', ip4addr: '', ip6addr: '', network: '' } };
  },

  handleChangeNetwork: function handleChangeNetwork(event) {
    this.state.item.network = event.target.value;
    this.setState({ item: this.state.item });
  },

  handleChange: function handleChange(e) {
    this.state.item[e.target.name] = e.target.value;
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
        name: 'macaddr',
        pattern: '^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+$',
        labelClassName: 'col-xs-2',
        wrapperClassName: 'col-xs-10',
        required: true,
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
        placeholder: 'Dynamic',
        ref: 'ip4addr',
        name: 'ip4addr',
        pattern: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
        value: this.state.item.ip4addr,
        onChange: this.handleChange }),
      React.createElement(Input, {
        type: 'text',
        label: 'IPv6 address',
        labelClassName: 'col-xs-2',
        placeholder: 'Dynamic',
        wrapperClassName: 'col-xs-10',
        ref: 'ip6addr',
        name: 'ip6addr',
        pattern: '^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$',
        value: this.state.item.ip6addr,
        onChange: this.handleChange }),
      React.createElement(
        BootstrapSelect,
        {
          label: 'Network',
          labelClassName: 'col-xs-2',
          wrapperClassName: 'col-xs-10',
          ref: 'network',
          name: 'network',
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

  mixins: [Reflux.listenTo(deviceStore, 'handleErrors'), Reflux.listenTo(interfaceStore, 'handleErrors'), Reflux.connect(deviceStore, 'data'), Reflux.connect(networkStore, 'networks'), Reflux.connect(userStore, 'users')],

  handleErrors: function handleErrors(data) {
    var _this = this;

    data.errors.map(function (item) {
      _this.setState({ alerts: _this.state.alerts.concat([new ErrorAlert(item.message.message)]) });
    });
  },

  componentDidMount: function componentDidMount() {
    var id = this.props.params.id;

    if (id != 'new') {
      DeviceActions.read(id);
    }
    NetworkActions.list();
    UserActions.list();
  },

  componentWillUnmount: function componentWillUnmount() {
    this.state.deleteInterfaces = [];
    this.state.createInterfaces = [];
  },

  getInitialState: function getInitialState() {
    return {
      data: {
        device: {
          interfaces: [],
          valid: [],
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
      alerts: [],
      canSubmit: false
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
    DeviceActions.update(this.state.data.device);

    this.state.data.device.interfaces.map(function (item) {
      InterfaceActions.update(_.compact(item));
    });

    this.state.createInterfaces.map(function (item) {
      InterfaceActions.create(_.compact(item));
    });

    this.state.deleteInterfaces.map(function (item) {
      InterfaceActions['delete'](_.compact(item));
    });
    this.setState({ alerts: this.state.alerts.concat([new SuccessAlert('Device updated')]) });
  },

  handleCreate: function handleCreate() {
    var _this2 = this;

    // Create device
    DeviceActions.create(_.compact(this.state.data.device));
    // Attach interfaces
    deviceStore.listen(function (device) {
      _this2.state.createInterfaces.map(function (item) {
        item.device = device.device.uuid;
        InterfaceActions.create(_.compact(item));
      });
    });
    this.setState({ alerts: this.state.alerts.concat([new SuccessAlert('Device created')]) });
  },

  handleSave: function handleSave(e) {
    e.preventDefault();
    if (this.state.data.device.uuid) {
      this.handleUpdate();
    } else {
      this.handleCreate();
    }
  },

  handleChangeType: function handleChangeType(event) {
    this.state.data.device.type = event.target.value;

    if (this.state.data.device.type == 'staff') {
      this.state.data.device.valid = [];
      this.state.data.device.user = _.first(this.state.users.list).cn;
    } else if (this.state.data.device.type == 'device') {
      this.state.data.device.user = null;
      this.state.data.device.valid = [];
    } else if (this.state.data.device.type == 'visitor') {
      this.state.data.device.user = null;
    }
    this.setState({ data: { device: this.state.data.device } });
  },

  handleChangeUser: function handleChangeUser(event) {
    this.state.data.device.user = event.target.value;
    this.setState({ data: { device: this.state.data.device } });
  },

  handleChangeValid: function handleChangeValid(range) {
    this.state.data.device.valid = range;
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
    var _this3 = this;

    return React.createElement(
      'div',
      null,
      React.createElement(AdminNavbar, null),
      React.createElement(
        'div',
        { className: 'container-fluid' },
        React.createElement(AlertSet, { alerts: this.state.alerts })
      ),
      React.createElement(
        'form',
        { onSubmit: this.handleSave },
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
              validations: 'minLength:4',
              name: 'description',
              labelClassName: 'col-xs-2',
              wrapperClassName: 'col-xs-10',
              ref: 'description',
              label: 'Description',
              required: true,
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
                defaultValue: 'staff',
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
              if (_this3.state.data.device.type == 'staff') {
                return React.createElement(
                  BootstrapSelect,
                  {
                    labelClassName: 'col-xs-2',
                    wrapperClassName: 'col-xs-10',
                    label: 'User',
                    onChange: _this3.handleChangeUser,
                    'data-live-search': 'true',
                    value: _this3.state.data.device.user
                  },
                  _this3.state.users.list.map(function (item) {
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
              if (_this3.state.data.device.type == 'visitor') {
                return React.createElement(DateRangePicker, { range: _this3.state.data.device.valid, onChange: _this3.handleChangeValid });
              }
            })()
          ),
          React.createElement(
            'button',
            { className: 'btn btn-primary', type: 'submit' },
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
          this.state.data.device.interfaces && this.state.data.device.interfaces.map(function (item) {
            return React.createElement(
              'div',
              { className: 'well' },
              React.createElement(InterfaceForm, { networks: _this3.state.networks, item: item }),
              React.createElement(
                Button,
                { bsStyle: 'danger',
                  onClick: _this3.removeInterface.bind(_this3, item), value: item },
                React.createElement('i', { className: 'fa fa-trash-o' })
              )
            );
          }),
          this.state.createInterfaces.map(function (item, key) {
            return React.createElement(
              'div',
              { className: 'well' },
              React.createElement(InterfaceForm, { networks: _this3.state.networks, item: item }),
              React.createElement(
                Button,
                { bsStyle: 'danger',
                  onClick: _this3.removeInterfaceToAdd.bind(_this3, key), value: key },
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
      )
    );
  }
});
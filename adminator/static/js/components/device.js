'use strict';

var Device = React.createClass({
    displayName: 'Device',

    mixins: [Reflux.connect(networkStore, 'networks'), Reflux.connect(userStore, 'users'), ModalConfirmMixin],

    componentDidMount: function componentDidMount() {
        UserInfoStore.listen(this.setUserConstraints);
        NetworkActions.list();
        UserActions.list();
    },

    setUserConstraints: function setUserConstraints(data) {
        if (this.state.device.type == null) {
            var perms = _.keys(UserInfoStore.getDeviceTypePermissions());
            this.setState({ device: { type: perms[0] } });
        }
    },

    getInitialState: function getInitialState() {
        var perms = _.keys(UserInfoStore.getDeviceTypePermissions());
        return { networks: {}, users: {}, device: { type: perms[0] } };
    },

    componentWillReceiveProps: function componentWillReceiveProps(p) {
        if (this.state.device.uuid !== true) {
            p = _.omit(p, ['device']);
        }
        this.setState(p);
    },

    addInterface: function addInterface() {
        this.refs.interfaceList.addInterface();
    },

    validate: function validate() {
        var r = [];
        r = r.concat(this.refs.device.validate());
        r = r.concat(this.refs.interfaceList.validate());
        return r.filter(function (item) {
            return notEmpty(item);
        });
    },

    getValues: function getValues() {
        var data = this.refs.device.getValues();
        data.interfaces = this.refs.interfaceList.getValues();

        return data;
    },

    save: function save() {
        var errors = this.validate();

        if (errors.length > 0) {
            FeedbackActions.set('error', 'Form contains invalid data:', errors);
        } else {
            this.props.saveHandler(this.getValues());
        }
    },

    'delete': function _delete() {
        var uuid = this.props.device.uuid;
        this.modalConfirm('Confirm delete', 'Delete ' + this.props.device.description + '?', { 'confirmLabel': 'DELETE', 'confirmClass': 'danger' }).then(function () {
            DeviceActions['delete'](uuid);
        });
    },

    getDeleteLink: function getDeleteLink() {
        if (this.props.device.uuid !== true) {
            return React.createElement(
                'button',
                { type: 'button', className: 'btn btn-link', onClick: this['delete'] },
                React.createElement(
                    'span',
                    { className: 'text-danger' },
                    React.createElement('span', { className: 'pficon pficon-delete' }),
                    ' Delete this device'
                )
            );
        }
    },

    getAllowedTypes: function getAllowedTypes() {
        var perms = UserInfoStore.getDeviceTypePermissions();
        if (perms == null) {
            return ['staff', 'visitor', 'device'];
        } else {
            return _.keys(UserInfoStore.getDeviceTypePermissions());
        }
    },

    getAllowedNetworks: function getAllowedNetworks() {
        var permissions = UserInfoStore.getDeviceTypePermissions();
        if (permissions == null) {
            return this.state.networks.list;
        }

        var allowedNetworks = permissions[this.state.device.type];
        return _.filter(this.state.networks.list, function (item) {
            return _.includes(allowedNetworks, item.uuid);
        });
    },

    handleTypeChange: function handleTypeChange(value) {
        this.setState({ device: { 'type': value } });
    },

    render: function render() {
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
                    { className: 'col-xs-12 col-md-6' },
                    React.createElement(
                        'div',
                        { className: 'panel panel-default' },
                        React.createElement(
                            'div',
                            { className: 'panel-heading' },
                            React.createElement(
                                'h3',
                                { className: 'panel-title' },
                                'Device'
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'panel-body' },
                            React.createElement(DeviceForm, { device: this.state.device,
                                users: this.state.users.list,
                                allowedTypes: this.getAllowedTypes(),
                                typeChangeHandler: this.handleTypeChange,
                                ref: 'device' })
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
                                React.createElement(
                                    'div',
                                    { className: 'col-xs-6 text-right' },
                                    this.getDeleteLink()
                                )
                            )
                        )
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'col-xs-12 col-md-6' },
                    React.createElement(
                        'div',
                        { className: 'panel panel-default' },
                        React.createElement(
                            'div',
                            { className: 'panel-heading' },
                            React.createElement(
                                'h3',
                                { className: 'panel-title' },
                                'Interfaces'
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'panel-body' },
                            React.createElement(DeviceInterfaceList, { networks: this.getAllowedNetworks(),
                                interfaces: this.props.device.interfaces,
                                ref: 'interfaceList' })
                        ),
                        React.createElement(
                            'div',
                            { className: 'panel-footer' },
                            React.createElement(
                                'a',
                                { onClick: this.addInterface },
                                React.createElement('span', { className: 'pficon pficon-add-circle-o' }),
                                ' Add new interface'
                            )
                        )
                    )
                )
            )
        );
    }
});
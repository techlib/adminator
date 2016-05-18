'use strict';

var DeviceDetail = React.createClass({
    displayName: 'DeviceDetail',

    mixins: [Reflux.connect(deviceStore, 'data'), Reflux.connect(networkStore, 'networks'), Reflux.connect(userStore, 'users')],

    componentDidMount: function componentDidMount() {
        DeviceActions.read(this.props.params.id);
        NetworkActions.list();
        UserActions.list();
    },

    getInitialState: function getInitialState() {
        return {
            data: {},
            networks: { list: [] },
            users: { list: [] },
            deleteInterfaces: []
        };
    },

    handleSave: function handleSave() {
        console.log('MOOO');
    },

    render: function render() {
        var _this = this;

        return React.createElement(
            'div',
            null,
            React.createElement(AdminNavbar, null),
            React.createElement(
                'div',
                { className: 'container-fluid' },
                React.createElement(Feedback, null)
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
                            'Device'
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'panel-body' },
                        React.createElement(DeviceForm, null)
                    ),
                    React.createElement(
                        'div',
                        { className: 'panel-footer' },
                        React.createElement(
                            'button',
                            { className: 'btn btn-primary' },
                            'Save'
                        )
                    )
                )
            ),
            React.createElement(
                'div',
                { className: 'col-xs-12-col-md-6' },
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
                            this.state.devices['interface'].map(function (item) {
                                return React.createElement(DeviceInterface, { item: item,
                                    networks: _this.state.networks.list });
                            })
                        ),
                        React.createElement(
                            'div',
                            { className: 'panel-footer' },
                            React.createElement(
                                'button',
                                { className: 'btn btn-success' },
                                'Add'
                            )
                        )
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
                            React.createElement(DeviceInterface, { networks: _this.state.networks, item: item }),
                            React.createElement(
                                Button,
                                { bsStyle: 'danger',
                                    onClick: _this.removeInterface.bind(_this, item), value: item },
                                React.createElement('i', { className: 'fa fa-trash-o' })
                            )
                        );
                    })
                )
            )
        );
    }
});
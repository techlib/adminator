'use strict';

var Device = React.createClass({
    displayName: 'Device',

    mixins: [Reflux.connect(networkStore, 'networks'), Reflux.connect(userStore, 'users')],

    componentDidMount: function componentDidMount() {
        NetworkActions.list();
        UserActions.list();
    },

    getInitialState: function getInitialState() {
        return { networks: {}, users: {} };
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
                            React.createElement(DeviceForm, { device: this.props.device,
                                users: this.state.users.list,
                                ref: 'device' })
                        ),
                        React.createElement(
                            'div',
                            { className: 'panel-footer' },
                            React.createElement(
                                'button',
                                { className: 'btn btn-primary',
                                    onClick: this.save },
                                'Save'
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
                            React.createElement(DeviceInterfaceList, { networks: this.state.networks.list,
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
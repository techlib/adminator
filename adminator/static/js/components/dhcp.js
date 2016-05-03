'use strict';

var Dhcp = React.createClass({
    displayName: 'Dhcp',

    mixins: [Reflux.connect(dhcpOptionsStore, 'options'), Reflux.connect(dhcpValuesStore, 'values')],

    componentDidMount: function componentDidMount() {
        DhcpOptionActions.list();
        DhcpValuesActions.listGlobal();
    },

    getInitialState: function getInitialState() {
        return { options: [], values: { result: [] } };
    },

    save: function save() {
        var dhcp = this.refs['dhcp'];
        var dhcp6 = this.refs['dhcp6'];

        var errors = [];
        errors = errors.concat(dhcp.validate());
        errors = errors.concat(dhcp6.validate());

        if (errors.length > 0) {
            FeedbackActions.set('error', 'Form contains invalid data', errors);
        } else {
            var data = dhcp.getValues().concat(dhcp6.getValues());
            DhcpValuesActions.saveGlobal(data);
        }
    },

    render: function render() {
        var values = sortDhcpValues(this.state.values, this.state.options);
        var options = sortDhcpOptions(this.state.options);

        return React.createElement(
            'div',
            null,
            React.createElement(AdminNavbar, null),
            React.createElement(
                'div',
                { className: 'col-xs-12 container' },
                React.createElement(
                    'h3',
                    null,
                    'Global DHPC options'
                ),
                React.createElement(Feedback, null),
                React.createElement(
                    'div',
                    { className: 'row' },
                    React.createElement(
                        'div',
                        { className: 'col-xs-12 col-md-6' },
                        React.createElement(DhcpOptionValues, { ref: 'dhcp',
                            values: values.inet,
                            options: options.inet,
                            title: 'DHCPv4' })
                    ),
                    React.createElement(
                        'div',
                        { className: 'col-xs-12 col-md-6' },
                        React.createElement(DhcpOptionValues, { ref: 'dhcp6',
                            values: values.inet6,
                            options: options.inet6,
                            title: 'DHCPv6' })
                    )
                ),
                React.createElement(
                    'button',
                    { className: 'btn btn-primary',
                        onClick: this.save },
                    'Save'
                )
            )
        );
    }
});
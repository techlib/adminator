'use strict';

var Network = React.createClass({
    displayName: 'Network',

    mixins: [Reflux.connect(dhcpOptionsStore, 'options')],

    componentDidMount: function componentDidMount() {
        DhcpOptionActions.list();
    },

    save: function save() {
        var errors = [];

        var net = this.refs.network;
        var dhcp = this.refs.dhcp_options;
        var dhcp6 = this.refs.dhcp_options6;
        var pools = this.refs.pools;

        errors = errors.concat(net.validate());
        errors = errors.concat(dhcp.validate());
        errors = errors.concat(dhcp6.validate());
        errors = errors.concat(pools.validate());

        if (errors.length > 0) {
            FeedbackActions.set('error', 'Form contains invalid data', errors);
        } else {
            var data = net.getValues();
            data['dhcp_options'] = dhcp.getValues().concat(dhcp6.getValues());
            data['pools'] = pools.getValues();
            this.props.save_handler(data);
        }
    },

    getInitialState: function getInitialState() {
        return { 'network': {
                'dhcp_options': [],
                'pools': [] },
            'options': [] };
    },

    componentWillReceiveProps: function componentWillReceiveProps(p) {
        if (p) {
            this.setState({ 'network': p.network_data });
        }
    },

    render: function render() {
        var values = sortDhcpValues(this.state.network.dhcp_options, this.state.options);
        var options = sortDhcpOptions(this.state.options);

        return React.createElement(
            'div',
            null,
            React.createElement(AdminNavbar, null),
            React.createElement(
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
                        React.createElement(NetworkForm, { ref: 'network',
                            values: this.state.network,
                            saveHandler: this.save })
                    ),
                    React.createElement(
                        'div',
                        { className: 'col-xs-12 col-md-4' },
                        React.createElement(IPPools, { ref: 'pools',
                            values: this.state.network.pools,
                            network: this.state.network.uuid })
                    ),
                    React.createElement(
                        'div',
                        { className: 'col-xs-12 col-md-4' },
                        React.createElement(DhcpOptionValues, { ref: 'dhcp_options',
                            values: values.inet,
                            options: options.inet,
                            title: 'DHCP options' }),
                        React.createElement(DhcpOptionValues, { ref: 'dhcp_options6',
                            values: values.inet6,
                            options: options.inet6,
                            title: 'DHCP options v6' })
                    )
                )
            )
        );
    }
});
'use strict';

var Network = React.createClass({
    displayName: 'Network',

    mixins: [Reflux.connect(dhcpOptionsStore, 'options')],

    componentDidMount: function componentDidMount() {
        DhcpOptionActions.list();
    },

    validateData: function validateData(data) {
        var errors = [];
        if (!data['description']) {
            errors.push('Description is missing');
        };
        if (!data['vlan']) {
            errors.push('Vlan is missing');
        };
        if (!data['prefix4']) {
            errors.push('IPv4 prefix is missing');
        };
        if (!data['prefix6']) {
            errors.push('IPv6 prefix is missing');
        };
        return errors;
    },

    save: function save() {
        var net = this.refs['network'].getValue();
        var data = {
            uuid: this.state.network['uuid'],
            vlan: net['vlan'],
            description: net['description'],
            max_lease: net['max_lease'],
            prefix4: net['prefix4'],
            prefix6: net['prefix6'],
            dhcp_options: this.refs.dhcp_options.getValues(),
            pools: this.refs.pools.getValues()
        };
        // validate here
        this.props.save_handler(data);
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
        return React.createElement(
            'div',
            null,
            React.createElement(AdminNavbar, null),
            React.createElement(
                'div',
                { className: 'col-xs-12 container' },
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
                            values: this.state.network.dhcp_options,
                            options: this.state.options })
                    )
                )
            )
        );
    }
});
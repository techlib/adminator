'use strict';

var NetworkEdit = React.createClass({
    displayName: 'NetworkEdit',

    mixins: [Reflux.connect(networkStore, 'data'), Reflux.connect(dhcpOptionsStore, 'options')],

    componentDidMount: function componentDidMount() {
        NetworkActions.read(this.props.params.id);
        DhcpOptionActions.list();
    },

    getInitialState: function getInitialState() {
        this.state = { 'data': { 'network': { 'dhcp_options': [] } }, 'options': [] };
        return this.state;
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
                    this.state.data.network.description
                ),
                React.createElement(
                    'div',
                    { className: 'row' },
                    React.createElement(
                        'div',
                        { className: 'col-xs-12 col-md-4' },
                        React.createElement(
                            'h2',
                            null,
                            'Basic settings'
                        ),
                        React.createElement(
                            'div',
                            { className: 'well' },
                            React.createElement(NetworkEditForm, { values: this.state.data.network })
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'col-xs-12 col-md-4' },
                        React.createElement(
                            'h2',
                            null,
                            'DHCP options'
                        ),
                        React.createElement(DhcpOptionValues, { values: this.state.data.network.dhcp_options,
                            options: this.state.options,
                            network: this.state.data.network.uuid })
                    ),
                    React.createElement(
                        'div',
                        { className: 'col-xs-12 col-md-4' },
                        React.createElement(
                            'h2',
                            null,
                            'IP pools'
                        ),
                        React.createElement(IPPools, { values: this.state.data.network.pools,
                            network: this.state.data.network.uuid })
                    )
                )
            )
        );
    }
});
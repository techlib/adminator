'use strict';

var AdminNavbar = React.createClass({
    displayName: 'AdminNavbar',

    mixins: [Reflux.connect(UserInfoStore, 'user')],

    getInitialState: function getInitialState() {
        return { user: {} };
    },

    getAvailableLinks: function getAvailableLinks() {
        var res = [];

        if (UserInfoStore.isAllowed('device')) {
            res.push(React.createElement(
                LinkContainer,
                { to: '/device/', key: 'device' },
                React.createElement(
                    NavItem,
                    { eventKey: 2 },
                    'Devices'
                )
            ));
        }

        if (UserInfoStore.isAllowed('network')) {
            res.push(React.createElement(
                LinkContainer,
                { to: '/network/', key: 'network' },
                React.createElement(
                    NavItem,
                    { eventKey: 2 },
                    'Networks'
                )
            ));
        }

        if (UserInfoStore.isAllowed('dns')) {
            res.push(React.createElement(
                LinkContainer,
                { to: '/domain/', key: 'domain' },
                React.createElement(
                    NavItem,
                    { eventKey: 2 },
                    'Domains'
                )
            ));
        }

        if (UserInfoStore.isAllowed('dns')) {
            res.push(React.createElement(
                LinkContainer,
                { to: '/record/', key: 'record' },
                React.createElement(
                    NavItem,
                    { eventKey: 2 },
                    'Records'
                )
            ));
        }

        if (UserInfoStore.isAllowed('lease')) {
            res.push(React.createElement(
                LinkContainer,
                { to: '/lease/', key: 'lease' },
                React.createElement(
                    NavItem,
                    { eventKey: 2 },
                    'Leases'
                )
            ));
        }

        return res;
    },

    render: function render() {
        return React.createElement(
            'div',
            { className: 'navbar navbar-pf' },
            React.createElement(
                Navbar.Header,
                null,
                React.createElement(
                    Navbar.Brand,
                    null,
                    React.createElement(
                        'b',
                        null,
                        'ADMINATOR'
                    ),
                    ' Network management'
                )
            ),
            React.createElement(
                Nav,
                { className: 'nav navbar-nav navbar-utility' },
                React.createElement(
                    'li',
                    null,
                    React.createElement(
                        'a',
                        { href: '#' },
                        React.createElement('span', { className: 'pficon pficon-user' }),
                        this.state.user.username
                    )
                )
            ),
            React.createElement(
                Nav,
                { className: 'navbar-nav navbar-primary' },
                this.getAvailableLinks()
            )
        );
    }
});
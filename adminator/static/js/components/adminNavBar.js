'use strict';

var AdminNavbar = React.createClass({
  displayName: 'AdminNavbar',

  mixins: [Reflux.connect(UserInfoStore, 'user')],

  getInitialState: function getInitialState() {
    return { user: {} };
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
          React.createElement('img', { src: '/static/img/brand.svg', alt: 'PatternFly Enterprise Application' })
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
        React.createElement(
          LinkContainer,
          { to: '/device/' },
          React.createElement(
            NavItem,
            { eventKey: 2 },
            'Devices'
          )
        ),
        React.createElement(
          LinkContainer,
          { to: '/network/' },
          React.createElement(
            NavItem,
            { eventKey: 2 },
            'Networks'
          )
        ),
        React.createElement(
          LinkContainer,
          { to: '/domain/' },
          React.createElement(
            NavItem,
            { eventKey: 2 },
            'Domains'
          )
        ),
        React.createElement(
          LinkContainer,
          { to: '/record/' },
          React.createElement(
            NavItem,
            { eventKey: 2 },
            'Records'
          )
        ),
        React.createElement(
          LinkContainer,
          { to: '/lease/' },
          React.createElement(
            NavItem,
            { eventKey: 2 },
            'Leases'
          )
        )
      )
    );
  }
});
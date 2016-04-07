"use strict";

_.mixin({
  compact: function compact(o) {
    var clone = _.clone(o);
    _.each(clone, function (v, k) {
      if (!v) {
        delete clone[k];
      }
    });
    return clone;
  }
});

var AdminNavbar = React.createClass({
  displayName: "AdminNavbar",

  render: function render() {
    return React.createElement(
      "div",
      { className: "navbar navbar-pf" },
      React.createElement(
        Navbar.Header,
        null,
        React.createElement(
          Navbar.Brand,
          null,
          React.createElement("img", { src: "/static/img/brand.svg", alt: "PatternFly Enterprise Application" })
        )
      ),
      React.createElement(
        Nav,
        { className: "navbar-nav navbar-primary" },
        React.createElement(
          LinkContainer,
          { to: "/device/" },
          React.createElement(
            NavItem,
            { eventKey: 2 },
            "Devices"
          )
        ),
        React.createElement(
          LinkContainer,
          { to: "/network/" },
          React.createElement(
            NavItem,
            { eventKey: 2 },
            "Networks"
          )
        ),
        React.createElement(
          LinkContainer,
          { to: "/domain/" },
          React.createElement(
            NavItem,
            { eventKey: 2 },
            "Domains"
          )
        ),
        React.createElement(
          LinkContainer,
          { to: "/record/" },
          React.createElement(
            NavItem,
            { eventKey: 2 },
            "Records"
          )
        )
      )
    );
  }
});
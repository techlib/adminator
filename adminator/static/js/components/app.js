"use strict";

var App = React.createClass({
    displayName: "App",

    render: function render() {
        return React.createElement(
            "div",
            null,
            React.createElement(AdminNavbar, null),
            this.props.children
        );
    }
});
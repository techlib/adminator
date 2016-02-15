"use strict";

var IPPools = React.createClass({
    displayName: "IPPools",

    render: function render() {

        return React.createElement(
            "div",
            { className: "well" },
            React.createElement("input", { type: "text" }),
            React.createElement("input", { type: "text" })
        );
    }

});
"use strict";

var DhcpTypeBool = React.createClass({
    displayName: "DhcpTypeBool",

    render: function render() {
        return React.createElement(
            "div",
            null,
            React.createElement(
                "label",
                { className: "radio-inline" },
                React.createElement("input", { type: "radio", value: "1", name: this.props.id }),
                " True"
            ),
            React.createElement(
                "label",
                { className: "radio-inline" },
                React.createElement("input", { type: "radio", value: "0", name: this.props.id }),
                " False"
            )
        );
    }
});

var DhcpTypeString = React.createClass({
    displayName: "DhcpTypeString",

    render: function render() {
        return React.createElement("input", { type: "text", className: "form-control", onChange: this.props.changeHandler, ref: "val", defaultValue: this.props.value, id: this.props.id });
    }
});

var DhcpTypeEmpty = React.createClass({
    displayName: "DhcpTypeEmpty",

    render: function render() {
        return React.createElement(
            "div",
            { className: "form-control-static" },
            React.createElement(
                "i",
                null,
                "no value"
            )
        );
    }
});

var DhcpTypeInt = React.createClass({
    displayName: "DhcpTypeInt",

    render: function render() {}
});

var DhcpTypeIpv4 = React.createClass({
    displayName: "DhcpTypeIpv4",

    render: function render() {}
});

var DhcpTypeFqdn = React.createClass({
    displayName: "DhcpTypeFqdn",

    render: function render() {}
});

var DhcpTypeBinary = React.createClass({
    displayName: "DhcpTypeBinary",

    render: function render() {}
});

var DhcpTypeRecord = React.createClass({
    displayName: "DhcpTypeRecord",

    render: function render() {}
});

var DhcpTypeNetbios = React.createClass({
    displayName: "DhcpTypeNetbios",

    render: function render() {}
});
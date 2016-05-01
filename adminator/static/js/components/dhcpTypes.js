"use strict";

var createFieldWithPattern = function createFieldWithPattern(pattern) {
    return React.createClass({

        getValue: function getValue() {
            return this.refs[this.props.id].value;
        },

        getInitialState: function getInitialState() {
            return { value: '' };
        },

        render: function render() {
            return React.createElement("input", {
                type: "text",
                className: "form-control",
                ref: this.props.id,
                defaultValue: this.props.value,
                pattern: pattern,
                id: this.props.id });
        }
    });
};

var DhcpTypeString = createFieldWithPattern('.*');
var DhcpTypeInt = createFieldWithPattern('-?[0-9]+');

var DhcpTypeIpv4 = createFieldWithPattern('.*');
var DhcpTypeIpv6 = createFieldWithPattern('.*');
var DhcpTypeFqdn = createFieldWithPattern('.*');
var DhcpTypeBinary = createFieldWithPattern('.*');
var DhcpTypeRecord = createFieldWithPattern('.*');
var DhcpTypeNetbios = createFieldWithPattern('.*');

var DhcpTypeEmpty = React.createClass({
    displayName: "DhcpTypeEmpty",

    getValue: function getValue() {
        return '';
    },
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

var DhcpTypeBool = React.createClass({
    displayName: "DhcpTypeBool",

    getValue: function getValue() {
        return this.refs[this.props.id + '0'].checked;
    },

    getInitialState: function getInitialState() {
        return { value: '' };
    },

    render: function render() {
        return React.createElement(
            "div",
            null,
            React.createElement(
                "label",
                { className: "radio-inline" },
                React.createElement("input", { type: "radio",
                    value: "1",
                    name: this.props.id,
                    ref: this.props.id + '0',
                    onChange: this.handleChange,
                    defaultChecked: this.props.value == 1
                }),
                " True"
            ),
            React.createElement(
                "label",
                { className: "radio-inline" },
                React.createElement("input", { type: "radio",
                    value: "0",
                    name: this.props.id,
                    onChange: this.handleChange,
                    defaultChecked: this.props.value == 0
                }),
                " False"
            )
        );
    }
});
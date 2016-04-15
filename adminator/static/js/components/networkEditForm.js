"use strict";

var NetworkEditForm = React.createClass({
    displayName: "NetworkEditForm",

    render: function render() {
        return React.createElement(
            "div",
            { className: "" },
            React.createElement(
                "form",
                { className: "form-horizontal" },
                React.createElement(
                    "div",
                    { className: "form-group" },
                    React.createElement(
                        "label",
                        { className: "col-sm-3 control-label" },
                        "Name"
                    ),
                    React.createElement(
                        "div",
                        { className: "col-sm-8" },
                        React.createElement(Input, { type: "text", defaultValue: "s" })
                    )
                ),
                React.createElement(
                    "div",
                    { className: "form-group" },
                    React.createElement(
                        "label",
                        { className: "col-sm-3 control-label" },
                        "VLAN"
                    ),
                    React.createElement(
                        "div",
                        { className: "col-sm-2" },
                        React.createElement(Input, { type: "text" })
                    )
                ),
                React.createElement(
                    "div",
                    { className: "form-group" },
                    React.createElement(
                        "label",
                        { className: "col-sm-3 control-label" },
                        "Prefix"
                    ),
                    React.createElement(
                        "div",
                        { className: "col-sm-2" },
                        React.createElement(Input, { type: "text" })
                    )
                ),
                React.createElement(
                    "div",
                    { className: "form-group" },
                    React.createElement(
                        "label",
                        { className: "col-sm-3 control-label" },
                        "Max. lease"
                    ),
                    React.createElement(
                        "div",
                        { className: "col-sm-2" },
                        React.createElement(Input, { type: "text" })
                    )
                )
            )
        );
    }
});
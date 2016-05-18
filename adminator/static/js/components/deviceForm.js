'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var DeviceForm = React.createClass({
    displayName: 'DeviceForm',

    commonProps: {
        labelClassName: 'col-xs-2',
        wrapperClassName: 'col-xs-10'
    },

    componentWillReceiveProps: function componentWillReceiveProps(p) {
        this.setState(p.device);
    },

    getInitialState: function getInitialState() {
        return { type: 'staff', valid: [moment().format('YYYY-MM-DDTHH:mm:ss'), moment().add(1, 'y').format('YYYY-MM-DDTHH:mm:ss')] };
    },

    getDefaultProps: function getDefaultProps() {
        return { users: [] };
    },

    handleChange: function handleChange(evt) {
        var _setState;

        this.setState((_setState = {}, _setState[evt.target.name] = evt.target.value, _setState));
    },

    handleValidChange: function handleValidChange(value) {
        this.setState({ valid: value });
    },

    getValues: function getValues() {
        var data = {
            type: this.state.type,
            description: this.state.description
        };
        if (this.state.type == 'staff') {
            data.description = this.state.description;
            data.user = this.state.user;
        } else if (this.state.type == 'visitor') {
            data.valid = this.state.valid;
        }
        return data;
    },

    validate: function validate() {
        var r = [];
        if (!minLen(this.state.description, 4)) {
            r.push('Description ' + this.state.description + ' is too short (4 chars min)');
        }
        if (this.state.type == 'staff') {
            if (!this.state.user) {
                r.push('User is required');
            }
        } else if (this.state.type == 'visitor') {
            r = r.concat(this.refs.valid.validate());
        }

        return r;
    },

    getUserSelect: function getUserSelect() {
        if (this.state.type == 'staff') {
            return React.createElement(
                BootstrapSelect,
                _extends({
                    label: 'User',
                    ref: 'user',
                    name: 'user',
                    onChange: this.handleChange,
                    'data-live-search': true,
                    value: this.state.user
                }, this.commonProps),
                this.props.users.map(function (item) {
                    return React.createElement(
                        'option',
                        { value: item.cn, key: item.cn },
                        item.display_name
                    );
                })
            );
        }
    },

    getVisitorValidRange: function getVisitorValidRange() {
        if (this.state.type == 'visitor') {
            return React.createElement(DateRangePicker, { range: this.state.valid,
                ref: 'valid',
                name: 'valid',
                onChange: this.handleValidChange });
        }
    },

    render: function render() {
        return React.createElement(
            'div',
            { className: 'form-horizontal' },
            React.createElement(Input, _extends({
                type: 'text',
                label: 'Description',
                ref: 'description',
                name: 'description',
                onChange: this.handleChange,
                value: this.state.description
            }, this.commonProps)),
            React.createElement(
                BootstrapSelect,
                _extends({
                    ref: 'type',
                    name: 'type',
                    label: 'Type',
                    onChange: this.handleChange,
                    defaultValue: 'staff',
                    value: this.state.type
                }, this.commonProps),
                React.createElement(
                    'option',
                    { value: 'visitor' },
                    'Visitor'
                ),
                React.createElement(
                    'option',
                    { value: 'staff' },
                    'Staff'
                ),
                React.createElement(
                    'option',
                    { value: 'device' },
                    'Device'
                )
            ),
            this.getUserSelect(),
            this.getVisitorValidRange()
        );
    }
});
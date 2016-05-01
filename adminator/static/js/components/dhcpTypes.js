'use strict';

var createFieldWithValidator = function createFieldWithValidator(validator) {
    return React.createClass({

        _validate: validator,

        getValue: function getValue() {
            return this.refs[this.props.id].value;
        },

        validate: function validate() {
            var value = this.getValue();

            if (!notEmpty(value)) {
                return this.props.id + ' is empty';
            }

            if (!this._validate(value)) {
                return this.props.id + ' is invalid';
            }

            return true;
        },

        getInitialState: function getInitialState() {
            return { value: '' };
        },

        render: function render() {
            return React.createElement('input', {
                type: 'text',
                className: 'form-control',
                ref: this.props.id,
                defaultValue: this.props.value,
                id: this.props.id });
        }
    });
};

var DhcpTypeString = createFieldWithValidator(notEmpty);
var DhcpTypeInt = createFieldWithValidator(isInt);

var DhcpTypeIpv4 = createFieldWithValidator(isIP4);
var DhcpTypeIpv6 = createFieldWithValidator(isIP6);
var DhcpTypeFqdn = createFieldWithValidator(notEmpty);
var DhcpTypeBinary = createFieldWithValidator(notEmpty);
var DhcpTypeRecord = createFieldWithValidator(notEmpty);
var DhcpTypeNetbios = createFieldWithValidator(notEmpty);

var DhcpTypeEmpty = React.createClass({
    displayName: 'DhcpTypeEmpty',

    getValue: function getValue() {
        return '';
    },
    validate: function validate() {
        return true;
    },
    render: function render() {
        return React.createElement(
            'div',
            { className: 'form-control-static' },
            React.createElement(
                'i',
                null,
                'no value'
            )
        );
    }
});

var DhcpTypeBool = React.createClass({
    displayName: 'DhcpTypeBool',

    getValue: function getValue() {
        return this.refs[this.props.id + '0'].checked;
    },

    getInitialState: function getInitialState() {
        return { value: '' };
    },

    validate: function validate() {
        return this.getValue() !== undefined;
    },

    render: function render() {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'label',
                { className: 'radio-inline' },
                React.createElement('input', { type: 'radio',
                    value: '1',
                    name: this.props.id,
                    ref: this.props.id + '0',
                    onChange: this.handleChange,
                    defaultChecked: this.props.value == 1
                }),
                ' True'
            ),
            React.createElement(
                'label',
                { className: 'radio-inline' },
                React.createElement('input', { type: 'radio',
                    value: '0',
                    name: this.props.id,
                    onChange: this.handleChange,
                    defaultChecked: this.props.value == 0
                }),
                ' False'
            )
        );
    }
});
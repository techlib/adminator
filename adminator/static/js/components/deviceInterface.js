'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var DeviceInterface = React.createClass({
    displayName: 'DeviceInterface',

    mixins: [Reflux.connect(interfaceStore, 'data')],

    getInitialState: function getInitialState() {
        var res = this.props.item;
        res.network = this.props.networks[0].uuid;
        return res;
    },

    handleChange: function handleChange(evt) {
        var _setState;

        this.setState((_setState = {}, _setState[evt.target.name] = evt.target.value, _setState));
    },

    formatMac: (function (_formatMac) {
        function formatMac() {
            return _formatMac.apply(this, arguments);
        }

        formatMac.toString = function () {
            return _formatMac.toString();
        };

        return formatMac;
    })(function () {
        this.setState({ macaddr: formatMac(this.state.macaddr) });
    }),

    handleDelete: function handleDelete() {
        this.props.deleteHandler(this.props.index);
    },

    getValues: function getValues() {
        var r = this.state;
        delete r.uuid;
        return r;
    },

    validate: function validate() {
        var r = [];
        var mac = formatMac(this.state.macaddr);
        if (!notEmpty(mac)) {
            r.push('Missing mac address');
        }
        if (!isMAC(mac)) {
            r.push('Mac ' + mac + ' address invadlid');
        }
        if (notEmpty(this.state.hostname) && !minLen(this.state.hostname, 4)) {
            r.push('Hostname ' + this.state.hostname + ' is too short (4 chars min)');
        }

        if (this.state.ip4addr && !isIP4(this.state.ip4addr)) {
            r.push(this.state.ip4addr + ' is not valid IPv4 address');
        }

        if (this.state.ip6addr && !isIP6(this.state.ip6addr)) {
            r.push(this.state.ip6addr + ' is not valid IPv6 address');
        }
        return r;
    },

    render: function render() {
        var commonProps = {
            type: 'text',
            labelClassName: 'col-xs-2',
            wrapperClassName: 'col-xs-10',
            onChange: this.handleChange
        };

        var delimiter = null;
        if (this.props.delimiter) {
            var delimiter = React.createElement('hr', null);
        }

        return React.createElement(
            'div',
            { className: 'form-horizontal' },
            React.createElement(Input, _extends({
                label: 'MAC',
                ref: 'macaddr',
                name: 'macaddr',
                value: this.state.macaddr,
                onBlur: this.formatMac
            }, commonProps)),
            React.createElement(Input, _extends({
                label: 'Hostname',
                ref: 'hostname',
                name: 'hostname',
                value: this.state.hostname
            }, commonProps)),
            React.createElement(Input, _extends({
                label: 'IPv4 address',
                ref: 'ip4addr',
                name: 'ip4addr',
                placeholder: 'Dynamic',
                value: this.state.ip4addr
            }, commonProps)),
            React.createElement(Input, _extends({
                label: 'IPv6 address',
                ref: 'ip6addr',
                name: 'ip6addr',
                placeholder: 'Dynamic',
                value: this.state.ip6addr
            }, commonProps)),
            React.createElement(
                BootstrapSelect,
                _extends({
                    updateOnLoad: true,
                    label: 'Network',
                    ref: 'network',
                    name: 'network',
                    'data-live-search': true
                }, commonProps, {
                    value: this.state.network }),
                _.map(this.props.networks, function (item) {
                    return React.createElement(
                        'option',
                        { value: item.uuid, key: item.uuid },
                        item.description,
                        ' (',
                        item.vlan,
                        ')'
                    );
                })
            ),
            React.createElement(
                'div',
                { className: 'form-group' },
                React.createElement(
                    'div',
                    { className: 'col-xs-offset-2 col-xs-10' },
                    React.createElement(
                        Button,
                        {
                            label: '',
                            bsStyle: 'danger',
                            onClick: this.handleDelete },
                        React.createElement('i', { className: 'fa fa-trash-o' }),
                        ' delete'
                    )
                )
            ),
            delimiter
        );
    }
});
'use strict';

var IPPools = React.createClass({
    displayName: 'IPPools',

    c: 0,

    componentWillReceiveProps: function componentWillReceiveProps(p) {
        this.setState(p);
    },

    getInitialState: function getInitialState() {
        return { 'values': [] };
    },

    handleAdd: function handleAdd() {
        this.c++;
        this.state.values.push({ 'range': [], 'uuid': 'new-' + this.c });
        this.setState(this.state);
    },

    handleRemove: function handleRemove(index) {
        var removed = this.state.values.splice(index, 1);
        this.setState(this.state);
    },

    validate: function validate() {
        var _this = this;

        return _.flatten(this.state.values.map(function (item, index) {
            var result = [];

            var ip1 = _this.refs[item.uuid + '-0'].value;
            var ip2 = _this.refs[item.uuid + '-1'].value;

            if (!isIP(ip1)) {
                result.push(ip1 + ' is not valid ip address (pools)');
            }
            if (!isIP(ip2)) {
                result.push(ip2 + ' is not valid ip address (pools)');
            }

            if (result.length != 0) {
                return result;
            }

            if (!isIPSameFamily(ip1, ip2)) {
                result.push(ip1 + ' and ' + ip2 + ' are not the same kind');
                return result;
            }

            return true;
        })).filter(function (item) {
            return item !== true;
        });
    },

    getValues: function getValues() {
        var _this2 = this;

        return this.state.values.map(function (item, index) {
            var result = {
                'range': [_this2.refs[item.uuid + '-0'].value, _this2.refs[item.uuid + '-1'].value]
            };
            if (item.uuid.indexOf('new-') !== 0) {
                result.uuid = item.uuid;
            }
            return result;
        });
    },

    render: function render() {
        var _this3 = this;

        return React.createElement(
            'div',
            { className: 'panel panel-default' },
            React.createElement(
                'div',
                { className: 'panel-heading' },
                React.createElement(
                    'h3',
                    { className: 'panel-title' },
                    'IP pools'
                )
            ),
            React.createElement(
                'div',
                { className: 'panel-body' },
                this.state.values.map(function (item, i) {
                    return React.createElement(
                        'div',
                        { className: 'row array-row', key: item.uuid },
                        React.createElement(
                            'div',
                            { className: 'col-xs-6' },
                            React.createElement('input', { className: 'form-control',
                                type: 'text',
                                ref: item.uuid + '-0',
                                defaultValue: item.range[0] })
                        ),
                        React.createElement(
                            'div',
                            { className: 'col-xs-6' },
                            React.createElement(
                                'div',
                                { className: 'input-group' },
                                React.createElement('input', { type: 'text',
                                    className: 'form-control',
                                    ref: item.uuid + '-1',
                                    defaultValue: item.range[1] }),
                                React.createElement(
                                    'a',
                                    { className: 'input-group-addon',
                                        onClick: _this3.handleRemove.bind(null, i) },
                                    React.createElement('span', { className: 'glyphicon glyphicon-trash' })
                                )
                            )
                        )
                    );
                })
            ),
            React.createElement(
                'div',
                { className: 'panel-footer' },
                React.createElement(
                    'a',
                    { onClick: this.handleAdd },
                    React.createElement('span', { className: 'pficon pficon-add-circle-o' }),
                    ' Add new pool'
                )
            )
        );
    }

});
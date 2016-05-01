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

    getValues: function getValues() {
        var _this = this;

        return this.state.values.map(function (item, index) {
            var result = {
                'range': [_this.refs[item.uuid + '-0'].value, _this.refs[item.uuid + '-1'].value]
            };
            if (item.uuid.indexOf('new-') !== 0) {
                result.uuid = item.uuid;
            }
            return result;
        });
    },

    render: function render() {
        var _this2 = this;

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
                        { className: 'row', key: item.uuid },
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
                                    'span',
                                    { className: 'input-group-addon',
                                        onClick: _this2.handleRemove.bind(null, i) },
                                    React.createElement('i', { className: 'fa fa-trash' })
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
                    { onClick: this.handleAdd,
                        className: 'btn button btn-success' },
                    React.createElement('i', { className: 'fa fa-plus' }),
                    ' Add'
                )
            )
        );
    }

});
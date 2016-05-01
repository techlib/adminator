'use strict';

var DhcpOptionValues = React.createClass({
    displayName: 'DhcpOptionValues',

    componentWillReceiveProps: function componentWillReceiveProps(p) {
        this.setState(p);
    },

    getInitialState: function getInitialState() {
        this.state = { 'values': [] };
        return this.state;
    },

    handleAdd: function handleAdd() {
        var option = this.refs.newType.value;
        this.state.values.push({
            'type': 'string',
            'array': false,
            'value': '',
            'option': option
        });
        this.setState(this.state);
    },

    handleRemove: function handleRemove(index) {
        var removed = this.state.values.splice(index, 1);
        this.setState(this.state);
    },

    getAvailableOptions: function getAvailableOptions() {
        var excluded = this.state.values.map(function (item) {
            return item.option;
        });
        return _.omit(this.props.options, excluded);
    },

    getValues: function getValues() {
        var _this = this;

        return this.state.values.map(function (item, key) {
            return { 'option': item.option,
                'value': _this.refs[item.option].getValue() };
        });
    },

    validate: function validate() {
        var _this2 = this;

        return _.flatten(this.state.values.map(function (item, key) {
            return _this2.refs[item.option].validate();
        })).filter(function (item) {
            return item !== true;
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
                    'DHCP options'
                )
            ),
            React.createElement(
                'div',
                { className: 'panel-body' },
                React.createElement(
                    'form',
                    { className: 'form-horizontal' },
                    this.state.values.map(function (item, i) {
                        if (_.has(_this3.props.options, item.option)) {
                            var option = _this3.props.options[item.option];
                            return React.createElement(
                                'div',
                                { className: 'form-group', key: option.name },
                                React.createElement(DhcpRow, {
                                    optionDesc: option,
                                    value: item,
                                    key: option.name,
                                    ref: option.name,
                                    index: i,
                                    deleteHandler: _this3.handleRemove })
                            );
                        }
                    })
                )
            ),
            React.createElement(
                'div',
                { className: 'panel-footer' },
                React.createElement(
                    'div',
                    { className: 'row' },
                    React.createElement(
                        'label',
                        { className: 'col-xs-5 text-right' },
                        'new option'
                    ),
                    React.createElement(
                        'div',
                        { className: 'col-xs-5' },
                        React.createElement(
                            'select',
                            {
                                ref: 'newType',
                                className: 'form-control' },
                            _.map(this.getAvailableOptions(), function (item, key) {
                                return React.createElement(
                                    'option',
                                    { value: item.name,
                                        key: item.name },
                                    item.name
                                );
                            })
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'col-xs-1' },
                        React.createElement(
                            'a',
                            { onClick: this.handleAdd,
                                className: 'btn button btn-success' },
                            React.createElement('i', { className: 'fa fa-plus' }),
                            ' Add'
                        )
                    )
                )
            )
        );
    }
});

var DhcpRow = React.createClass({
    displayName: 'DhcpRow',

    getInitialState: function getInitialState() {
        return { 'type': '', 'array': false, 'value': null };
    },

    componentDidMount: function componentDidMount() {
        _.extend(this.state, this.props.optionDesc);
        this.state.value = this.props.value.value;
        this.setState(this.state);
    },

    getValue: function getValue() {
        return this.refs[this.state.name].getValue();
    },

    validate: function validate() {
        return this.refs[this.state.name].validate();
    },

    getEdit: function getEdit(type, array, values, name) {
        if (array) {
            var typeFactory = this.getEditControl(type);
            return React.createElement(ArrayControl, { type: type,
                t: typeFactory,
                name: name,
                ref: name,
                values: values });
        } else {
            return this.getEditControl(type)({
                'value': values,
                'id': name,
                'ref': name });
        }
    },

    handleRemove: function handleRemove() {
        this.props.deleteHandler(this.props.index);
    },

    getEditControl: function getEditControl(type) {

        if (type == 'string') return React.createFactory(DhcpTypeString);else if (type == 'boolean') return React.createFactory(DhcpTypeBool);else if (type == 'ipv4-address') return React.createFactory(DhcpTypeIpv4);else if (type == 'ipv6-address') return React.createFactory(DhcpTypeIpv6);else if (type == 'fqdn') return React.createFactory(DhcpTypeFqdn);else if (type == 'binary') return React.createFactory(DhcpTypeBinary);else if (type == 'empty') return React.createFactory(DhcpTypeEmpty);else if (type == 'record') return React.createFactory(DhcpTypeString);else if (type.indexOf('int') != -1) return React.createFactory(DhcpTypeInt);else return React.createFactory(DhcpTypeEmpty);
    },

    render: function render() {
        var valueEdit = this.getEdit(this.state.type, this.state.array, this.state.value, this.state.name);

        return React.createElement(
            'div',
            { className: 'row form-group' },
            React.createElement(
                'label',
                { htmlFor: this.props.optionDesc.name,
                    className: 'col-xs-5 control-label' },
                this.props.optionDesc.name,
                ' ',
                React.createElement(
                    'a',
                    { onClick: this.handleRemove },
                    React.createElement('i', { className: 'fa fa-trash' })
                )
            ),
            React.createElement(
                'div',
                { className: 'col-xs-6' },
                valueEdit
            )
        );
    }
});

var ArrayControl = React.createClass({
    displayName: 'ArrayControl',

    componentDidMount: function componentDidMount() {
        var _this4 = this;

        var v = this.props.values.split(',');
        v.map(function (item, key) {
            var val = item.trim();
            _this4.state.values.push({ 'c': _this4.state.counter,
                'val': val });
            _this4.state.counter++;
        });

        if (v.length == 0) {
            this.state.values.push({ 'val': '', 'c': 0 });
        }

        this.updateValue();
        this.setState(this.state);
    },

    getInitialState: function getInitialState() {
        return { 'values': [], 'counter': 0 };
    },

    updateValue: function updateValue() {
        this.state.value = _.map(this.refs, function (item) {
            return item.getValue();
        }).join(',');
    },

    getValue: function getValue() {
        this.updateValue();
        return this.state.value;
    },

    validate: function validate() {
        return _.map(this.refs, function (item) {
            return item.validate();
        });
    },

    handleAdd: function handleAdd() {
        this.state.counter++;
        this.state.values.push({ 'c': this.state.counter, 'val': '' });
        this.updateValue();
        this.setState(this.state);
    },

    handleRemove: function handleRemove(index) {
        this.state.values.splice(index, 1);
        this.updateValue();
        this.setState(this.state);
    },

    render: function render() {
        var _this5 = this;

        var t = this.props.t;
        return React.createElement(
            'div',
            null,
            this.state.values.map(function (item, i) {
                var id = _this5.props.name + (i == 0 ? '' : '-' + i);
                return React.createElement(
                    'div',
                    { key: item.c },
                    React.createElement(
                        'div',
                        { className: 'input-group' },
                        t({
                            id: id,
                            ref: id,
                            value: _this5.state.values[i].val }),
                        React.createElement(
                            'span',
                            { className: 'input-group-addon',
                                onClick: _this5.handleRemove.bind(null, i) },
                            React.createElement('i', { className: 'fa fa-trash' })
                        )
                    )
                );
            }),
            React.createElement(
                'div',
                { className: 'form-control-static' },
                React.createElement(
                    'a',
                    { onClick: this.handleAdd },
                    ' ',
                    React.createElement('i', { className: 'fa fa-plus' }),
                    ' Add'
                )
            )
        );
    }
});
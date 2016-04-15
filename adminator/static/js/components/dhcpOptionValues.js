'use strict';

var DhcpOptionValues = React.createClass({
    displayName: 'DhcpOptionValues',

    componentWillReceiveProps: function componentWillReceiveProps(p) {
        this.setState({ 'values': this.props.values });
    },

    getInitialState: function getInitialState() {
        return { 'values': [] };
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
        if (_.has(removed, 'uuid')) {
            this.state.removed.push(removed.uuid);
        }
        this.setState(this.state);
    },

    getAvailableOptions: function getAvailableOptions() {
        var excluded = this.state.values.map(function (item) {
            return item.option;
        });
        return _.omit(this.props.options, excluded);
    },

    getFormResult: function getFormResult() {
        return {};
    },

    render: function render() {
        var _this = this;

        return React.createElement(
            'div',
            { className: 'col-xs-12 container well' },
            React.createElement(
                'form',
                { className: 'form-horizontal' },
                this.state.values.map(function (item, i) {
                    if (_.has(_this.props.options, item.option)) {
                        var option = _this.props.options[item.option];
                        return React.createElement(
                            'div',
                            { className: 'form-group', key: item.option },
                            React.createElement(DhcpRow, {
                                optionDesc: option,
                                value: item,
                                key: option.uuid,
                                deleteHandler: _this.handleRemove.bind(null, i) })
                        );
                    }
                }),
                React.createElement(
                    'div',
                    { className: 'row form-group' },
                    React.createElement(
                        'div',
                        { className: 'form-group' },
                        React.createElement(
                            'label',
                            { className: 'col-xs-4 control-label' },
                            React.createElement(
                                'i',
                                { className: '' },
                                'new option'
                            )
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
                                        { value: item.uuid,
                                            key: item.uuid },
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
                                { onClick: this.handleAdd, className: 'btn button btn-success' },
                                ' ',
                                React.createElement('i', { className: 'fa fa-plus' }),
                                ' Add'
                            )
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

    getEdit: function getEdit(type, array, values, name) {
        if (array) {
            var typeFactory = this.getEditControl(type);
            return React.createElement(ArrayControl, { type: type,
                t: typeFactory,
                name: name,
                values: values });
        } else {
            return this.getEditControl(type)({ 'value': values, 'id': name });
        }
    },

    getEditControl: function getEditControl(type) {

        if (type == 'string') return React.createFactory(DhcpTypeString);else if (type == 'boolean') return React.createFactory(DhcpTypeBool);else if (type == 'ipv4-address') return React.createFactory(DhcpTypeString);else if (type == 'ipv6-address') return React.createFactory(DhcpTypeString);else if (type == 'fqdn') return React.createFactory(DhcpTypeString);else if (type == 'binary') return React.createFactory(DhcpTypeString);else if (type == 'empty') return React.createFactory(DhcpTypeEmpty);else if (type == 'record') return React.createFactory(DhcpTypeString);else if (type.indexOf('int') != -1) return React.createFactory(DhcpTypeString);else return React.createFactory(DhcpTypeEmpty);
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
                    { onClick: this.props.deleteHandler },
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
        var _this2 = this;

        var v = this.props.values.split(',');
        v.map(function (item, key) {
            var val = item.trim();
            _this2.state.values.push({ 'c': _this2.state.counter,
                'val': val });
            _this2.state.counter++;
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
        this.state.value = _.map(this.state.values, function (item) {
            return item.val;
        }).join(',');
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

    handleChildChange: function handleChildChange(i, evt) {
        this.state.values[i].val = evt.target.value;
        this.updateValue();
        this.setState(this.state);
    },

    render: function render() {
        var _this3 = this;

        var t = this.props.t;
        return React.createElement(
            'div',
            null,
            this.state.values.map(function (item, i) {
                return React.createElement(
                    'div',
                    { key: item.c },
                    React.createElement(
                        'div',
                        { className: 'input-group' },
                        t({
                            changeHandler: _this3.handleChildChange.bind(null, i),
                            id: _this3.props.name + (i == 0 ? '' : '-' + i),
                            value: _this3.state.values[i].val }),
                        React.createElement(
                            'span',
                            { className: 'input-group-addon',
                                onClick: _this3.handleRemove.bind(null, i) },
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
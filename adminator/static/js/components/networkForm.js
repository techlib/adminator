'use strict';

var NetworkForm = React.createClass({
    displayName: 'NetworkForm',

    getValues: function getValues() {
        return this.state;
    },

    validate: function validate() {
        var errors = [];
        var data = this.state;
        if (!data['description']) {
            errors.push('Description is missing');
        };
        if (!data['vlan']) {
            errors.push('Vlan is missing');
        };
        if (data['vlan'] && !inRange(data['vlan'], 0, 4096)) {
            errors.push('Vlan must be a number 0-4096');
        };
        if (data['prefix4'] && !isIP4Cidr(data['prefix4'])) {
            errors.push('IPv4 prefix is invalid');
        };
        if (data['prefix6'] && !isIP6Cidr(data['prefix6'])) {
            errors.push('IPv6 prefix is invalid');
        };
        if (!data['max_lease']) {
            errors.push('Max. lease is missing');
        };
        if (data['max_lease'] && !isInt(data['max_lease'])) {
            errors.push('Max. lease must be a number');
        }
        return errors;
    },

    componentWillReceiveProps: function componentWillReceiveProps(p) {
        this.setState(p.values);
    },

    handleChange: function handleChange(evt) {
        var val = {};
        val[evt.target.name] = evt.target.value;
        this.setState(val);
    },

    getInitialState: function getInitialState() {
        return { description: null, vlan: null,
            prefix4: null, prefix6: null, max_lease: null };
    },

    render: function render() {
        return React.createElement(
            'div',
            { className: 'panel panel-default' },
            React.createElement(
                'div',
                { className: 'panel-heading' },
                React.createElement(
                    'h3',
                    { className: 'panel-title' },
                    'Basic settings'
                )
            ),
            React.createElement(
                'div',
                { className: 'panel-body' },
                React.createElement(
                    'form',
                    { className: 'form-horizontal' },
                    React.createElement(
                        'div',
                        { className: 'form-group' },
                        React.createElement(
                            'label',
                            { className: 'col-sm-3 control-label' },
                            'Name'
                        ),
                        React.createElement(
                            'div',
                            { className: 'col-sm-8' },
                            React.createElement(Input, { type: 'text',
                                onChange: this.handleChange,
                                value: this.state.description,
                                name: 'description' })
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'form-group' },
                        React.createElement(
                            'label',
                            { className: 'col-sm-3 control-label' },
                            'VLAN'
                        ),
                        React.createElement(
                            'div',
                            { className: 'col-sm-2' },
                            React.createElement(Input, { type: 'text',
                                onChange: this.handleChange,
                                value: this.state.vlan,
                                name: 'vlan' })
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'form-group' },
                        React.createElement(
                            'label',
                            { className: 'col-sm-3 control-label' },
                            'Prefix IPv4'
                        ),
                        React.createElement(
                            'div',
                            { className: 'col-sm-4' },
                            React.createElement(Input, { type: 'text',
                                onChange: this.handleChange,
                                value: this.state.prefix4,
                                name: 'prefix4' })
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'form-group' },
                        React.createElement(
                            'label',
                            { className: 'col-sm-3 control-label' },
                            'Prefix IPv6'
                        ),
                        React.createElement(
                            'div',
                            { className: 'col-sm-8' },
                            React.createElement(Input, { type: 'text',
                                onChange: this.handleChange,
                                value: this.state.prefix6,
                                name: 'prefix6' })
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'form-group' },
                        React.createElement(
                            'label',
                            { className: 'col-sm-3 control-label' },
                            'Max. lease'
                        ),
                        React.createElement(
                            'div',
                            { className: 'col-sm-2' },
                            React.createElement(Input, { type: 'text',
                                onChange: this.handleChange,
                                value: this.state.max_lease,
                                name: 'max_lease' })
                        )
                    )
                )
            ),
            React.createElement(
                'div',
                { className: 'panel-footer' },
                React.createElement(
                    'button',
                    { onClick: this.props.saveHandler,
                        className: 'btn btn-primary' },
                    'Save'
                )
            )
        );
    }
});
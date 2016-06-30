'use strict';

var DeviceInterfaceList = React.createClass({
    displayName: 'DeviceInterfaceList',

    c: 0,

    getInitialState: function getInitialState() {
        return {};
    },

    componentWillReceiveProps: function componentWillReceiveProps(p) {
        if (this.state.interfaces) {
            p = _.omit(p, ['interfaces']);
        }
        this.setState(p);
    },

    addInterface: function addInterface() {
        this.c++;
        this.setState({ interfaces: this.state.interfaces.concat({ uuid: 'n' + this.c }) });
    },

    deleteInterface: function deleteInterface(index) {
        var state = this.state;
        var removed = state.interfaces.splice(index, 1);
        this.setState(state);
    },

    validate: function validate() {
        var _this = this;

        var r = [];
        _.map(this.state.interfaces, function (item) {
            r = r.concat(_this.refs['interface' + item.uuid].validate());
        });

        return r;
    },

    getValues: function getValues() {
        var _this2 = this;

        return _.map(this.state.interfaces, function (item) {
            return _this2.refs['interface' + item.uuid].getValues();
        });
    },

    render: function render() {
        var _this3 = this;

        return React.createElement(
            'div',
            null,
            ' ',
            _.map(this.state.interfaces, function (item, index) {
                return React.createElement(DeviceInterface, {
                    item: item,
                    index: index,
                    key: item.uuid,
                    ref: 'interface' + item.uuid,
                    deleteHandler: _this3.deleteInterface,
                    delimiter: index != _this3.state.interfaces.length - 1,
                    networks: _this3.props.networks });
            })
        );
    }
});
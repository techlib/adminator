'use strict';

var DeviceEdit = React.createClass({
    displayName: 'DeviceEdit',

    mixins: [Reflux.connect(deviceStore, 'device')],

    componentDidMount: function componentDidMount() {
        DeviceActions.read(this.props.params.id);
    },

    getInitialState: function getInitialState() {
        return { device: { device: {} } };
    },

    handleSave: function handleSave(data) {
        data.uuid = this.props.params.id;
        DeviceActions.update(data);
    },

    render: function render() {
        return React.createElement(Device, { device: this.state.device.device,
            title: this.state.device.device.description,
            saveHandler: this.handleSave
        });
    }
});
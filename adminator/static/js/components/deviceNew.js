'use strict';

var DeviceNew = React.createClass({
    displayName: 'DeviceNew',

    handleSave: function handleSave(data) {
        DeviceActions.create(data);
    },

    getInitialState: function getInitialState() {
        return { device: { interfaces: [], uuid: true } };
    },

    render: function render() {
        return React.createElement(Device, { title: 'New device',
            device: this.state.device,
            saveHandler: this.handleSave
        });
    }

});
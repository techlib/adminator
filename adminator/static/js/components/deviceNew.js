'use strict';

var DeviceNew = React.createClass({
    displayName: 'DeviceNew',

    handleSave: function handleSave(data) {
        DeviceActions.create(data);
    },

    render: function render() {
        var device = {
            interfaces: []
        };
        return React.createElement(Device, { title: 'New device',
            device: device,
            saveHandler: this.handleSave
        });
    }

});
import * as React from 'react'
import * as Reflux from 'reflux'
import {Device} from './Device'
import {DeviceStore} from '../stores/Device'
import {DeviceActions} from '../actions'

export var DeviceEdit = React.createClass({
    mixins: [
        Reflux.connect(DeviceStore, 'device'),
    ],

    componentDidMount() {
        DeviceActions.read(this.props.params.id)
    },

    getInitialState() {
        return {device: {device: {}}}
    },

    handleSave(data) {
        data.uuid = this.props.params.id
        DeviceActions.update(data)
    },

    render() {
        return (
            <Device device={this.state.device.device}
                    title={this.state.device.device.description}
                    saveHandler={this.handleSave}
                />
        )
    }
});


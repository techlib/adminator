var DeviceEdit = React.createClass({
    mixins: [
        Reflux.connect(deviceStore, 'device'),
    ],

    componentDidMount(){
        DeviceActions.read(this.props.params.id)
    },

    getInitialState() {
        return {device: {device: {}}}
    },

    handleSave(data){
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


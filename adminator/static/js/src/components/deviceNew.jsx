var DeviceNew = React.createClass({

    handleSave(data){
        DeviceActions.create(data)
    },

    getInitialState() {
        return {device: {interfaces: [], uuid: true}}
    },

    render() {
        return (
            <Device title='New device'
                    device={this.state.device}
                    saveHandler={this.handleSave}
                />
        )
    }

})

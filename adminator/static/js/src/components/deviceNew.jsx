var DeviceNew = React.createClass({

    handleSave(data){
        DeviceActions.create(data)
    },

    render() {
        var device = {
            interfaces: []
        }
        return (
            <Device title='New device'
                    device={device}
                    saveHandler={this.handleSave}
                />
        )
    }

})

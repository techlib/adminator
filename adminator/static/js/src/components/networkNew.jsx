var NetworkNew = React.createClass({

    save(data) {
        NetworkActions.create(data)
    },

    render() {
        return (
            <Network title="New network"
                     save_handler={this.save}
            />
        )
    }
});



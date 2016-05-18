var DeviceInterfaceList = React.createClass({

    c: 0,

    getInitialState() {
        return {}
    },

    componentWillReceiveProps(p) {
        this.setState(p)
    },

    addInterface() {
        this.c++
        this.setState({interfaces: this.state.interfaces.concat({uuid: 'n' + this.c})})
    },

    deleteInterface(index) {
        var state = this.state
        var removed = state.interfaces.splice(index, 1)
        this.setState(state)
    },

    validate() {
        var r = []
        _.map(this.state.interfaces, (item) => {
            r = r.concat(this.refs['interface' + item.uuid].validate())
        })

        return r;
    },

    getValues() {
        return _.map(this.state.interfaces, (item) => {
            return this.refs['interface' + item.uuid].getValues()
        })
    },

    render() {
        return <div> {
            _.map(this.state.interfaces, (item, index) => {
                return <DeviceInterface
                    item={item}
                    index={index}
                    key={item.uuid}
                    ref={'interface' + item.uuid}
                    deleteHandler={this.deleteInterface}
                    delimiter={index != this.state.interfaces.length - 1}
                    networks={this.props.networks} />
            })}
        </div>
    }
})

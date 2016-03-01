var DhcpTypeBool = React.createClass({
    render() {
        return (
            <div>
            <label className="radio-inline">
                <input type="radio" value="1" name={this.props.id} /> True
            </label>
            <label className="radio-inline">
                <input type="radio" value="0" name={this.props.id} /> False
            </label>
            </div>
        )
    }
})

var DhcpTypeString = React.createClass({
    render() {
        return <input type="text" className="form-control" onChange={this.props.changeHandler} ref="val" defaultValue={this.props.value} id={this.props.id}/>}
})

var DhcpTypeEmpty = React.createClass({
    render() {return <div className="form-control-static">
       <i>no value</i></div>}
})

var DhcpTypeInt = React.createClass({
    render() {}
})

var DhcpTypeIpv4 = React.createClass({
    render() {}
})

var DhcpTypeFqdn = React.createClass({
    render() {}
})

var DhcpTypeBinary = React.createClass({
    render() {}
})

var DhcpTypeRecord = React.createClass({
    render() {}
})

var DhcpTypeNetbios = React.createClass({
    render() {}
})



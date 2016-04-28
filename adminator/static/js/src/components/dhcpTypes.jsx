
var createFieldWithPattern = function(pattern) {
    return React.createClass({

        getValue: function() {
            return this.state.value;
        },

        setValue: function(val) {
            this.setState({value: val});
        },

        getInitialState: function() {
            return {value: ''};
        },

        handleChange: function(event) {
            this.setState({value: event.target.value});
        },

        componentDidMount: function() {
            this.setState({value: this.props.value});
        },

        render() {
            return <input 
                    type="text"
                    className="form-control"
                    ref={this.props.ref}
                    defaultValue={this.props.value}
                    value={this.state.value}
                    onChange={this.props.changeHandler || this.handleChange}
                    pattern={pattern}
                    id={this.props.id}/>
        }
    })

}

var DhcpTypeString = createFieldWithPattern('.*');
var DhcpTypeInt = createFieldWithPattern('-?[0-9]+');

var DhcpTypeIpv4 = createFieldWithPattern('.*');
var DhcpTypeIpv6 = createFieldWithPattern('.*');
var DhcpTypeFqdn = createFieldWithPattern('.*');
var DhcpTypeBinary = createFieldWithPattern('.*');
var DhcpTypeRecord = createFieldWithPattern('.*');
var DhcpTypeNetbios = createFieldWithPattern('.*');

var DhcpTypeEmpty = React.createClass({
    getValue() {
        return null;
    },

    render() {
        return <div className="form-control-static"><i>no value</i></div>
    }
})

var DhcpTypeBool = React.createClass({

    getValue() {
        return this.state.value;
    },

    setValue: function(val) {
        this.setState({value: val});
    },

    getInitialState: function() {
        return {value: ''};
    },

    handleChange: function(event) {
        this.setState({value: event.target.value});
    },

    componentDidMount: function() {
        this.setState({value: this.props.value});
    },


    render() {
        return (
            <div>
            <label className="radio-inline">
                <input type="radio" 
                       value="1" 
                       name={this.props.id} 
                       onChange={this.handleChange}
                       defaultChecked={this.props.value==1 || true} 
                       checked={this.state.value==1} /> True
            </label>
            <label className="radio-inline">
                <input type="radio" 
                       value="0" 
                       name={this.props.id} 
                       onChange={this.handleChange}
                       defaultChecked={this.props.value==0&& false}
                       checked={this.state.value==0} /> False
            </label>
            </div>
        )
    }
})

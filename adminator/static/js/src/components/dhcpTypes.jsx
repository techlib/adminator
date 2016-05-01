
var createFieldWithPattern = function(pattern) {
    return React.createClass({

        getValue: function() {
            return this.refs[this.props.id].value;
        },

        getInitialState: function() {
            return {value: ''};
        },

        render() {
            return <input
                    type="text"
                    className="form-control"
                    ref={this.props.id}
                    defaultValue={this.props.value}
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
    getValue() {return '';},
    render() {return <div className="form-control-static"><i>no value</i></div> }
})

var DhcpTypeBool = React.createClass({

    getValue() {
        return this.refs[this.props.id + '0'].checked;
    },

    getInitialState: function() {
        return {value: ''};
    },

    render() {
        return (
            <div>
                <label className="radio-inline">
                    <input type="radio" 
                           value="1" 
                           name={this.props.id}
                           ref={this.props.id + '0'}
                           onChange={this.handleChange}
                           defaultChecked={this.props.value==1} 
                           /> True
                </label>
                <label className="radio-inline">
                    <input type="radio" 
                           value="0" 
                           name={this.props.id} 
                           onChange={this.handleChange}
                           defaultChecked={this.props.value==0}
                            /> False
                </label>
            </div>
        )
    }
})

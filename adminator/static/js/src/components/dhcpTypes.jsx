
var createFieldWithValidator = function(validator) {
    return React.createClass({

        _validate: validator,

        getValue: function() {
            return this.refs[this.props.id].value;
        },

        validate: function() {
            var value = this.getValue();

            if (!notEmpty(value)) {
                return this.props.id + ' is empty';
            }

            if (!this._validate(value)) {
               return this.props.id + ' is invalid'
            }

            return true;
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
                    id={this.props.id}/>
        }
    })

}

var DhcpTypeString = createFieldWithValidator(notEmpty);
var DhcpTypeInt = createFieldWithValidator(isInt);

var DhcpTypeIpv4 = createFieldWithValidator(isIP4);
var DhcpTypeIpv6 = createFieldWithValidator(isIP6);
var DhcpTypeFqdn = createFieldWithValidator(notEmpty);
var DhcpTypeBinary = createFieldWithValidator(notEmpty);
var DhcpTypeRecord = createFieldWithValidator(notEmpty);
var DhcpTypeNetbios = createFieldWithValidator(notEmpty);

var DhcpTypeEmpty = React.createClass({
    getValue() {return '';},
    validate() {return true},
    render() {return <div className="form-control-static"><i>no value</i></div> }
})

var DhcpTypeBool = React.createClass({

    getValue() {
        return this.refs[this.props.id + '0'].checked;
    },

    getInitialState: function() {
        return {value: ''};
    },

    validate() {
        return this.getValue() !== undefined;
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

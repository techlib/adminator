import * as React from 'react'
import * as Types from './DhcpTypes'
import * as _ from 'lodash'

export var DhcpOptionValues = React.createClass({

    componentWillReceiveProps(p) {
        this.setState(p)
    },

    getInitialState() {
        this.state = {'values': []}
        return this.state
    },

    handleAdd() {
        let option = this.refs.newType.value
        if (option == '0') {
            return
        }

        this.state.values.push({
            'type': 'string',
            'array': false,
            'value': '',
            'option': option
        })
        this.setState(this.state)
    },

    handleRemove(index) {
        this.state.values.splice(index, 1)
        this.setState(this.state)
    },

    getAvailableOptions() {
        let excluded = this.state.values.map((item) => {
            return item.option
        })
        return _.omit(this.props.options, excluded)
    },

    getValues() {
        return this.state.values.map((item) => {
            return {'option': item.option,
                    'value':  this.refs[item.option].getValue()}
        })
    },

    validate() {
        return _.flatten(this.state.values.map((item) => {
            return this.refs[item.option].validate()
        })).filter(item => {return item !== true})
    },

    render() {
        return (
            <div className='panel panel-default'>
                <div className='panel-heading'>
                    <h3 className='panel-title'>{this.props.title}</h3>
                </div>
                <div className='panel-body'>
                    <form className='form-horizontal'>
                    {this.state.values.map((item, i) => {
                        if (_.has(this.props.options, item.option)) {
                            let option = this.props.options[item.option]
                            return <div className="form-group" key={option.name}>
                                        <DhcpRow
                                            optionDesc={option}
                                            value={item}
                                            key={option.name}
                                            ref={option.name}
                                            index={i}
                                            deleteHandler={this.handleRemove}/>
                                   </div>
                        }
                      })
                    }
               </form>
           </div>
           <div className='panel-footer'>
              <div className="row">
                    <label className="col-xs-5 text-right">new option</label>
                    <div className="col-xs-5">
                         <select
                            ref='newType'
                            className="form-control"
                            onChange={this.handleAdd}>
                            <option value="0" key="0">- please select -</option>
                            {
                                _.map(this.getAvailableOptions(), (item) => {
                                    return <option value={item.name}
                                                    key={item.name}>
                                                    {item.name}
                                           </option>
                                })
                            }
                        </select>
                    </div>
            </div>
          </div>
        </div>)
    }
})

let DhcpRow = React.createClass({

    getInitialState() {
        return {'type': '', 'array': false, 'value': null}
    },

    componentDidMount() {
        _.extend(this.state, this.props.optionDesc)
        this.state.value = this.props.value.value
        this.setState(this.state)
    },

    getValue() {
        return this.refs[this.state.name].getValue()
    },

    validate() {
        return this.refs[this.state.name].validate()
    },

    getEdit(type, array, values, name) {
        if (array) {
            let typeFactory = this.getEditControl(type)
            return <ArrayControl type={type}
                                 t={typeFactory}
                                 name={name}
                                 ref={name}
                                 values={values} />
        } else {
            return this.getEditControl(type)({
                'value': values,
                'id': name,
                'ref': name})
        }
    },

    handleRemove() {
        this.props.deleteHandler(this.props.index)
    },

    getEditControl(type) {

        if (type == 'string') {
            return React.createFactory(Types.DhcpTypeString)
        } else if (type == 'boolean') {
            return React.createFactory(Types.DhcpTypeBool)
        } else if (type == 'ipv4-address') {
            return React.createFactory(Types.DhcpTypeIpv4)
        } else if (type == 'ipv6-address') {
            return React.createFactory(Types.DhcpTypeIpv6)
        } else if (type == 'fqdn') {
            return React.createFactory(Types.DhcpTypeFqdn)
        } else if (type == 'binary') {
            return React.createFactory(Types.DhcpTypeBinary)
        } else if (type == 'empty') {
            return React.createFactory(Types.DhcpTypeEmpty)
        } else if (type == 'record') {
            return React.createFactory(Types.DhcpTypeString)
        } else if (type.indexOf('int') != -1) {
            return React.createFactory(Types.DhcpTypeInt)
        } else {
            return React.createFactory(Types.DhcpTypeEmpty)
        }
    },

    render() {
        let valueEdit = this.getEdit(this.state.type,
                                     this.state.array,
                                     this.state.value,
                                     this.state.name)

        return (
            <div className='row form-group'>
                <label htmlFor={this.props.optionDesc.name} 
                       className="col-xs-5 control-label">
                    {this.props.optionDesc.name}&nbsp
                    <a onClick={this.handleRemove}>
                        <i className="fa fa-trash"></i>
                    </a>
                </label>
                <div className='col-xs-6'>
                    {valueEdit}
                </div>
          </div>)
    }
})

let ArrayControl = React.createClass({

    componentDidMount() {
        let v = this.props.values.split(',')
        v.map((item) => {
            let val = item.trim()
            this.state.values.push({'c': this.state.counter,
                                    'val': val})
            this.state.counter++
        })

        if (v.length == 0) {
            this.state.values.push({'val': '', 'c': 0})
        }

        this.updateValue()
        this.setState(this.state)
    },

    getInitialState() {
        return {'values': [], 'counter': 0}
    },

    updateValue() {
        this.state.value = _.map(this.refs, item => {
            return item.getValue()
        }).join(',')
    },

    getValue() {
        this.updateValue()
        return this.state.value
    },

    validate() {
        return _.map(this.refs, item => {
            return item.validate()
        })
    },

    handleAdd() {
        this.state.counter++
        this.state.values.push({'c': this.state.counter, 'val': ''})
        this.updateValue()
        this.setState(this.state)
    },

    handleRemove(index) {
        this.state.values.splice(index, 1)
        this.updateValue()
        this.setState(this.state)
    },

    render() {
        let t = this.props.t
        return (
            <div>
            {
                this.state.values.map((item, i) => {
                    var id = this.props.name + ((i==0) ? '' : '-' + i)
                    return <div key={item.c} className="input-group array-row">
                        {t({
                            id: id,
                            ref: id,
                            value: this.state.values[i].val})}
                        <a className="input-group-addon"
                            onClick={this.handleRemove.bind(null, i)}>
                            <span className="glyphicon glyphicon-trash"></span>
                        </a>
                    </div>
                })
            }
            <div className="form-control-static">
                <a onClick={this.handleAdd}> <i className="fa fa-plus"></i> Add</a>
            </div>
        </div>
        )
    }
})

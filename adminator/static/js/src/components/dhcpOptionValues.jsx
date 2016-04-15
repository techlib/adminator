var DhcpOptionValues = React.createClass({

    componentWillReceiveProps(p) {
        this.setState({'values': this.props.values});
    },

    getInitialState() {
        return {'values': []}
    },

    handleAdd() {
        let option = this.refs.newType.value;
        this.state.values.push({
            'type': 'string', 
            'array': false,
            'value': '',
            'option': option
        });
        this.setState(this.state);
    },

    handleRemove(index) {
        let removed = this.state.values.splice(index, 1);
        if (_.has(removed, 'uuid')) {
            this.state.removed.push(removed.uuid);
        }
        this.setState(this.state);
    },

    getAvailableOptions() {
        let excluded = this.state.values.map((item) => {
            return item.option;
        });
        return _.omit(this.props.options, excluded);
    },

    getFormResult() {
        return {};
    },

    render() {
        return (<div className='col-xs-12 container well'>
            <form className='form-horizontal'>
            {this.state.values.map((item, i) => {
                if (_.has(this.props.options, item.option)) {
                    let option = this.props.options[item.option];
                    return <div className="form-group" key={item.option}>
                                <DhcpRow
                                    optionDesc={option}
                                    value={item}
                                    key={option.uuid} 
                                    deleteHandler={this.handleRemove.bind(null,i)}/>
                           </div>
                }
              })
            }
           <div className="row form-group">
                <div className="form-group">
                    <label className="col-xs-4 control-label">
                        <i className="">new option</i>
                    </label>
                        <div className="col-xs-5">
                     <select
                        ref='newType'
                        className="form-control">
                        {
                            _.map(this.getAvailableOptions(), (item, key) => {
                                return <option value={item.uuid}
                                    key={item.uuid}>{item.name}</option>
                            })
                        }
                    </select>
                    </div>

                    <div className="col-xs-1">
        <a onClick={this.handleAdd} className="btn button btn-success"> <i className="fa fa-plus"></i> Add</a>
                        </div>
                  </div>
           </div>
           </form>



        </div>)
    }
})

let DhcpRow = React.createClass({

    getInitialState() {
        return {'type': '', 'array': false, 'value': null}
    },

    componentDidMount() {
        _.extend(this.state, this.props.optionDesc);
        this.state.value = this.props.value.value;
        this.setState(this.state);
    },

    getEdit(type, array, values, name) {
        if (array) {
            let typeFactory = this.getEditControl(type)
            return <ArrayControl type={type}
                                 t={typeFactory}
                                 name={name}
                                 values={values} />
        } else {
            return this.getEditControl(type)({'value': values, 'id': name})
        }
    },

    getEditControl(type) {

        if (type == 'string')
            return React.createFactory(DhcpTypeString)
        else if (type == 'boolean')
            return React.createFactory(DhcpTypeBool)
        else if (type == 'ipv4-address')
            return React.createFactory(DhcpTypeString)
        else if (type == 'ipv6-address')
            return React.createFactory(DhcpTypeString)
        else if (type == 'fqdn')
            return React.createFactory(DhcpTypeString)
        else if (type == 'binary')
            return React.createFactory(DhcpTypeString)
        else if (type == 'empty')
            return React.createFactory(DhcpTypeEmpty)
        else if (type == 'record')
            return React.createFactory(DhcpTypeString)
        else if (type.indexOf('int') != -1)
            return React.createFactory(DhcpTypeString)
        else
            return React.createFactory(DhcpTypeEmpty)

    },

    render() {
        let valueEdit = this.getEdit(this.state.type,
                                     this.state.array,
                                     this.state.value,
                                     this.state.name);

        return (
            <div className='row form-group'>
                <label htmlFor={this.props.optionDesc.name} 
                       className="col-xs-5 control-label">
                    {this.props.optionDesc.name}&nbsp;
                    <a onClick={this.props.deleteHandler}>
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
        let v = this.props.values.split(',');
        v.map((item, key) => {
            let val = item.trim();
            this.state.values.push({'c': this.state.counter,
                                    'val': val});
            this.state.counter++;
        })

        if (v.length == 0) {
            this.state.values.push({'val': '', 'c': 0})
        }

        this.updateValue();
        this.setState(this.state);
    },

    getInitialState() {
        return {'values': [], 'counter': 0}
    },

    updateValue() {
        this.state.value = _.map(this.state.values, item => {
            return item.val;
        }).join(',');
    },

    handleAdd() {
        this.state.counter++;
        this.state.values.push({'c': this.state.counter, 'val': ''});
        this.updateValue();
        this.setState(this.state);
    },

    handleRemove(index) {
        this.state.values.splice(index, 1);
        this.updateValue();
        this.setState(this.state);
    },

    handleChildChange(i, evt) {
        this.state.values[i].val = evt.target.value;
        this.updateValue();
        this.setState(this.state);
    },

    render() {
        let t = this.props.t
        return (
            <div>
            {
                this.state.values.map((item, i) => {
                return <div key={item.c}>
                    <div className="input-group">
                        {t({
                            changeHandler: this.handleChildChange.bind(null, i),
                            id: this.props.name + ((i==0) ? '' : '-' + i),
                            value: this.state.values[i].val})}
                        <span className="input-group-addon" 
                              onClick={this.handleRemove.bind(null, i)}>
                              <i className="fa fa-trash"></i>
                        </span>
                    </div>
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

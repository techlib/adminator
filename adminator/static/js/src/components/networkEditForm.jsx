var NetworkEditForm = React.createClass({

    handleChange(name, evt) {
        this.state[name] = evt.target.value;
        this.setState(this.state);
    },

    getInitialState() {
        return {description: '', vlan: '', prefix: '', max_lease: ''}
    },

    componentWillReceiveProps(p) {
        this.setState(p.values);
    },

    getValue() {
        return this.state;
    },

    render() {
        return (<div className="">
            <form className="form-horizontal">
                <div className="form-group">
                <label className="col-sm-3 control-label">Name</label>
                    <div className="col-sm-8">
                        <Input type="text" 
                            value={this.state.description}
                            onChange={this.handleChange.bind(null, 'description')}/>
                    </div>
                </div>
                 <div className="form-group">
                <label className="col-sm-3 control-label">VLAN</label>
                    <div className="col-sm-2">
                        <Input type="text" 
                            value={this.state.vlan}
                            onChange={this.handleChange.bind(null, 'vlan')}/>
                    </div>
                </div>
                  <div className="form-group">
                <label className="col-sm-3 control-label">Prefix</label>
                    <div className="col-sm-2">
                        <Input type="text" 
                            value={this.state.prefix}
                            onChange={this.handleChange.bind(null, 'prefix')}/>
                    </div>
                </div>
                 <div className="form-group">
                <label className="col-sm-3 control-label">Max. lease</label>
                    <div className="col-sm-2">
                        <Input type="text" 
                            value={this.state.max_lease}
                            onChange={this.handleChange.bind(null, 'max_lease')}/>
                    </div>
                </div>
                <button onClick={this.props.saveHandler} className="btn btn-primary">Save</button>
            </form>
        </div>)
    }
})

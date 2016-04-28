var IPPools = React.createClass({

    c: 0,

    componentWillReceiveProps(p) {
        this.setState(p);
    },

    getInitialState() {
        this.state = {'values': []}
        return this.state;
    },

    handleAdd() {
        this.c++;
        this.state.values.push({'range': [], 'uuid': 'new-' + this.c});
        this.setState(this.state);
    },

    handleRemove(index) {
        let removed = this.state.values.splice(index, 1);
        this.setState(this.state);
    },

    handleChange(index, rangeIndex, event) {
        this.state.values[index].range[rangeIndex] = event.target.value;
        this.setState(this.state);
    },

    getValues() {
        return this.state.values;
    },

    render() {
        return (
            <div className="well">
            {this.state.values.map((item, i) => {
                return <div className="row" key={item.uuid}>
                    <div className="col-xs-6">
                        <input className="form-control"
                               type="text"
                               onChange={this.handleChange.bind(null, i, 0)}
                               value={item.range[0]}/>
                    </div>
                    <div className="col-xs-6">
                        <div className="input-group">
                            <input type="text" 
                                   className="form-control" 
                                   onChange={this.handleChange.bind(null, i, 1)}
                                   value={item.range[1]}/>

                            <span className="input-group-addon">
                                <a onClick={this.handleRemove.bind(null,i)}>
                                    <i className="fa fa-trash"></i>
                                </a>
                            </span>
                        </div>
                        </div>
                    </div>
                })
            }
            <div className="row">
                <div className="col-xs-12">
                <a onClick={this.handleAdd}
                    className="btn button btn-success">
                    <i className="fa fa-plus"></i> Add</a>
                </div>
            </div>

            </div>
        );
    }

})

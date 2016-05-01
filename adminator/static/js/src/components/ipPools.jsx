var IPPools = React.createClass({

    c: 0,

    componentWillReceiveProps(p) {
        this.setState(p);
    },

    getInitialState() {
        return {'values': []}
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

    getValues() {
        return this.state.values.map((item, index) => {
            var result = {
                'range': [this.refs[item.uuid + '-0'].value,
                          this.refs[item.uuid + '-1'].value]
            };
            if (item.uuid.indexOf('new-') !== 0) {
                result.uuid = item.uuid;
            }
            return result;
        });
    },

    render() {
        return (
            <div className="panel panel-default">
            <div className="panel-heading">
                <h3 className="panel-title">IP pools</h3>
            </div>
            <div className="panel-body">

            {this.state.values.map((item, i) => {
                return <div className="row" key={item.uuid}>
                    <div className="col-xs-6">
                        <input className="form-control"
                            type="text"
                            ref={item.uuid + '-0'}
                            defaultValue={item.range[0]}/>
                    </div>
                    <div className="col-xs-6">
                        <div className="input-group">
                            <input type="text"
                                className="form-control"
                                ref={item.uuid + '-1'}
                                defaultValue={item.range[1]}/>

                            <span className="input-group-addon"
                                onClick={this.handleRemove.bind(null,i)}>
                                    <i className="fa fa-trash"></i>
                            </span>
                        </div>
                        </div>
                    </div>
                })
            }
        </div>
            <div className="panel-footer">
                <a onClick={this.handleAdd}
                    className="btn button btn-success">
                    <i className="fa fa-plus"></i> Add</a>
            </div>

        </div>
        );
    }

})

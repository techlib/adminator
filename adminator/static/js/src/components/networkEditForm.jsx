var NetworkEditForm = React.createClass({

    render() {
        return (<div className="">
            <form className="form-horizontal">
                <div className="form-group">
                <label className="col-sm-3 control-label">Name</label>
                    <div className="col-sm-8">
                        <Input type="text" defaultValue="s"/>
                    </div>
                </div>
                 <div className="form-group">
                <label className="col-sm-3 control-label">VLAN</label>
                    <div className="col-sm-2">
                        <Input type="text" />
                    </div>
                </div>
                  <div className="form-group">
                <label className="col-sm-3 control-label">Prefix</label>
                    <div className="col-sm-2">
                        <Input type="text" />
                    </div>
                </div>
                 <div className="form-group">
                <label className="col-sm-3 control-label">Max. lease</label>
                    <div className="col-sm-2">
                        <Input type="text" />
                    </div>
                </div>
           </form>
        </div>)
    }
})

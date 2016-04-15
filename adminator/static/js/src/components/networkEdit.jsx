var NetworkEdit = React.createClass({

  mixins: [Reflux.connect(networkStore, 'data'),
           Reflux.connect(dhcpOptionsStore, 'options')],

  componentDidMount() {
    NetworkActions.read(this.props.params.id);
    DhcpOptionActions.list();
  },

  getInitialState() {
    this.state = {'data': {'network': {'dhcp_options': []}}, 'options': []}
    return this.state;
  },

  render() {
    return (
        <div>
            <AdminNavbar />
            <div className="col-xs-12 container">
            <h1>{this.state.data.network.description}</h1>
            <div className="row">
                <div className="col-xs-12 col-md-4">
                <h2>Basic settings</h2>
                    <div className="well">
                        <NetworkEditForm values={this.state.data.network} />
                    </div>
                </div>
                <div className="col-xs-12 col-md-4">
                <h2>DHCP options</h2>
                    <DhcpOptionValues values={this.state.data.network.dhcp_options}
                                      options={this.state.options}
                                      network={this.state.data.network.uuid} />
                </div>
                <div className="col-xs-12 col-md-4">
                <h2>IP pools</h2>
                    <IPPools values={this.state.data.network.pools}
                             network={this.state.data.network.uuid} />
                </div>

            </div>
            </div>
        </div>
    )
  }
});



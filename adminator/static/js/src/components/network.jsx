var Network = React.createClass({

    mixins: [Reflux.connect(dhcpOptionsStore, 'options')],

    componentDidMount() {
        DhcpOptionActions.list();
    },

    save() {
        var errors = [];

        var net = this.refs.network;
        var dhcp = this.refs.dhcp_options;
        var pools = this.refs.pools;

        errors = errors.concat(net.validate());

        if (errors.length > 0) {
            FeedbackActions.set('error', 'Form contains invalid data', errors);
        } else {
            var data = net.getValues();
            data['dhcp_options'] = dhcp.getValues();
            data['pools'] = pools.getValues();
            this.props.save_handler(data);
        }
    },

    getInitialState() {
        return {'network': {
                    'dhcp_options': [],
                    'pools': []},
                'options': []}
    },

    componentWillReceiveProps(p) {
        if (p) {
            this.setState({'network': p.network_data});
        }
    },

    render() {
        return (
        <div>
            <AdminNavbar />
            <div className="col-xs-12 container">
                <h1>{this.props.title}</h1>
                <Feedback />
                <div className="row">
                    <div className="col-xs-12 col-md-4">
                        <NetworkForm ref="network"
                                     values={this.state.network}
                                     saveHandler={this.save}/>
                    </div>

                    <div className="col-xs-12 col-md-4">
                        <IPPools ref="pools"
                                 values={this.state.network.pools}
                                 network={this.state.network.uuid} />
                    </div>

                    <div className="col-xs-12 col-md-4">
                        <DhcpOptionValues ref="dhcp_options"
                                          values={this.state.network.dhcp_options}
                                          options={this.state.options} />
                    </div>
                </div>
            </div>
        </div>
    )
  }
});



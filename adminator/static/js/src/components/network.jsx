var Network = React.createClass({

    mixins: [Reflux.connect(dhcpOptionsStore, 'options')],

    componentDidMount() {
        DhcpOptionActions.list();
    },

    validateData(data) {
        var errors = []
        if (!data['description']) {errors.push('Description is missing')};
        if (!data['vlan']) {errors.push('Vlan is missing')};
        if (!data['prefix4']) {errors.push('IPv4 prefix is missing')};
        if (!data['prefix6']) {errors.push('IPv6 prefix is missing')};
        return errors;
    },

    save() {
        var net = this.refs['network'].getValue();
        var data = {
            uuid: this.state.network['uuid'],
            vlan: net['vlan'],
            description: net['description'],
            max_lease: net['max_lease'],
            prefix4: net['prefix4'],
            prefix6: net['prefix6'],
            dhcp_options: this.refs.dhcp_options.getValues(),
            pools: this.refs.pools.getValues(),
        }
        // validate here
        this.props.save_handler(data);
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



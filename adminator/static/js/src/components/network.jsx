var Network = React.createClass({

    mixins: [Reflux.connect(dhcpOptionsStore, 'options')],

    componentDidMount() {
        DhcpOptionActions.list();
    },

    save() {
        var errors = [];

        var net = this.refs.network;
        var dhcp = this.refs.dhcp_options;
        var dhcp6 = this.refs.dhcp_options6;
        var pools = this.refs.pools;

        errors = errors.concat(net.validate());
        errors = errors.concat(dhcp.validate());
        errors = errors.concat(dhcp6.validate());
        errors = errors.concat(pools.validate());

        if (errors.length > 0) {
            FeedbackActions.set('error', 'Form contains invalid data', errors);
        } else {
            var data = net.getValues();
            data['dhcp_options'] = dhcp.getValues().concat(dhcp6.getValues());
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

        var options4 = _.pick(this.state.options, function(val) {
            return val.family == 'inet';
        });
        var options6 = _.pick(this.state.options, function(val) {
              return val.family == 'inet6';
        });

        var values4 = _.filter(this.state.network.dhcp_options, val => {
            return _.has(this.state.options, val.option) &&
                   this.state.options[val.option].family == 'inet';
        });
        var values6 = _.filter(this.state.network.dhcp_options, val => {
             return _.has(this.state.options, val.option) &&
                    this.state.options[val.option].family == 'inet6';
        });

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
                                          values={values4}
                                          options={options4}
                                          title="DHCP options"/>

                        <DhcpOptionValues ref="dhcp_options6"
                                          values={values6}
                                          options={options6}
                                          title="DHCP options v6"/>

                    </div>
                </div>
            </div>
        </div>
    )
  }
});



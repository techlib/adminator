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
            <h3>{this.state.data.network.description}</h3>

            <h2>DHCP options</h2>
            <DhcpOptionValues values={this.state.data.network.dhcp_options} 
                              options={this.state.options} 
                              network={this.state.data.network.uuid} />
        </div>

    )
  }
});



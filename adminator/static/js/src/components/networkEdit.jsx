var NetworkEdit = React.createClass({

  mixins: [Reflux.connect(networkStore, 'network')],

  componentDidMount() {
    NetworkActions.read(this.props.params.id);
  },

  save(data) {
      NetworkActions.update(data);
  },

  getInitialState() {
    return {network: {network: {}}}
  },

  render() {
      return (
          <Network
            title={this.state.network.network.description}
            save_handler={this.save}
            network_data={this.state.network.network}
             />
    )
  }
});



'use strict';

var NetworkEdit = React.createClass({
  displayName: 'NetworkEdit',

  mixins: [Reflux.connect(networkStore, 'network')],

  componentDidMount: function componentDidMount() {
    NetworkActions.read(this.props.params.id);
  },

  save: function save(data) {
    NetworkActions.update(data);
  },

  getInitialState: function getInitialState() {
    return { network: { network: {} } };
  },

  render: function render() {
    return React.createElement(Network, {
      title: this.state.network.network.description,
      save_handler: this.save,
      network_data: this.state.network.network
    });
  }
});
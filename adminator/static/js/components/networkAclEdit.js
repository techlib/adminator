'use strict';

var NetworkAclEdit = React.createClass({
  displayName: 'NetworkAclEdit',

  mixins: [Reflux.connect(networkAclStore, 'acl')],

  componentDidMount: function componentDidMount() {
    NetworkAclActions.read(this.props.params.id);
  },

  save: function save(data) {
    NetworkAclActions.update(this.props.params.id, data);
  },

  getInitialState: function getInitialState() {
    return { acl: { role: {} } };
  },

  render: function render() {
    return React.createElement(NetworkAcl, {
      title: this.props.params.id,
      role: this.state.acl.role,
      save_handler: this.save
    });
  }
});
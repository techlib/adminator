var NetworkAclEdit = React.createClass({

  mixins: [Reflux.connect(networkAclStore, 'acl')],

  componentDidMount() {
    NetworkAclActions.read(this.props.params.id);
  },

  save(data) {
      NetworkAclActions.update(this.props.params.id, data);
  },

  getInitialState() {
    return {acl: {role: {}}}
  },

  render() {
      return (
          <NetworkAcl
              title={this.props.params.id}
              role={this.state.acl.role}
              save_handler={this.save}
             />
    )
  }
});



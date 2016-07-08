let AclLink = React.createClass({
  render: function() {
      return <Link to={`/network/acl/${this.props.data}`}>
                {this.props.data}
             </Link>
  }
});

let AclActions = React.createClass({
    render() {
        return null
    }
})

var NetworkAclList = React.createClass({

  mixins: [Reflux.connect(networkStore, 'networks'),
		   Reflux.connect(networkAclStore, 'acl')],

  componentDidMount() {
    NetworkActions.list();
    NetworkAclActions.list();
  },

  getInitialState() {
    this.state = {'networks': {'list': []}, 'acl': {'list': []}}
    return this.state;
  },

  colMetadata: [
        {columnName: 'role', displayName: 'Role',
            customComponent: AclLink},
        {columnName: 'controls', displayName: '',
            customComponent: AclActions},
  ],

   render() {
    return (
        <div className='container-fluid col-xs-12'>
                <div className="row">
                    <div className="col-xs-12 col-sm-6">
                        <h1>Network ACL</h1>
                    </div>
                </div>
                <Feedback />

            <Griddle results={this.state.acl.list}
                tableClassName='table table-bordered table-striped table-hover'
                columnMetadata={this.colMetadata}
                useGriddleStyles={false}
                showFilter={true}
                showPager={false}
                columns={['role', 'controls']}
                initialSort="role"
            />
        </div>
         )
    }

})

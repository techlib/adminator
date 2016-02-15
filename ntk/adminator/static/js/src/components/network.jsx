let NetLink = React.createClass({
  render: function(){
    return  <Link to={`/network/${this.props.rowData.uuid}`}>
                {this.props.data}
            </Link>
  }
});

let NetActions = React.createClass({
    render() {
        return (
        <OverlayTrigger placement="top" overlay=<Tooltip>Delete</Tooltip>>
              <Button bsStyle="danger">
                <i className="fa fa-trash-o"></i>
              </Button>
        </OverlayTrigger>
        )
    }
})

var Network = React.createClass({

  mixins: [Reflux.connect(networkStore, 'data')],

  componentDidMount() {
    NetworkActions.list();
  },

  getInitialState() {
    this.state = {'data': {'list': [], 'network': {}}}
    return this.state;
  },

  colMetadata: [
        {columnName: 'description', displayName: 'Description',
            customComponent: NetLink},
        {columnName: 'vlan', displayName: 'VLAN'},
        {columnName: 'prefix', displayName: 'Prefix'},
        {columnName: 'max_lease', displayName: 'Max. lease'},
        {columnName: 'controls', displayName: 'Actions',
            customComponent: NetActions},
  ],

   render() {
    return (
    <div>
        <AdminNavbar />
        <div className="col-xs-12 container">
        <h3>Networks</h3>
            <Griddle results={this.state.data['list']}
                tableClassName='table table-striped table-hover'
                columnMetadata={this.colMetadata}
                useGriddleStyles={false}
                showFilter={true}
                columns={['description', 'vlan', 'prefix', 'max_lease', 'controls']}
                showPager={false}
            />
        </div>
    </div>
         )
   }
});


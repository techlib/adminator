let NetLink = React.createClass({
  render: function(){
    return  <Link to={`/network/${this.props.rowData.uuid}`}>
                {this.props.data}
            </Link>
  }
});

let NetActions = React.createClass({

    handleDelete() {
        NetworkActions.delete(this.props.rowData.uuid);
    },

    render() {
        var id = 'row' + this.props.rowData.uuid;
        return (
        <OverlayTrigger placement="top" overlay=<Tooltip id={id}>Delete</Tooltip>>
              <Button bsStyle="danger" onClick={this.handleDelete}>
                <i className="fa fa-trash-o"></i>
              </Button>
        </OverlayTrigger>
        )
    }
})

var NetworkList = React.createClass({

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
        {columnName: 'prefix4', displayName: 'Prefix IPv4'},
        {columnName: 'prefix6', displayName: 'Prefix IPv6'},
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
            <Feedback />
            <p><Link to='/dhcp/'>Global DHCP options</Link>
              <a className='btn btn-success pull-right' href='#/network/new'>
                  <i className='fa fa-plus'></i> New network
              </a>
            </p>
            <Griddle results={this.state.data['list']}
                tableClassName='table table-striped table-hover'
                columnMetadata={this.colMetadata}
                useGriddleStyles={false}
                showFilter={true}
                columns={['description', 'vlan', 'prefix4', 'prefix6', 
                          'max_lease', 'controls']}
                showPager={true}
                resultsPerPage="50"
                useCustomPagerComponent={true}
                customPagerComponent={Pager}
                initialSort="description"
            />
        </div>
    </div>
         )
   }
});


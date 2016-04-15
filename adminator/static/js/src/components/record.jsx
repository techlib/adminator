var RecordNameComponent = React.createClass({
  render() {
    return (
      <Link to={`/record/${this.props.rowData.id}`}>
        {this.props.data}
      </Link>
    )
  }
})



var RecordTypeComponent = React.createClass({
  render() {
    var className=''
    switch (this.props.data){
      case 'A':
        className='label label-a'
      break;
      case 'AAAA':
        className='label label-aaaa'
      break;
      case 'SOA':
        className='label label-soa'
      break;
      case 'MX':
        className='label label-mx'
      break;
      case 'CNAME':
        className='label label-cname'
      break;
      case 'SRV':
        className='label label-srv'
      break;
      case 'NS':
        className='label label-ns'
      break;
      case 'TXT':
        className='label label-txt'
      break;
      case 'PTR':
        className='label label-ptr'
      break;

    }
    return <span className={className}>{this.props.data}</span>
  }
})

var RecordActionsComponent = React.createClass({
  deleteRecord(){
    RecordActions.delete(this.props.rowData.id)
  },
  render() {
    return (
      <ButtonGroup>
        <OverlayTrigger placement="top" overlay=<Tooltip>Delete</Tooltip>>
          <Button bsStyle='danger' onClick={this.deleteRecord}>
            <i className="fa fa-trash-o"></i>
          </Button>
        </OverlayTrigger>
      </ButtonGroup>
    )
  }
})



var Record = React.createClass({
  mixins: [Reflux.connect(recordStore, 'data')],

  componentDidMount(){
    RecordActions.list()
  },

  getInitialState() {
    return {data: {records: []}}
  },

  render(){
    var columnMeta = [
      {
        columnName: 'type',
        displayName: 'Type',
        customComponent: RecordTypeComponent
      },{
        columnName: 'actions',
        displayName: 'Actions',
        customComponent: RecordActionsComponent
      },{
        columnName: 'name',
        displayName: 'Name',
        customComponent: RecordNameComponent
      }, {
        columnName: 'type',
        displayName: 'Type'
      }, {
        columnName: 'content',
        displayName: 'Content'
      }

    ]

    return (
      <div>
      <AdminNavbar/>
        <div className='col-xs-12 container'>
        <RecordCreate />
          <div className='container-fluid'>
            <h3>Records</h3>
            <Griddle results={this.state.data['list']}
                     tableClassName='datatable table table-striped table-hover table-bordered datatable'
                     useGriddleStyles={false}
                     showFilter={true}
                     useCustomPagerComponent='true'
                     customPagerComponent={Pager}
                     sortAscendingComponent={<span className='fa fa-sort-alpha-asc'></span>}
                     sortDescendingComponent={<span className='fa fa-sort-alpha-desc'></span>}
                     columns={['name', 'type','content', 'actions']}
                     resultsPerPage='20'
                     customFilter={regexGridFilter}
                     columnMetadata={columnMeta}
                     />
          </div>
        </div>
      </div>
    )
  },

});

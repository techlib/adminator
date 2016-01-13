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

var RecordIdComponent = React.createClass({
  deleteRecord(){
    RecordActions.delete(this.props.data)
  },
  render() {
    return (
      <ButtonGroup>
        <LinkContainer to={`/record/${this.props.data}`}>
          <OverlayTrigger placement="top" overlay=<Tooltip>Edit</Tooltip>>
            <Button className='btn-primary'><i className="fa fa-pencil-square-o"></i></Button>
          </OverlayTrigger>
        </LinkContainer>

        <OverlayTrigger placement="top" overlay=<Tooltip>Delete</Tooltip>>
          <Button className='btn-danger' onClick={this.deleteRecord}>
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
        customComponent: RecordTypeComponent
      },{
        columnName: 'id',
        customComponent: RecordIdComponent
      }
    ]

    return (
      <div>
      <AdminNavbar/>
        <RecordCreate />

        <div className='col-xs-12 container well'>
        <h3>Records</h3>
        <Griddle results={this.state.data['list']}
                 tableClassName='table table-striped table-hover'
                 useGriddleStyles={false}
                 showFilter={true}
                 useCustomPagerComponent='true'
                 customPagerComponent={Pager}
                 showSettings={true}
                 settingsToggleClassName='btn pull-right'
                 sortAscendingComponent={<span className='fa fa-sort-alpha-asc'></span>}
                 sortDescendingComponent={<span className='fa fa-sort-alpha-desc'></span>}
                 columns={['name', 'type','content', 'id']}
                 resultsPerPage='20'
                 customFilter={regexGridFilter}
                 columnMetadata={columnMeta}
                 />
        </div>
      </div>
    )
  },

});


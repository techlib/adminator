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
  mixins: [ModalConfirmMixin],

  handleDelete(){
    var name = this.props.rowData.name;
    var type = this.props.rowData.type;
      this.modalConfirm('Confirm delete', `Delete ${type} record ${name}?`,
                          {'confirmLabel': 'DELETE', 'confirmClass': 'danger'})
      .then(() => {
        RecordActions.delete(this.props.rowData.id)
      })

  },
  render() {
    return (
      <ButtonGroup>
        <OverlayTrigger placement="top" overlay=<Tooltip id={"recdelete" + this.props.rowData.id}>Delete</Tooltip>>
          <Button bsStyle='danger' onClick={this.handleDelete}>
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
    return {data: {records: []}, showNewForm: false}
  },

  showNewRecord() {
    this.setState({showNewForm: !this.state.showNewForm})
  },

  hideNewRecord() {
    this.setState({showNewForm: false})
  },

  getNewRecordForm() {
    if (this.state.showNewForm) {
        return <RecordCreate hideHandler={this.hideNewRecord}/>
    }
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
        <div className='col-xs-12 container-fluid'>
            <div className="row">
                <div className="col-xs-12 col-sm-10">
                    <h1>Records</h1>
                </div>
                <div className="col-xs-12 col-sm-2 h1 text-right">
                    <a className='btn btn-success' onClick={this.showNewRecord}>
                        <i className='fa fa-plus'></i> New record
                    </a>
                </div>
            </div>
            {this.getNewRecordForm()}
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
                     customFilterer={regexGridFilter}
                     useCustomFilterer='true'
                     columnMetadata={columnMeta}
                     />
          </div>
    )
  },

});


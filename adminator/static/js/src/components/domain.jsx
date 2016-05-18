
var DomainNameComponent = React.createClass({
  render() {
    return (
      <div>
          <Link to={`/domainEdit/${this.props.rowData.id}`}>
            {this.props.data}
          </Link>
      </div>
    )
  }
})


var DomainActionsComponent = React.createClass({

  mixins: [ModalConfirmMixin],

  handleDelete(){
        var name = this.props.rowData.name;
        this.modalConfirm('Confirm delete', `Delete ${name}?`,
                            {'confirmLabel': 'DELETE', 'confirmClass': 'danger'})
        .then(() => {
          DomainActions.delete(this.props.rowData.id)
        })
  },
  render() {
    return (
        <ButtonGroup>
          <LinkContainer to={`/domain/${this.props.rowData.id}`}>
            <OverlayTrigger placement="top" overlay=<Tooltip>Records</Tooltip>>
              <Button bsStyle='info'>
                <i className="fa fa-list-alt"></i>
              </Button>
            </OverlayTrigger>
          </LinkContainer>

            <OverlayTrigger placement="top" overlay=<Tooltip>Delete</Tooltip>>
              <Button bsStyle='danger' onClick={this.handleDelete}>
                <i className="fa fa-trash-o"></i>
              </Button>
            </OverlayTrigger>
        </ButtonGroup>
        )
  }
})

var Domain = React.createClass({

  mixins: [Reflux.connect(domainStore, 'data')],

  componentDidMount(){
    DomainActions.list()
  },

  getInitialState() {
    return {data: {list: []}}
  },


  getList(){
    var columnMeta = [
      {
        columnName: 'actions',
        displayName: 'Actions',
        customComponent: DomainActionsComponent
      },
      {
        columnName: 'name',
        displayName: 'Name',
        customComponent: DomainNameComponent
      }

    ]

     return (
       <div>
        <AdminNavbar/>
        <div className='col-xs-12'>
          <div className='container-fluid'>
            <h3>Domains</h3>
            <a className='btn btn-success pull-right' href='#/domainEdit/new'>
              <i className='fa fa-plus'></i> New domain
            </a>
            <Griddle results={this.state.data['list']}
                     tableClassName='table table-bordered table-striped table-hover'
                     useGriddleStyles={false}
                     showFilter={false}
                     useCustomPagerComponent='true'
                     customPagerComponent={Pager}
                     sortAscendingComponent={<span className='fa fa-sort-alpha-asc'></span>}
                     sortDescendingComponent={<span className='fa fa-sort-alpha-desc'></span>}
                     resultsPerPage='20'
                     columns={['name', 'actions']}
                     columnMetadata={columnMeta}
                     />
          </div>
        </div>
      </div>
    )
  },

  render() {
   return this.getList()
  }
});


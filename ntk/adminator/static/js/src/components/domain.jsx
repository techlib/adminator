var DomainIdComponent = React.createClass({
  deleteDomain(){
    DomainActions.delete(this.props.data)
  },
  render() {
    return (
        <ButtonGroup>
          <LinkContainer to={`/domain/${this.props.data}`}>
            <OverlayTrigger placement="top" overlay=<Tooltip>Records</Tooltip>>
              <Button className='btn-success'>
                <i className="fa fa-list-alt"></i>
              </Button>
            </OverlayTrigger>
          </LinkContainer>

          <LinkContainer to={`/domainEdit/${this.props.data}`}>
            <OverlayTrigger placement="top" overlay=<Tooltip>Edit</Tooltip>>
              <Button className='btn-primary'>
                <i className="fa fa-pencil-square-o"></i>
              </Button>
            </OverlayTrigger>
          </LinkContainer>

          <LinkContainer to={`/domainEdit/${this.props.data}`}>
            <OverlayTrigger placement="top" overlay=<Tooltip>Delete</Tooltip>>
              <Button className='btn-danger' onClick={this.deleteDomain}>
                <i className="fa fa-trash-o"></i>
              </Button>
            </OverlayTrigger>
          </LinkContainer>
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
        columnName: 'id',
         customComponent: DomainIdComponent
      }
    ]

     return (
       <div>
       <AdminNavbar/>

        <div className='col-xs-12 container well'>
        <h3>Domains</h3>
        <Griddle results={this.state.data['list']}
                 tableClassName='table table-striped table-hover'
                 useGriddleStyles={false}
                 showFilter={false}
                 useCustomPagerComponent='true'
                 customPagerComponent={Pager}
                 showSettings={true}
                 settingsToggleClassName='btn pull-right'
                 sortAscendingComponent={<span className='fa fa-sort-alpha-asc'></span>}
                 sortDescendingComponent={<span className='fa fa-sort-alpha-desc'></span>}
                 resultsPerPage='20'
                 columns={['name', 'id']}
                 changeFilter={this.setFilter}
                 columnMetadata={columnMeta}
                 />
        </div>
      </div>
    )
  },

  render() {
   return this.getList()
  }
});


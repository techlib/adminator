var DomainDetail = React.createClass({
  mixins: [Reflux.connect(domainStore, 'data')],

  componentDidMount(){
    let { id } = this.props.params
    DomainActions.read(id)
  },

  getInitialState() {
    return {data: {domain: {records: []}}}
  },

  getDetail(){
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
          <Griddle results={this.state.data['domain'].records} 
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

  render() {
   return this.getDetail()
  }
});


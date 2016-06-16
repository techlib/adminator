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
        displayName: 'Type',
        customComponent: RecordTypeComponent
      },{
        columnName: 'actions',
        displayName: '',
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
        <RecordCreate domain={this.props.params.id} />

        <div className='col-xs-12 container'>
          <h3>Records</h3>
          <Griddle results={this.state.data['domain'].records} 
                   tableClassName='table table-bordered table-striped table-hover'
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
      </div>

    )
  },

  render() {
   return this.getDetail()
  }
});


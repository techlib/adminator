var DomainDetail = React.createClass({
  mixins: [Reflux.connect(domainStore, 'data')],

  componentDidMount(){
    let { id } = this.props.params
    DomainActions.read(id)
  },

  getInitialState() {
    return {data: {domain: {records: []}}, showNewForm: false}
  },

	showNewRecord() {
		this.setState({showNewForm: !this.state.showNewForm})
    },

    hideNewRecord() {
		this.setState({showNewForm: false})
    },

	getNewRecordForm() {
	  if (this.state.showNewForm) {
         return (<RecordCreate domain={this.props.params.id}
						 	   hideHandler={this.hideNewRecord} />)
	  }
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
        <div className="col-xs-12 container-fluid">
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

    )
  },

  render() {
   return this.getDetail()
  }
});


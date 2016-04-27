var Lease4ActionsComponent = React.createClass({
  deleteLease4(){
    Lease4Actions.delete(this.props.rowData.id)
  },
  render() {
    return (
      <ButtonGroup>
        <OverlayTrigger placement="top" overlay=<Tooltip>Delete</Tooltip>>
          <Button bsStyle='danger' onClick={this.deleteLease4}>
            <i className="fa fa-trash-o"></i>
          </Button>
        </OverlayTrigger>
      </ButtonGroup>
    )
  }
})


var Lease6ActionsComponent = React.createClass({
  deleteLease6(){
    Lease6Actions.delete(this.props.rowData.id)
  },
  render() {
    return (
      <ButtonGroup>
        <OverlayTrigger placement="top" overlay=<Tooltip>Delete</Tooltip>>
          <Button bsStyle='danger' onClick={this.deleteLease6}>
            <i className="fa fa-trash-o"></i>
          </Button>
        </OverlayTrigger>
      </ButtonGroup>
    )
  }
})


var Lease = React.createClass({
  mixins: [Reflux.connect(lease4Store, 'lease4data'), Reflux.connect(lease6Store, 'lease6data')],

  componentDidMount(){
    Lease4Actions.list()
    Lease6Actions.list()
  },

  getInitialState() {
    return {lease4data: {}, lease6data: {}}
  },


  render(){
      return (
      <div>
      <AdminNavbar/>
        <div className='col-xs-12 container'>
          <div className='container-fluid'>

						<h3>Leases</h3>
						<ul className="nav nav-tabs" role="tablist">
							<li role="presentation" className="active"><a href="#ipv4" aria-controls="ipv4" role="tab" data-toggle="tab">IPv4</a></li>
							<li role="presentation"><a href="#ipv6" aria-controls="profile" role="ipv6" data-toggle="tab">IPv6</a></li>
						</ul>

						<div className="tab-content">
							<div role="tabpanel" className="tab-pane active" id="ipv4">
									<Griddle results={this.state.lease4data['list']}
													 tableClassName='datatable table table-striped table-hover table-bordered datatable'
													 useGriddleStyles={false}
													 showFilter={true}
													 useCustomPagerComponent='true'
													 customPagerComponent={Pager}
													 sortAscendingComponent={<span classNameName='fa fa-sort-alpha-asc'></span>}
													 sortDescendingComponent={<span classNameName='fa fa-sort-alpha-desc'></span>}
													 columns={['name', 'type','content', 'actions']}
													 resultsPerPage='20'
													 customFilterer={regexGridFilter}
													 useCustomFilterer='true'
													 />

							</div>
							<div role="tabpanel" className="tab-pane" id="ipv6">
								<Griddle results={this.state.lease6data['list']}
												 tableClassName='datatable table table-striped table-hover table-bordered datatable'
												 useGriddleStyles={false}
												 showFilter={true}
												 useCustomPagerComponent='true'
												 customPagerComponent={Pager}
												 sortAscendingComponent={<span classNameName='fa fa-sort-alpha-asc'></span>}
												 sortDescendingComponent={<span classNameName='fa fa-sort-alpha-desc'></span>}
												 columns={['name', 'type','content', 'actions']}
												 resultsPerPage='20'
												 customFilterer={regexGridFilter}
												 useCustomFilterer='true'
												 />
							</div>
						</div>
          </div>
        </div>
      </div>
    )
  },

})

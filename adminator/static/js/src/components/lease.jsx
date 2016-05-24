var Lease4ActionsComponent = React.createClass({
  deleteLease4(){
    Lease4Actions.delete(this.props.rowData.address)
  },
  render() {
    return (
      <ButtonGroup>
        <OverlayTrigger placement="top" overlay=<Tooltip id={this.props.rowData.address}>Delete</Tooltip>>
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
    Lease6Actions.delete(this.props.rowData.address)
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
    var lease4ColumnMeta = [
      {
        columnName: 'actions',
        displayName: 'Actions',
        customComponent: Lease4ActionsComponent
      },
      {
        columnName: 'address',
        displayName: 'IP',
      },
      {
        columnName: 'hwaddr',
        displayName: 'MAC',
      },
      {
        columnName: 'expire',
        displayName: 'Expire',
      },
      {
        columnName: 'valid_lifetime',
        displayName: 'Valid lifetime',
      },
      {
        columnName: 'state',
        displayName: 'State'
      },
      {
        columnName: 'hostname',
        displayName: 'Hostname',
      }
    ]
  var lease6ColumnMeta = [
      {
        columnName: 'actions',
        displayName: 'Actions',
        customComponent: Lease6ActionsComponent
      },
 			{
				columnName: 'address',
				displayName: 'IP'
			},
      {
        columnName: 'hwaddr',
        displayName: 'MAC',
      },
      {
        columnName: 'expire',
        displayName: 'Expire',
      },
      {
        columnName: 'valid_lifetime',
        displayName: 'Valid lifetime',
      },
      {
        columnName: 'state',
        displayName: 'State'
      },
      {
        columnName: 'hostname',
        displayName: 'Hostname',
      }
    ]



      return (
        <div className='col-xs-12 container-fluid'>

						<h1>Leases</h1>
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
													 resultsPerPage='20'
													 customFilterer={regexGridFilter}
													 useCustomFilterer='true'
													 columns={['address', 'hwaddr', 'expire', 'valid_lifetime', 'state', 'hostname', 'actions']}
													 columnMetadata={lease4ColumnMeta}
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
												 resultsPerPage='20'
												 customFilterer={regexGridFilter}
												 useCustomFilterer='true'
												 columns={['address', 'hwaddr', 'expire', 'valid_lifetime', 'state', 'hostname', 'actions']}
                         columnMetadata={lease6ColumnMeta}
												 />
							</div>
						</div>
          </div>
    )
  },

})

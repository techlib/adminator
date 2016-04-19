var DeviceDescComponent = React.createClass({
  render() {
    return (
      <Link to={`/device/${this.props.rowData.uuid}`}>
        {this.props.data}
      </Link>
    )
  }
})

var DeviceActionsComponent = React.createClass({
  deleteDevice(){
    DeviceActions.delete(this.props.rowData.uuid)
  },
  render() {
    return (
      <ButtonGroup>
        <OverlayTrigger placement="top" overlay=<Tooltip>Delete</Tooltip>>
          <Button bsStyle='danger' onClick={this.deleteDevice}>
            <i className="fa fa-trash-o"></i>
          </Button>
        </OverlayTrigger>
      </ButtonGroup>
    )
  }
})

var DeviceInterfacesComponent = React.createClass({
  render(){
    return <div>
      {this.props.data.map((item) => {
        return (
          <div>
            <OverlayTrigger placement="right" overlay=
              <Tooltip>
                {item.hostname? item.hostname: 'No hostname'} <br/> 
                {item.ip4addr? item.ip4addr: 'Dynamic IPv4'} <br/> 
                {item.ip6addr? item.ip6addr: 'Dynamic IPv6'}
              </Tooltip>>
                <span className='label label-warning'>
                  {item.macaddr}
                </span>
            </OverlayTrigger>
          </div>
          )
        }
      )}
    </div>
  }

})

var DeviceValidComponent = React.createClass({
  getInitialState() {
   if (this.props.data == null){
     return {'start': '', 'end': ''}
   }
   if (this.props.data[0] != null) {
      var start = moment(this.props.data[0]).format('DD. MM. YYYY')
   }
   if (this.props.data[1] != null) {
      var end = moment(this.props.data[1]).format('DD. MM. YYYY')
   }
    return {'start': start, 'end': end}
  },
  render() {
    return (
        <div>
          <div>
            <span className='label label-primary'>
              {this.state.start}
            </span>
            <span className='label label-success'>
              {this.state.end}
            </span>
          </div>
        </div>
    )
  }
})

var DeviceUserComponent = React.createClass({
  getInitialState() {
   if (this.props.data == null){
    return {}
   } else {
    return {'id': this.props.data, 'name':this.props.rowData.users.display_name}
   }
   this.props.rowData
  },
  render() {
    return (
        <div>
          <OverlayTrigger placement="left" overlay=<Tooltip>{this.state.id}</Tooltip>>
            <div>
              {this.state.name}
            </div>
          </OverlayTrigger>
        </div>
    )
  }
})


var Device = React.createClass({
  mixins: [Reflux.connect(deviceStore, 'data')],

  componentDidMount(){
    DeviceActions.list()
  },

  getInitialState() {
    return {data: {list: []}}
  },


  render() {
    var columnMeta = [
      {
        columnName: 'actions',
        displayName: 'Actions',
        customComponent: DeviceActionsComponent
      },
      {
        columnName: 'description',
        displayName: 'Description',
        customComponent: DeviceDescComponent
      },
      {
        columnName: 'valid',
        displayName: 'Valid',
        customComponent: DeviceValidComponent
      },
      {
        columnName: 'user',
        displayName: 'User',
        customComponent: DeviceUserComponent
      },
      {
        columnName: 'type',
        displayName: 'Type'
      },
      {
        columnName: 'interfaces',
        displayName: 'Interfaces',
        customComponent: DeviceInterfacesComponent
      }
    ]

    return (
      <div>
        <AdminNavbar/>
        <div className='col-xs-12'>
          <div className='container-fluid'>
            <h3>Devices</h3>
            <a className='btn btn-success pull-right' href='#/device/new'>
              <i className='fa fa-plus'></i> New device
            </a>
          </div>
          <div className='container-fluid'>

            <Griddle results={this.state.data.list}
                     tableClassName='table table-bordered table-striped table-hover'
                     useGriddleStyles={false}
                     showFilter={true}
                     useCustomPagerComponent='true'
                     customPagerComponent={Pager}
                     sortAscendingComponent={<span className='fa fa-sort-alpha-asc'></span>}
                     sortDescendingComponent={<span className='fa fa-sort-alpha-desc'></span>}
                     columns={['interfaces', 'description', 'type', 'user', 'valid', 'actions']}
                     resultsPerPage='20'
                     customFilterer={regexGridFilter}
                     useCustomFilterer='true'
                     columnMetadata={columnMeta}
                     />
          </div>
        </div>
      </div>
    )
  }
});


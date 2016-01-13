var DeviceIdComponent = React.createClass({
  deleteDevice(){
    DeviceActions.delete(this.props.data)
  },
  render() {
    return (
      <ButtonGroup>
        <LinkContainer to={`/device/${this.props.data}`}>
          <OverlayTrigger placement="top" overlay=<Tooltip>Edit</Tooltip>>
            <Button className='btn-primary'><i className="fa fa-pencil-square-o"></i></Button>
          </OverlayTrigger>
        </LinkContainer>

        <OverlayTrigger placement="top" overlay=<Tooltip>Delete</Tooltip>>
          <Button className='btn-danger' onClick={this.deleteDevice}>
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
            <LinkContainer to={`/interfaces/${item.uuid}`}>
              <OverlayTrigger placement="left" overlay=<Tooltip>{item.hostname} <br/> {item.ip4addr} <br/> {item.ip6addr}</Tooltip>>
                <a>{item.macaddr}</a>
              </OverlayTrigger>
            </LinkContainer>
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
        columnName: 'uuid',
        customComponent: DeviceIdComponent
      },
      {
        columnName: 'valid',
        customComponent: DeviceValidComponent
      },
      {
        columnName: 'user',
        customComponent: DeviceUserComponent
      },
      {
        columnName: 'interfaces',
        customComponent: DeviceInterfacesComponent
      }
    ]

    return (
      <div>
        <AdminNavbar/>
        <div className='col-xs-12 container well'>
        <h3>Devices</h3>
        <Griddle results={this.state.data.list}
                 tableClassName='table table-striped table-hover'
                 useGriddleStyles={false}
                 showFilter={true}
                 useCustomPagerComponent='true'
                 customPagerComponent={Pager}
                 showSettings={true}
                 settingsToggleClassName='btn pull-right'
                 sortAscendingComponent={<span className='fa fa-sort-alpha-asc'></span>}
                 sortDescendingComponent={<span className='fa fa-sort-alpha-desc'></span>}
                 columns={['interfaces', 'description', 'type', 'user', 'valid', 'uuid']}
                 resultsPerPage='20'
                 customFilter={regexGridFilter}
                 columnMetadata={columnMeta}
                 />
        </div>
      </div>
    )
  }
});


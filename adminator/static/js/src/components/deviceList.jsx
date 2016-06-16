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

    mixins: [ModalConfirmMixin],

    deleteDevice(){
        var name = this.props.rowData.description;
        this.modalConfirm('Confirm delete', `Delete ${name}?`,
                            {'confirmLabel': 'DELETE', 'confirmClass': 'danger'})
        .then(() => {
            DeviceActions.delete(this.props.rowData.uuid)
    })

  },
  render() {
    return (
      <ButtonGroup>
        <OverlayTrigger placement="top" overlay=<Tooltip id={this.props.rowData.uuid}>Delete</Tooltip>>
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
          <div key={item.uuid}>
            <OverlayTrigger placement="right" overlay=
              <Tooltip id={item.uuid}>
                {item.hostname? item.hostname: 'No hostname'} <br/> 
                {item.ip4addr? item.ip4addr: 'Dynamic IPv4'} <br/> 
                {item.ip6addr? item.ip6addr: 'Dynamic IPv6'}
              </Tooltip>>
                <code>
                  {item.macaddr}
                </code>
            </OverlayTrigger>
          </div>
          )
        }
      )}
    </div>
  }

})

var DeviceValidComponent = React.createClass({
  render() {
    if (this.props.rowData.type != 'visitor') {
        return null
    }

    var unlimited = <code>unlimited</code>

    var start = (this.props.data[0])
        ? moment(this.props.data[0]).format('DD. MM. YYYY')
        : unlimited

    var end = (this.props.data[1])
        ? moment(this.props.data[1]).format('DD. MM. YYYY')
        : unlimited

    return <span>{start} - {end}</span>
  }
})

var DeviceUserComponent = React.createClass({
  render() {
    var name = (this.props.rowData.user) ? this.props.rowData.users.display_name : ''
    var id = (this.props.rowData.user) ? this.props.rowData.user : ''
    var enabled = (this.props.rowData.user) ? this.props.rowData.users.enabled : false
    return (
        <div>
          <OverlayTrigger placement="left" overlay=<Tooltip id={42}>{id}</Tooltip>>
            <div>
              {name}
            </div>
          </OverlayTrigger>
        </div>
    )
  }
})


var DeviceList = React.createClass({
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

    var rowMetadata = {
        "bodyCssClassName": function(rowData) {
            var isExpired = (rowData.type == 'visitor') &&
                moment(rowData.valid[1]).isBefore()

            if ((rowData.users && !rowData.users.enabled) || isExpired) {
                return "warning";
            }
            return "default-row";
        }
    };

    return (
        <div className='container-fluid col-xs-12'>
            <div className="row">
                <div className="col-xs-12 col-sm-10">
                    <h1>Devices</h1>
                </div>
                <div className="col-xs-12 col-sm-2 h1 text-right">
                    <a className='btn btn-success' href='#/device/new'>
                    <i className='fa fa-plus'></i> New device
                    </a>
                </div>
            </div>
              <Feedback />
            <Griddle results={this.state.data.list}
                     tableClassName='table table-bordered table-striped table-hover'
                     useGriddleStyles={false}
                     showFilter={true}
                     rowMetadata={rowMetadata}
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
    )
  }
});


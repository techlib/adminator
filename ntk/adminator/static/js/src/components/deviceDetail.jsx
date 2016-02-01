var DateRangePicker = React.createClass({

  componentWillReceiveProps(){
     if(this.props.range){
       this.setState({range: this.props.range})
     }
  },

  handleValidSince(since){
     this.state.range[0] = since
     this.setState({range: this.state.range})
  },

  handleValidUntil(until){
     this.state.range[1] = until
     this.setState({range: this.state.range})
  },

  getInitialState(){
    return {range: [
      moment().format('YYYY-MM-DDTHH:mm:ss'),
      moment().add(1, 'y').format('YYYY-MM-DDTHH:mm:ss')
    ]}
  },

  render(){
   return (
      <div>
       <label>Valid since</label>
       <DateTimeField
         ref='valid_since'
         format='YYYY-MM-DDTHH:mm:ss'
         inputFormat='DD.MM.YYYY HH:mm'
         maxDate={moment(this.state.range[1])}
         onChange={this.handleValidSince}
         dateTime={this.state.range[0]} />

       <label>Valid until</label>
       <DateTimeField
         ref='valid_until'
         onChange={this.handleValidUntil}
         format='YYYY-MM-DDTHH:mm:ss'
         inputFormat='DD.MM.YYYY HH:mm'
         minDate={moment(this.state.range[0])}
         dateTime={this.state.range[1]} />
       </div>
    )
  }
})

var InterfaceForm = React.createClass({

  mixins: [Reflux.connect(interfaceStore, 'data')],

  componentDidMount(){
    let { uuid } = this.props.item
    this.setState({item: this.props.item})
  },

  getInitialState() {
    return {item: {macaddr:'', hostname:'', ip4addr:'', ip6addr:'', network:''}}
  },

  handleChange(){
    for (var key in this.refs){
      this.state.item[key] = this.refs[key].getValue()
    }
    this.setState({item: this.state.item})
  },

  render() {
    return (
             <div>
              <Input
                type='text'
                label='MAC'
                ref='macaddr'
                value={this.state.item.macaddr}
                onChange={this.handleChange} />
              <Input
                type='text'
                label='Hostname'
                ref='hostname'
                value={this.state.item.hostname}
                onChange={this.handleChange} />
              <Input
                type='text'
                label='IPv4 address'
                ref='ip4addr'
                value={this.state.item.ip4addr}
                onChange={this.handleChange} />
               <Input
                type='text'
                label='IPv6 address'
                ref='ip6addr'
                value={this.state.item.ip6addr}
                onChange={this.handleChange} />
               <Input
                type='select'
                label='Network'
                ref='network'
                value={this.state.item.network}
                onChange={this.handleChange}>
                  {this.props.networks.list.map((network) => {
                    return <option value={network.uuid}>{network.description} (VLAN {network.vlan})</option>
                  })}
               </Input>
              </div>
      )
  }
})


var DeviceDetail = React.createClass({
  mixins: [Reflux.connect(deviceStore, 'data'), Reflux.connect(networkStore, 'networks'), Reflux.connect(userStore, 'users')],

  componentDidMount(){
    let { id } = this.props.params
    DeviceActions.read(id)
    NetworkActions.list()
    UserActions.list()
  },

  getInitialState() {
    return {
      data: {
        device: {
          interfaces: [],
          valid: null,
          type: 'visitor'
        }
      },
      networks: {
        list: []
      },
      users: {
        list: []
      },
      createInterfaces:[],
      deleteInterfaces: [],
      alerts: []
    }
  },


  addInterface(event) {
    var newState = this.state.createInterfaces.concat([{'device': this.state.data.device.uuid}])
    this.setState({createInterfaces: newState})
  },

  removeInterface(item) {
    var newInterfaces = this.state.data.device.interfaces.filter(el => {
      return el.uuid !== item.uuid
    })
    this.state.data.device.interfaces = newInterfaces
    this.state.deleteInterfaces = this.state.deleteInterfaces.concat([item.uuid])
    this.setState({
      deleteInterfaces: this.state.deleteInterfaces,
      data: this.state.data
    })
  },

  removeInterfaceToAdd(key) {
    this.state.createInterfaces.splice(key-1, 1)
    this.setState({createInterfaces: this.state.createInterfaces})
  },


  handleUpdate(){

    DeviceActions.update(_.compact(this.state.data.device))

    this.state.data.device.interfaces.map((item) => {
      InterfaceActions.update(_.compact(item))
    })

    this.state.createInterfaces.map((item) => {
      InterfaceActions.create(_.compact(item))
    })

    this.state.deleteInterfaces.map((item) => {
      InterfaceActions.delete(_.compact(item))
    })
  },

  handleSave(){
    this.setState({alerts: this.state.alerts.concat([new SuccessAlert('Device updated')])})
    this.handleUpdate()
    // TODO Handle create
  },

  handleChange(){
   var device = {
    uuid: this.state.data.device.uuid,
    description: this.refs.description.getValue(),
    type: this.refs.type.getValue(),
    user: this.state.data.device.user,
    valid: this.state.data.device.valid,
    interfaces: this.state.data.device.interfaces
   }
   this.setState({data:{device: device}})
  },

  getDisplayOption(option, index){
    return option.display_name
  },

  setUser(value){
    this.state.data.device.user = value.cn
    // TODO Remove this
    this.forceUpdate()
  },

  getUser(cn){
    return this.state.users.list.filter(el => {
      return el.cn == cn
    })
  },

  render() {
    var display_name = (this.getUser(this.state.data.device.user)[0] || {'display_name': ''}).display_name
    if(this.state.data.device.type == 'staff'){
      this.state.data.device.valid = null
    }
    else if(this.state.data.device.type == 'device'){
      this.state.data.device.user = null
      this.state.data.device.valid = null
    }
    else if(this.state.data.device.type == 'visitor'){
      this.state.data.device.user = null
    }

    return (
        <div>
          <AlertSet alerts={this.state.alerts} />
          <AdminNavbar/>

          <div className='col-sm-6 col-xs-12'>
            <h3>Details</h3>
            <div className='well'>
            <Input
              type='text'
              ref='description'
              label='Description'
              onChange={this.handleChange}
              value={this.state.data.device.description} />
            <Input
              type='select'
              ref='type'
              label='Type'
              onChange={this.handleChange}
              value={this.state.data.device.type}>
                <option value='visitor'>Visitor</option>
                <option value='staff'>Staff</option>
                <option value='device'>Device</option>
             </Input>
            {() => {
              if(this.state.data.device.type == 'staff'){
                return (
                  <div className='form-group'>
                    <label>User ({(display_name)})</label>
                    <Typeahead
                      filterOption='display_name'
                      displayOption={this.getDisplayOption}
                      placeholder='Type to select user'
                      options={this.state.users.list}
                      onOptionSelected={this.setUser}
                      customClasses={
                        {'input'   : 'form-control',
                         'results' : 'list-group',
                         'listItem': 'list-group-item'
                        }
                      }
                    />
                  </div>
                )}}()
            }
            {() => {
              if(this.state.data.device.type == 'visitor'){
                return (
                    <DateRangePicker range={this.state.data.device.valid} />
                )}}()
            }

            </div>
          <Button className='btn-primary' onClick={this.handleSave}>Save</Button>
        </div>

        <div className='col-sm-6 col-xs-12'>
          <h3>Interfaces</h3>
          {this.state.data.device.interfaces.map((item) => {
            return (
              <div className='well'>
                <InterfaceForm networks={this.state.networks} item={item} />
                <Button className='btn-danger'
                  onClick={this.removeInterface.bind(this, item)} value={item}>
                    <i className="fa fa-trash-o"></i>
                  </Button>
              </div>
                )
            }
          )}

          {this.state.createInterfaces.map((item, key) => {
            return (
              <div className='well'>
                <InterfaceForm networks={this.state.networks} item={item} />
                <Button className='btn-danger'
                  onClick={this.removeInterfaceToAdd.bind(this, key)} value={key}>
                    <i className="fa fa-trash-o"></i>
                  </Button>
              </div>
              )
            }
          )}

          <Button className='btn-success'
            onClick={this.addInterface}>
                <i className="fa fa-plus"></i>
          </Button>

        </div>
      </div>
    )
  }
});


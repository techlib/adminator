var InterfaceForm = React.createClass({

  mixins: [Reflux.connect(interfaceStore, 'data')],

  componentDidMount(){
    let { uuid } = this.props.item;
    InterfaceActions.read(uuid)
  },

  getInitialState() {
    return {data: {interface: {}}}
  },


  render() {
    return (
             <div className='well'>
              <Input
                type='text'
                label='MAC'
                value={this.props.item.macaddr}
                onChange={this.handleChange} />
              <Input
                type='text'
                label='Hostname'
                value={this.props.item.hostname}
                onChange={this.handleChange} />
              <Input
                type='text'
                label='IPv4 address'
                value={this.props.item.ip4addr}
                onChange={this.handleChange} />
               <Input
                type='text'
                label='IPv6 address'
                value={this.props.item.ip6addr}
                onChange={this.handleChange} />
               <Input
                type='select'
                label='Network'
                ref='network'
                value={this.props.item.network}
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
  mixins: [Reflux.connect(deviceStore, 'data'), Reflux.connect(networkStore, 'networks')],

  componentDidMount(){
    let { id } = this.props.params
    DeviceActions.read(id)
    NetworkActions.list()
  },

  getInitialState() {
    return {data: {device: {interfaces: []}}, networks: {list: []}, alerts: []}
  },


  render() {
    return (
        <div>
          <AlertSet alerts={this.state.alerts} />
          <AdminNavbar/>

        <div className='col-sm-6 col-xs-12'>
          <h3>Details</h3>
          <div className='well'>
          <Input
            type='text'
            label='Description'
            onChange={this.handleChange}
            value={this.state.data.device.description} />
          <Input
            type='text'
            label='Type'
            onChange={this.handleChange}
            value={this.state.data.device.type} />
           <Input
            type='text'
            label='User'
            onChange={this.handleChange}
            value={this.state.data.device.user} />
           <Input
            type='text'
            label='Valid'
            onChange={this.handleChange}
            value={this.state.data.device.valid} />
          </div>
        </div>

        <div className='col-sm-6 col-xs-12'>
          <h3>Interfaces</h3>
          {this.state.data.device.interfaces.map((item) => {
            return (
                <InterfaceForm networks={this.state.networks} item={item} />
                )
            }
          )}
          </div>
        </div>
    )
  }
});


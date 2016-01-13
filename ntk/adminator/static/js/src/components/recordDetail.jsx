var RecordDetail = React.createClass({
  mixins: [Reflux.connect(recordStore, 'data')],

  componentDidMount(){
    let { id } = this.props.params
    RecordActions.read(id)
  },

  getInitialState() {
    return {data: {record: {type: ''}}, alerts: []}
  },

  handleChange(){
    this.setState({data: {record: {
        name: this.refs.name.getValue(),
        content: this.refs.content.getValue(),
        type: this.state.data.record.type,
        domain_id: this.state.data.record.domain_id,
        id: this.state.data.record.id
      }
    }})
  },

  handleSrvChange(){
    let content = this.refs.priority.getValue() + ' ' + this.refs.port.getValue() + ' ' + this.refs.value.getValue()
    this.setState({data: {record: {
        id: this.state.data.record.id,
        name: this.refs.name.getValue(),
        content: content,
        type: this.state.data.record.type,
        domain_id: this.state.data.record.domain_id
      }
    }})
  },

  handleSubmit(){
    RecordActions.update(this.state.data.record);
    this.setState({alerts: this.state.alerts.concat([new SuccessAlert('Record updated')])});
  },


  renderInput() {
     switch (this.state.data.record.type){
      case 'A':
      case 'AAAA':
      case 'CNAME':
      case 'MX':
      case 'PTR':
      case 'NS':
      case 'SOA':
      return (
        <div className='form-group'>
          <div className='col-xs-8 col-sm-4'>
            <Input
              type='text'
              label='Name'
              ref='name'
              onChange={this.handleChange}
              value={this.state.data.record.name} />
          </div>
          <div className='col-xs-8 col-sm-4'>
            <Input
              type='text'
              label='Value'
              ref='content'
              onChange={this.handleChange}
              value={this.state.data.record.content} />
          </div>
        </div>
      )
      case 'SRV':
      let [priority, port, value] = this.state.data.record.content.split(' ')
      return (
        <div className='form-group'>
          <div className='col-xs-8 col-sm-4'>
            <Input
              type='text'
              label='Name'
              ref='name'
              onChange={this.handleSrvChange}
              value={this.state.data.record.name} />
          </div>
          <div className='col-xs-4 col-sm-2'>
            <Input
              type='text'
              label='Priority'
              ref='priority'
              onChange={this.handleSrvChange}
              value={priority} />
          </div>
          <div className='col-xs-4 col-sm-2'>
            <Input
              type='text'
              label='Port'
              ref='port'
              onChange={this.handleSrvChange}
              value={port} />
          </div>
          <div className='col-xs-8 col-sm-4'>
            <Input
              type='text'
              label='Value'
              ref='value'
              onChange={this.handleSrvChange}
              value={value} />
          </div>
        </div>
      )
      break;
      case 'TXT':
      return (
          <div className='form-group'>
            <div className='col-xs-4'>
              <Input
                type='text'
                label='Name'
                ref='name'
                onChange={this.handleChange}
                value={this.state.data.record.name} />
            </div>
            <div className='col-xs-8'>
              <Input
                type='textarea'
                ref='content'
                label='Content'
                onChange={this.handleChange}
                value={this.state.data.record.content} />
            </div>
          </div>
        )
      break;
    }
  },

  render(){
   return (
     <div>
     <AlertSet alerts={this.state.alerts} />
        <AdminNavbar/>
        <h3>Record</h3>
        <div className='well col-xs-12'>
          <form onSubmit={this.handleSubmit}>
            <div className='col-xs-2 col-sm-1'>
              <label>Type</label>
              <span className={'label label-record label-'+this.state.data.record.type.toLowerCase()}>
               {this.state.data.record.type}
              </span>
            </div>
            <div className='col-xs-10 col-sm-11'>
              {this.renderInput()}
            </div>
            <div className='col-xs-10 col-sm-11 col-sm-offset-1'>
              <div className='col-xs-8 col-sm-4'>
                <ButtonInput type="submit" className='btn-primary' value="Save" />
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  },
})


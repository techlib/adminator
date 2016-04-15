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
            <Input
              type='text'
              label='Name'
              labelClassName='col-xs-2'
              wrapperClassName='col-xs-8'
              ref='name'
              onChange={this.handleChange}
              value={this.state.data.record.name} />
            <Input
              type='text'
              label='Value'
              labelClassName='col-xs-2'
              wrapperClassName='col-xs-8'
              ref='content'
              onChange={this.handleChange}
              value={this.state.data.record.content} />
        </div>
      )
      case 'SRV':
      let [priority, port, value] = this.state.data.record.content.split(' ')
      return (
        <div className='form-group'>
            <Input
              type='text'
              label='Name'
              labelClassName='col-xs-2'
              wrapperClassName='col-xs-8'
              ref='name'
              onChange={this.handleSrvChange}
              value={this.state.data.record.name} />
            <Input
              type='text'
              label='Priority'
              labelClassName='col-xs-2'
              wrapperClassName='col-xs-8'
              ref='priority'
              onChange={this.handleSrvChange}
              value={priority} />
            <Input
              type='text'
              label='Port'
              labelClassName='col-xs-2'
              wrapperClassName='col-xs-8'
              ref='port'
              onChange={this.handleSrvChange}
              value={port} />
            <Input
              type='text'
              label='Value'
              labelClassName='col-xs-2'
              wrapperClassName='col-xs-8'
              ref='value'
              onChange={this.handleSrvChange}
              value={value} />
        </div>
      )
      break;
      case 'TXT':
      return (
          <div className='form-group'>
              <Input
                type='text'
                label='Name'
                labelClassName='col-xs-2'
                wrapperClassName='col-xs-8'
                ref='name'
                onChange={this.handleChange}
                value={this.state.data.record.name} />
              <Input
                type='textarea'
                ref='content'
                label='Content'
                labelClassName='col-xs-2'
                wrapperClassName='col-xs-8'
                onChange={this.handleChange}
                value={this.state.data.record.content} />
          </div>
        )
      break;
    }
  },

  render(){
   return (
    <div>
      <AdminNavbar/>
      <div className='container'>
        <AlertSet alerts={this.state.alerts} />
        <h3>Record</h3>
        <div className='well'>
          <form className='form-horizontal' onSubmit={this.handleSubmit}>
            <div className='form-group'>
              <div className='form-group'>
                <label className='control-label col-xs-2'>
                  Type
                </label>
                <div className='col-xs-8'>
                  <span className={'label label-record label-'+this.state.data.record.type.toLowerCase()}>
                   {this.state.data.record.type}
                  </span>
                </div>
              </div>
            </div>
            {this.renderInput()}
            <ButtonInput type="submit" className='col-xs-offset-2 btn-primary' value="Save" />
          </form>
        </div>
      </div>
    </div>
    )
  },
})


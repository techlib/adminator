var RecordCreate = React.createClass({
  mixins: [Reflux.connect(domainStore, 'data'), Reflux.listenTo(domainStore,'onDomainStoreChange')],

  componentDidMount(){
    DomainActions.list()
  },

  onDomainStoreChange(data){
    this.state.record.domain_id = _.first(data.list).id
    this.state.domainName = _.first(data.list).name
    this.setState(this.state)
  },

  getInitialState() {
    return {record: {type: ''}, alerts: [], data: {list: []}, domainName: ''}
  },

  setType(type){
    if(type == 'SRV'){
      this.state.record.content = {port: '', prio: '', value: ''}
    } else {
      this.state.record.content = null
    }
    this.state.record.type = type
    this.setState({record: this.state.record})
  },

  handleSrvChange(e){
    this.state.record.content[e.target.name] = e.target.value
    this.setState({record: this.state.record})
  },

  handleDomainChange(e){
    _.map(e.target.children, ((node) => {
      if(e.target.value == node.value){
        this.state.domainName = node.dataset.name
      }
    }))
    this.state.record.domain_id = e.target.value
    this.setState({domainName: this.state.domainName, record: this.state.record})
  },

  handleChange(e){
    this.state.record[e.target.name] = e.target.value
    if(e.target.name == 'prio'){
      this.state.record.priority = (_.isUndefined(e.target.value) ? 0 : e.target.value)
    }
  },

  handleSubmit(e){
    e.preventDefault();
    // Append selected domain name if not present
    if(this.state.record.name.indexOf(this.state.domainName) < 0){
      this.state.record.name = this.state.record.name + '.' + this.state.domainName
    }
    if (this.state.record.type == 'SRV'){
      this.state.record.content = this.state.record.content.prio + ' ' + this.state.record.content.port + ' ' + this.state.record.value
    }
    RecordActions.create(this.state.record);
    this.setState({alerts: this.state.alerts.concat([new SuccessAlert('Record created')])});
  },


  renderInput() {
     switch (this.state.record.type){
      case 'A':
      case 'AAAA':
      case 'CNAME':
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
              name='name'
              required
              onChange={this.handleChange}
              value={this.state.record.name} />
          </div>
          <div className='col-xs-8 col-sm-4'>
            <Input
              type='text'
              label='Value'
              ref='content'
              required
              name='content'
              onChange={this.handleChange}
              value={this.state.record.content} />
          </div>
        </div>
      )
      case 'MX':
      return (
        <div className='form-group'>
          <div className='col-xs-8 col-sm-4'>
            <Input
              type='text'
              label='Name'
              ref='name'
              name='name'
              required
              onChange={this.handleChange}
              value={this.state.record.name} />
          </div>
          <div className='col-xs-4 col-sm-2'>
            <Input
              type='number'
              label='Priority'
              ref='prio'
              name='prio'
              required
              max='200'
              min='0'
              onChange={this.handleChange}
              value={this.state.record.prio} />
          </div>
          <div className='col-xs-8 col-sm-4'>
            <Input
              type='text'
              label='Value'
              ref='content'
              name='content'
              required
              onChange={this.handleChange}
              value={this.state.record.content} />
          </div>
        </div>
      )
      break;
      case 'SRV':
      return (
        <div className='form-group'>
          <div className='col-xs-8 col-sm-4'>
            <Input
              type='text'
              label='Name'
              ref='name'
              name='name'
              required
              onChange={this.handleChange}
              value={this.state.record.name} />
          </div>
          <div className='col-xs-4 col-sm-2'>
            <Input
              type='number'
              label='Priority'
              ref='prio'
              name='prio'
              required
              max='200'
              min='0'
              onChange={this.handleSrvChange}
              value={this.state.record.content.prio} />
          </div>
          <div className='col-xs-4 col-sm-2'>
            <Input
              type='number'
              label='Port'
              ref='port'
              name='port'
              required
              max='65535'
              min='0'
              onChange={this.handleSrvChange}
              value={this.state.record.content.port} />
          </div>
          <div className='col-xs-8 col-sm-4'>
            <Input
              type='text'
              label='Value'
              ref='value'
              name='value'
              required
              onChange={this.handleSrvChange}
              value={this.state.record.content.value} />
          </div>
        </div>
      )
      break;
      case 'TXT':
      return (
          <div className='form-group'>
            <div className='col-sm-4'>
              <Input
                type='text'
                label='Name'
                ref='name'
                name='name'
                required
                onChange={this.handleChange}
                value={this.state.record.name} />
            </div>
            <div className='col-sm-8'>
              <Input
                type='textarea'
                ref='content'
                label='Content'
                name='content'
                required
                onChange={this.handleChange}
                value={this.state.record.content} />
            </div>
          </div>
        )
      break;
    }
  },

  renderTypeButton(type) {
    return (
        <Button bsStyle={this.state.record.type==type ? 'btn-lg btn-'+type.toLowerCase() : 'btn-lg'} 
            onClick={this.setType.bind(this, type)}
            value={type}>{type}</Button>
        )
  },

  render(){
    if(this.state.record.type && this.state.record.type!=''){
      var submitbutton = <button className='btn btn-primary' type="submit">Save</button>
    }
   return (
     <div className='container-fluid'>
       <AlertSet alerts={this.state.alerts} />
       <h3>New record</h3>
       <form onSubmit={this.handleSubmit}>
         <div className='col-xs-12 col-sm-8'>
           <div className='form-group'>
             <ButtonGroup>
               {this.renderTypeButton('A')}
               {this.renderTypeButton('AAAA')}
               {this.renderTypeButton('CNAME')}
               {this.renderTypeButton('SRV')}
               {this.renderTypeButton('PTR')}
               {this.renderTypeButton('TXT')}
               {this.renderTypeButton('SOA')}
               {this.renderTypeButton('NS')}
               {this.renderTypeButton('MX')}
             </ButtonGroup>
           </div>
         </div>
         <div className='col-xs-12 col-sm-4'>
           <BootstrapSelect ref='domain' addonBefore='Domain' onChange={this.handleDomainChange} updateOnLoad value={this.props.domain}>
             {this.state.data['list'].map((domain) => {
               return <option value={domain.id} data-name={domain.name}>{domain.name}</option>
             })}
           </BootstrapSelect>
         </div>
         <div className='col-xs-12 col-sm-12'>
           {this.renderInput()}
         </div>
         <div className='col-xs-12 col-sm-12'>
           <div className='col-xs-8 col-sm-4'>
             {submitbutton}
           </div>
         </div>
       </form>
      </div>
    )
  },
})


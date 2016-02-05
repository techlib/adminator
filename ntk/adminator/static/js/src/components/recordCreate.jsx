var RecordCreate = React.createClass({
  mixins: [Reflux.connect(recordStore, 'record'), Reflux.connect(domainStore, 'data')],

  componentDidMount(){
    DomainActions.list()
  },

  getInitialState() {
    return {record: {type: ''}, alerts: [], data: {list: []}}
  },

  setType(type){
     this.setState({record: {
        type: type
      }
     })
  },

  handleChange(){
    var i = this.refs.domain.refs.input.selectedIndex
    var domainName = $(this.refs.domain.refs.input[i]).data('name')
    if (this.state.record.type == 'SRV'){
      var content = this.refs.priority.getValue() + ' ' + this.refs.port.getValue() + ' ' + this.refs.value.getValue()
    } else {
      var content = this.refs.content.getValue()
    }

    var priority = (this.refs.priority === undefined) ? 0 : this.refs.priority.getValue()
    this.setState({record: {
        name: this.refs.name.getValue(),
        content: content,
        type: this.state.record.type,
        domain_id: this.refs.domain.getValue(),
        prio: priority
      },
        domainName: domainName
    })
  },

  handleSubmit(){
    // Append selected domain name if not present
    if(this.state.record.name.indexOf(this.state.domainName) < 0){
      this.state.record.name = this.state.record.name + '.' + this.state.domainName
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
              onChange={this.handleChange}
              value={this.state.record.name} />
          </div>
          <div className='col-xs-8 col-sm-4'>
            <Input
              type='text'
              label='Value'
              ref='content'
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
              onChange={this.handleChange}
              value={this.state.record.name} />
          </div>
          <div className='col-xs-4 col-sm-2'>
            <Input
              type='text'
              label='Priority'
              ref='priority'
              onChange={this.handleChange}
              value={this.state.record.prio} />
          </div>
          <div className='col-xs-8 col-sm-4'>
            <Input
              type='text'
              label='Value'
              ref='content'
              onChange={this.handleChange}
              value={this.state.record.content} />
          </div>
        </div>
      )
      case 'SRV':
       let [priority, port, value] = ['', '', ''];
      if (!_.isUndefined(this.state.record.content)){
        [priority, port, value] = this.state.record.content.split(' ')
      }
      return (
        <div className='form-group'>
          <div className='col-xs-8 col-sm-4'>
            <Input
              type='text'
              label='Name'
              ref='name'
              onChange={this.handleChange}
              value={this.state.record.name} />
          </div>
          <div className='col-xs-4 col-sm-2'>
            <Input
              type='text'
              label='Priority'
              ref='priority'
              onChange={this.handleChange}
              value={priority} />
          </div>
          <div className='col-xs-4 col-sm-2'>
            <Input
              type='text'
              label='Port'
              ref='port'
              onChange={this.handleChange}
              value={port} />
          </div>
          <div className='col-xs-8 col-sm-4'>
            <Input
              type='text'
              label='Value'
              ref='value'
              onChange={this.handleChange}
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
                value={this.state.record.name} />
            </div>
            <div className='col-xs-8'>
              <Input
                type='textarea'
                ref='content'
                label='Content'
                onChange={this.handleChange}
                value={this.state.record.content} />
            </div>
          </div>
        )
      break;
    }
  },

  renderDomainSelect(){
    var rows = []
    for (var domain of this.state.data['list']){
      rows.push(<option value={domain.id} data-name={domain.name}>{domain.name}</option>)
    }
    return (
            <BootstrapSelect ref='domain' addonBefore='Domain' onChange={this.handleChange} value={this.props.domain}>
              {rows}
            </BootstrapSelect>
        )
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
      var submitbutton = <ButtonInput type="submit" className='btn-primary' value="Save" />
    }
   return (
     <div className='col-xs-12'>
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
            {this.renderDomainSelect()}
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


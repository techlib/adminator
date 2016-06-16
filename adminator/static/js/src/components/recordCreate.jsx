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
    return {record: {type: ''}, data: {list: []}, domainName: ''}
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
    this.setState({record: this.state.record})
  },

  validate() {
      var data = this.state.record
      var errors = []
      if (!data['name']) {errors.push('Name is missing')}

      if(data['type'] == 'SRV'){
        if(!data['prio']) {errors.push('Priority is missing')}
        if(!inRange(data['prio'], 0, 1000)) {errors.push('Priority must be a number 0-1000')}
        if(!data['port']) {errors.push('Port is missing')}
        if(!inRange(data['port'], 1, 65536)) {errors.push('Port must be a number 1-65536')}
        if(!data['content']){errors.push('Content is missing')}
      } else if(data['type'] == 'A'){
          if(!data['content']){errors.push('IPv4 address is missing')}
          if(data['content'] && !isIP4(data['content'])){errors.push('IPv4 address is not in the correct format')}
      } else if(data['type'] == 'AAAA') {
          if(!data['content']){errors.push('IPv6 address is missing')}
          if(data['content'] && !isIP6(data['content'])){errors.push('IPv6 address is not in the correct format')}
      } else if(data['type'] == 'MX'){
          if(!data['prio']){errors.push('Priority is missing')}
          if(!inRange(data['prio'], 0, 1000)){errors.push('Priority must be a number 0-1000')}
      } else {
        if (!data['content']) {errors.push('Content is missing')}
      }
      return errors
  },

  handleSubmit(e){
    e.preventDefault()

    var errors = this.validate()

    if (errors.length > 0) {
        FeedbackActions.set('error', 'Form contains invalid data', errors);
    } else {

      // Append selected domain name if not present
      if(this.state.record.name.indexOf(this.state.domainName) < 0){
        this.state.record.name = this.state.record.name + '.' + this.state.domainName
      }
      if (this.state.record.type == 'SRV'){
        this.state.record.content = this.state.record.content.prio + ' ' + this.state.record.content.port + ' ' + this.state.record.value
      }

      RecordActions.create(this.state.record);
      FeedbackActions.set('success', 'Form has been submited');
    }
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
              onChange={this.handleChange}
              value={this.state.record.name} />
          </div>
          <div className='col-xs-8 col-sm-4'>
            <Input
              type='text'
              label='Value'
              ref='content'
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
              onChange={this.handleChange}
              value={this.state.record.name} />
          </div>
          <div className='col-xs-4 col-sm-2'>
            <Input
              type='number'
              label='Priority'
              ref='prio'
              name='prio'
              onChange={this.handleChange}
              value={this.state.record.prio} />
          </div>
          <div className='col-xs-8 col-sm-4'>
            <Input
              type='text'
              label='Value'
              ref='content'
              name='content'
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
              onChange={this.handleChange}
              value={this.state.record.name} />
          </div>
          <div className='col-xs-4 col-sm-2'>
            <Input
              type='number'
              label='Priority'
              ref='prio'
              name='prio'
              onChange={this.handleSrvChange}
              value={this.state.record.content.prio} />
          </div>
          <div className='col-xs-4 col-sm-2'>
            <Input
              type='number'
              label='Port'
              ref='port'
              name='port'
              onChange={this.handleSrvChange}
              value={this.state.record.content.port} />
          </div>
          <div className='col-xs-8 col-sm-4'>
            <Input
              type='text'
              label='Value'
              ref='value'
              name='value'
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
                onChange={this.handleChange}
                value={this.state.record.name} />
            </div>
            <div className='col-sm-8'>
              <Input
                type='textarea'
                ref='content'
                label='Content'
                name='content'
                onChange={this.handleChange}
                value={this.state.record.content} />
            </div>
          </div>
        )
      break;
    }
  },

  renderTypeButton(type) {
    let btnCls = classNames({[`btn-${type.toLowerCase()}`]: this.state.record.type==type})
    return (
        <Button bsStyle={btnCls}
            bsSize='lg'
            onClick={this.setType.bind(this, type)}
            value={type}>{type}</Button>
        )
  },

  render(){
   return (
     <div className='row'>
       <div className='container-fluid'>
         <Feedback />
       </div>
       <form onSubmit={this.handleSubmit}>
         <div className='col-xs-12'>
            <div className='panel panel-default '>
              <div className="panel-heading">
                <h3 className="panel-title">
                 New record
               </h3>
              </div>

              <div className="panel-body">

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
                       return <option value={domain.id} data-name={domain.name} key={domain.name}>{domain.name}</option>
                     })}
                   </BootstrapSelect>
                 </div>

                <div className={"col-sm-12" + (this.state.record.type ? '': 'hidden')}>
                  {this.renderInput()}
                </div>
              </div>
            <div className={"panel-footer " + (this.state.record.type ? '': 'hidden')}>
              <button className='btn btn-primary' type="submit">Save</button>
            </div>
          </div>
         </div>

       </form>
      </div>
    )
  },
})


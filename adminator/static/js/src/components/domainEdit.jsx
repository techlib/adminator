var DomainEdit = React.createClass({
  mixins: [
    Reflux.connect(domainStore, 'data'),
    Reflux.listenTo(domainStore, 'handleErrors')
  ],

  componentDidMount(){
    let { id } = this.props.params
    if(id != 'new'){
      DomainActions.read(id)
    }
  },

  getInitialState() {
    return {data: {domain: {type: 'MASTER', last_check: moment().format('X')}}}
  },

  handleErrors(data){
    var errors = []
    data.errors.map((item) => {
      errors.append(item.message.message)
    })
    FeedbackActions.set('error', 'Errors from server', errors);
  },

  handleChangeType(event){
    this.state.data.domain.type = event.target.value
    this.setState({data: this.state.data})
  },

  validate(){
      var data = this.state.data.domain
      var errors = []
      if (!data['name']) {errors.push('Name is missing')}
      if (!data['type']) {errors.push('Type is missing')}
      if (data['type'] == 'SLAVE' && !data['master']) {errors.push('Master is missing')}
      if (data['type'] == 'SLAVE' && !isIP4(data['master'])) {errors.push('Master is not an IP address')}
      if (!data['last_check']) {errors.push('Last check is missing')}

      return errors
  },

  handleChange(){
    this.setState({data: {domain: {
        name: this.refs.name.getValue(),
        master: this.refs.master.getValue(),
        type: this.state.data.domain.type,
        last_check: this.refs.last_check.getValue(),
        id: this.state.data.domain.id
      }
    }})
  },

  handleSubmit(e){
    e.preventDefault()
    var errors = this.validate()

    if (errors.length > 0) {
        FeedbackActions.set('error', 'Form contains invalid data', errors);
    } else {
      if(_.isUndefined(this.state.data.domain.id)){
        DomainActions.create(this.state.data.domain)
        FeedbackActions.set('success', 'Domain created');
      } else {
        DomainActions.update(this.state.data.domain)
        FeedbackActions.set('success', 'Domain updated');
      }
    }
  },


  render(){
   return (
        <div className='container col-md-12 '>
        <h1>{this.state.data.domain.name}</h1>
          <Feedback />
          <form className='form-horizontal' onSubmit={this.handleSubmit}>
            <div className="panel panel-default">
              <div className="panel-heading">
                <h1 className="panel-title">Domain</h1>
              </div>

              <div className="panel-body">
                <div className='col-md-6'>
                  <Input
                    type='text'
                    label='Name'
                    labelClassName='col-md-2'
                    wrapperClassName='col-md-10'
                    ref='name'
                    onChange={this.handleChange}
                    value={this.state.data.domain.name} />
                </div>
                <div className='col-md-6'>
                  <Input
                    type='text'
                    label='Master'
                    labelClassName='col-md-2'
                    wrapperClassName='col-md-10'
                    ref='master'
                    onChange={this.handleChange}
                    value={this.state.data.domain.master} />
                </div>
                <div className='col-md-6'>
                  <BootstrapSelect
                    label='Type'
                    labelClassName='col-md-2'
                    wrapperClassName='col-md-10'
                    ref='type'
                    onChange={this.handleChangeType}
                    value={this.state.data.domain.type}>
                      <option value='MASTER'>Master</option>
                      <option value='SLAVE'>Slave</option>
                  </BootstrapSelect>
                </div>
                <div className='col-md-6'>
                  <div className='form-group'>
                    <label className='control-label col-md-2'>Last check</label>
                    <div className='col-md-10'>
                      <DateTimeField
                        ref='last_check'
                        onChange={this.handleChange}
                        format='X'
                        inputFormat='DD.MM.YYYY HH:mm'
                        dateTime={this.state.data.domain.last_check} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="panel-footer">
                <button type="submit" className='btn btn-primary'>Save</button>
              </div>
          </div>
        </form>
      </div>
    )
  },
})


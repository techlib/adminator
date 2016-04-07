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
    return {data: {domain: {type: 'MASTER', last_check: moment().format('X')}}, alerts: []}
  },

  handleErrors(data){
    data.errors.map((item) => {
      this.setState({alerts: this.state.alerts.concat([new ErrorAlert(item.message.message)])})
    })
  },

  handleChangeType(event){
    this.state.data.domain.type = event.target.value
    this.setState({data: this.state.data})
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
    if(_.isUndefined(this.state.data.domain.id)){
      console.log(this.state.data.domain)
      DomainActions.create(this.state.data.domain)
      this.setState({alerts: this.state.alerts.concat([new SuccessAlert('Domain created')])})
    } else {
      DomainActions.update(this.state.data.domain)
      this.setState({alerts: this.state.alerts.concat([new SuccessAlert('Domain updated')])})
    }
  },


  render(){
   return (
     <div>
     <AlertSet alerts={this.state.alerts} />
        <AdminNavbar/>
        <div className='container col-md-12'>
          <h3>Domain</h3>
          <div className='col-md-12 well'>
          <form className='form-horizontal' onSubmit={this.handleSubmit}>
            <div className='col-md-6'>
              <Input
                type='text'
                label='Name'
                labelClassName='col-md-2'
                wrapperClassName='col-md-10'
                ref='name'
                required
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

            <div className='col-md-6'>
              <div className='form-group'>
                <div className='col-md-10 col-md-offset-2'>
                  <ButtonInput type="submit" className='btn-primary' value="Save" />
                </div>
              </div>
            </div>
            </form>
            </div>
          </div>
      </div>
    )
  },
})


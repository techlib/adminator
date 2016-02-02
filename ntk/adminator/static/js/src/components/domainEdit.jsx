var DomainEdit = React.createClass({
  mixins: [Reflux.connect(domainStore, 'data')],

  componentDidMount(){
    let { id } = this.props.params
    DomainActions.read(id)
  },

  getInitialState() {
    return {data: {domain: {}}, alerts: []}
  },

  handleChange(){
    this.setState({data: {domain: {
        name: this.refs.name.getValue(),
        master: this.refs.master.getValue(),
        type: this.refs.type.getValue(),
        last_check: this.refs.last_check.getValue(),
        id: this.state.data.domain.id
      }
    }})
  },

  handleSubmit(){
    DomainActions.update(this.state.data.domain);
    this.setState({alerts: this.state.alerts.concat([new SuccessAlert('Domain updated')])});
  },


  render(){
   return (
     <div>
     <AlertSet alerts={this.state.alerts} />
        <AdminNavbar/>
        <div className='container col-xs-12'>
          <h3>Domain</h3>
          <form onSubmit={this.handleSubmit}>
            <div className='col-xs-6'>
              <Input
                type='text'
                addonBefore='Name'
                ref='name'
                onChange={this.handleChange}
                value={this.state.data.domain.name} />
            </div>
            <div className='col-xs-6'>
              <Input
                type='text'
                addonBefore='Master'
                ref='master'
                onChange={this.handleChange}
                value={this.state.data.domain.master} />
            </div>
            <div className='col-xs-6'>
              <Input
                type='select'
                addonBefore='Type'
                ref='type'
                onChange={this.handleChange}
                value={this.state.data.domain.type}>
                  <option value='MASTER'>Master</option>
                  <option value='SLAVE'>Slave</option>
              </Input>
            </div>
            <div className='col-xs-6'>
              <div className='form-group'>
               <div className='input-group'>
                <span className='input-group-addon'>Last check</span>
                <DateTimeField
                  ref='last_check'
                  defaultText=''
                  onChange={this.handleChange}
                  format='X'
                  inputFormat='DD.MM.YYYY HH:mm'
                  dateTime={this.state.data.domain.last_check} />
                </div>
              </div>
            </div>

            <div className='col-xs-12'>
                <ButtonInput type="submit" className='btn-primary' value="Save" />
            </div>
          </form>
          </div>
      </div>
    )
  },
})

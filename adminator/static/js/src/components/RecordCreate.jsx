import * as React from 'react'
import * as Reflux from 'reflux'
import {DomainStore} from '../stores/Domain'
import {DomainActions, RecordActions, FeedbackActions} from '../actions'
import {Feedback} from './Feedback'
import {Input, ButtonGroup, Button} from 'react-bootstrap'
import {BootstrapSelect} from './Select'
import * as _ from 'lodash'
import classNames from 'classnames'
import {inRange, isIP4, isIP6} from '../util/simple-validators'
import {ipToPtr} from '../util/general'
import Typeahead from 'react-bootstrap-typeahead'

export var RecordCreate = React.createClass({
  mixins: [Reflux.connect(DomainStore, 'data'), Reflux.listenTo(DomainStore,'onDomainStoreChange')],

  componentDidMount() {
    DomainActions.list()
    this.parseIpv4()
    this.range = _.map(_.range(1, 255), function (item) {
      return item.toString()
    })
  },

  parseIpv4() {
    var res = {}
    _.each(this.props.records, function (item) {
      if (item.type == 'A') {
        var parts = item.content.split('.')
        var newItem = {}
        newItem[parts[0]] = {}
        newItem[parts[0]][parts[1]] = {}
        newItem[parts[0]][parts[1]][parts[2]] = {}
        newItem[parts[0]][parts[1]][parts[2]][parts[3]] = item.name
        _.merge(res, newItem)
      }
    })
    this.parsedIps = res
  },

  onDomainStoreChange(data) {
    this.state.record.domain_id = _.first(data.list).id
    this.state.domainName = _.first(data.list).name
    this.setState(this.state)
  },

  getInitialState() {
    return {record: {type: ''}, data: {list: []}, domainName: '', availableIpv4: []}
  },

  setType(type) {
    if(type == 'SRV') {
      this.state.record.content = {port: '', prio: '', value: ''}
    } else {
      this.state.record.content = null
    }
    this.state.record.type = type
    this.setState({record: this.state.record})
  },

  handleSrvChange(e) {
    this.state.record.content[e.target.name] = e.target.value
    this.setState({record: this.state.record})
  },

  handlePtrChange(e) {
    this.state.record.ip = e.target.value
    this.state.record.name = ipToPtr(e.target.value)

    var domain = this.state.record.name.split('.').slice(2).join('.')
    var selected = null
    if(selected = _.findLast(this.state.data['list'], (o) => { return o.name == domain })){
      this.state.record.domain_id = selected.id
      this.state.domainName = selected.name
      this.setState({domainName: selected.name, record: this.state.record})
    }

    this.setState({record: this.state.record})
  },

  handleDomainChange(e) {
    _.map(e.target.children, ((node) => {
      if(e.target.value == node.value) {
        this.state.domainName = node.dataset.name
      }
    }))
    this.state.record.domain_id = e.target.value
    this.setState({domainName: this.state.domainName, record: this.state.record})
  },

  handleChange(e) {
    if (e.target.name == 'name') {
      var domain = e.target.value.split('.').slice(-2).join('.')
      var selected = null
      if(selected = _.findLast(this.state.data['list'], (o) => { return o.name == domain })){
        this.state.record.domain_id = selected.id
        this.state.domainName = selected.name
        this.setState({domainName: selected.name, record: this.state.record})
      }
    }
    this.state.record[e.target.name] = e.target.value
    if(e.target.name == 'prio') {
      this.state.record.priority = (_.isUndefined(e.target.value) ? 0 : e.target.value)
    }
    this.setState({record: this.state.record})
  },

  handleChangeIpv4(string) {
    var parts = string.split('.')
    var res = []

    if (parts.length ==  4) {
      if (_.has(this.parsedIps, parts.slice(0,3))) {
        var ips = this.parsedIps[parts[0]][parts[1]][parts[2]]
        res = _.map(_.difference(this.range,_.keys(ips)), function (item) {
          return parts.slice(0,3).join('.') + '.' + item
        })
      }
    }

    var s = this.state

    s.record.content = string
    s.availableIpv4 = res
    this.setState(s)
  },

  validate() {
      var data = this.state.record
      var errors = []
      if (!data['name']) {errors.push('Name is missing')}

      if(data['type'] == 'SRV') {
        if(!data['content']['prio']) {errors.push('Priority is missing')}
        if(!inRange(data['content']['prio'], 0, 1000)) {errors.push('Priority must be a number 0-1000')}
        if(!data['content']['port']) {errors.push('Port is missing')}
        if(!inRange(data['content']['port'], 1, 65536)) {errors.push('Port must be a number 1-65536')}
        if(!data['content']['value']) {errors.push('Content is missing')}
      } else if(data['type'] == 'A') {
          if(!data['content']) {errors.push('IPv4 address is missing')}
          if(data['content'] && !isIP4(data['content'])) {errors.push('IPv4 address is not in the correct format')}
      } else if(data['type'] == 'AAAA') {
          if(!data['content']) {errors.push('IPv6 address is missing')}
          if(data['content'] && !isIP6(data['content'])) {errors.push('IPv6 address is not in the correct format')}
      } else if(data['type'] == 'MX') {
          if(!data['prio']) {errors.push('Priority is missing')}
          if(!inRange(data['prio'], 0, 1000)) {errors.push('Priority must be a number 0-1000')}
      } else {
        if (!data['content']) {errors.push('Content is missing')}
      }
      return errors
  },

  t(text) {
    var val = (this.state.record.content || '').split('.').pop()
    return _.startsWith(text, val)
  },

  handleSubmit(e) {
    e.preventDefault()

    var errors = this.validate()

    if (errors.length > 0) {
        FeedbackActions.set('error', 'Form contains invalid data', errors)
    } else {

      // Append selected domain name if not present
      if(this.state.record.name.indexOf(this.state.domainName) < 0) {
        this.state.record.name = this.state.record.name + '.' + this.state.domainName
      }
      if (this.state.record.type == 'SRV') {
        this.state.record.content = this.state.record.content.prio + ' ' + this.state.record.content.port + ' ' + this.state.record.content.value
      }

      RecordActions.create(this.state.record)
      FeedbackActions.set('success', 'Form has been submited')
    }
  },

  renderInput() {
    var placeholders = {
      'AAAA': '2001:718:12:12::12',
      'CNAME': 'domain.alias.example.org',
      'NS': 'dns.example.org',
      'SOA': 'dns.example.org. hostmaster.example.org. 2020060606 10800 900 604800 129600'
    }

     switch (this.state.record.type) {
     case 'A':
     return (
      <div className='form-group'>
          <div className='col-xs-8 col-sm-4'>
            <Input
              type='text'
              label='Name'
              placeholder='domain.example.org'
              ref='name'
              name='name'
              onChange={this.handleChange}
              value={this.state.record.name} />
          </div>
          <div className='col-xs-8 col-sm-4'>
            <label className='control-label'>Value</label>
            <Typeahead
              type='text'
              label='Value'
              placeholder='10.0.0.123'
              options={this.state.availableIpv4}
              ref='content'
              name='content'
              onInputChange={this.handleChangeIpv4}
              value={this.state.record.content} />
          </div>
          <div className='col-xs-8 col-sm-1'>
            <Input
              type='text'
              label='TTL'
              placeholder='3600'
              ref='TTL'
              name='ttl'
              onChange={this.handleChange}
              value={this.state.record.ttl} />
          </div>
        </div>
      )
      case 'AAAA':
      case 'CNAME':
      case 'NS':
      case 'SOA':
      return (
        <div className='form-group'>
          <div className='col-xs-8 col-sm-4'>
            <Input
              type='text'
              label='Name'
              placeholder='domain.example.org'
              ref='name'
              name='name'
              onChange={this.handleChange}
              value={this.state.record.name} />
          </div>
          <div className='col-xs-8 col-sm-4'>
            <Input
              type='text'
              label='Value'
              placeholder={placeholders[this.state.record.type]}
              ref='content'
              name='content'
              onChange={this.handleChange}
              value={this.state.record.content} />
          </div>
          <div className='col-xs-8 col-sm-1'>
            <Input
              type='text'
              label='TTL'
              placeholder='3600'
              ref='TTL'
              name='ttl'
              onChange={this.handleChange}
              value={this.state.record.ttl} />
          </div>
        </div>
      )
      case 'PTR':
      return (
        <div className='form-group'>
          <div className='col-xs-8 col-sm-4'>
            <Input
              type='text'
              label='IP'
              ref='ip'
              name='ip'
              placeholder='10.0.0.123'
              onChange={this.handlePtrChange}
              value={this.state.record.ip} />
          </div>
          <div className='col-xs-8 col-sm-4'>
            <Input
              type='text'
              label='Name'
              ref='name'
              name='name'
              placeholder='123.0.0.10.in-addr.arpa'
              onChange={this.handleChange}
              value={this.state.record.name} />
          </div>
          <div className='col-xs-8 col-sm-3'>
            <Input
              type='text'
              label='Value'
              ref='content'
              name='content'
              placeholder='domain.example.com'
              onChange={this.handleChange}
              value={this.state.record.content} />
          </div>
          <div className='col-xs-8 col-sm-1'>
            <Input
              type='text'
              label='TTL'
              placeholder='3600'
              ref='TTL'
              name='ttl'
              onChange={this.handleChange}
              value={this.state.record.ttl} />
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
              placeholder='example.org'
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
              placeholder='mailserver.example.org'
              onChange={this.handleChange}
              value={this.state.record.content} />
          </div>
          <div className='col-xs-8 col-sm-1'>
            <Input
              type='text'
              label='TTL'
              placeholder='3600'
              ref='TTL'
              name='ttl'
              onChange={this.handleChange}
              value={this.state.record.ttl} />
          </div>
        </div>
      )
      case 'SRV':
      return (
        <div className='form-group'>
          <div className='col-xs-8 col-sm-4'>
            <Input
              type='text'
              label='Name'
              ref='name'
              name='name'
              placeholder='_service._tcp.example.org'
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
          <div className='col-xs-8 col-sm-3'>
            <Input
              type='text'
              label='Value'
              ref='value'
              name='value'
              placeholder='domain.example.org'
              onChange={this.handleSrvChange}
              value={this.state.record.content.value} />
          </div>
          <div className='col-xs-8 col-sm-1'>
            <Input
              type='text'
              label='TTL'
              placeholder='3600'
              ref='TTL'
              name='ttl'
              onChange={this.handleChange}
              value={this.state.record.ttl} />
          </div>
        </div>
      )
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
            <div className='col-sm-7'>
              <Input
                type='textarea'
                ref='content'
                label='Content'
                name='content'
                onChange={this.handleChange}
                value={this.state.record.content} />
            </div>
            <div className='col-xs-8 col-sm-1'>
              <Input
                type='text'
                label='TTL'
                placeholder='3600'
                ref='TTL'
                name='ttl'
                onChange={this.handleChange}
                value={this.state.record.ttl} />
            </div>
          </div>
        )
    }
  },

  renderTypeButton(type) {
    console.log(this.state.record.type)
    let btnCls = classNames({[`btn-${type.toLowerCase()}`]: this.state.record.type==type, 'active': this.state.record.type==type})
    return (
        <Button bsStyle={btnCls}
            bsSize='lg'
            onClick={this.setType.bind(this, type)}
            value={type}>{type}</Button>
        )
  },

  render() {
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
                 <button type="button"
                         className="close"
                         onClick={this.props.hideHandler}>
                    <span>&times;</span>
                </button>
                </h3>
              </div>

              <div className="panel-body">
                <div className="row col-sm-12">
                 <div className='col-xs-12 col-md-4 vcenter'>
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

                 <div className='col-xs-12 col-md-4 vcenter'>
                   <BootstrapSelect ref='domain' addonBefore='Domain' data-live-search="true" onChange={this.handleDomainChange} updateOnLoad value={this.state.record.domain_id}>
                     {this.state.data['list'].map((domain) => {
                       return <option value={domain.id} data-name={domain.name} key={domain.name}>{domain.name}</option>
                     })}
                   </BootstrapSelect>
                 </div>
               </div>

                <div className={'row col-sm-12' + (this.state.record.type ? '': 'hidden')}>
                  {this.renderInput()}
                </div>
              </div>
            <div className={'panel-footer ' + (this.state.record.type ? '': 'hidden')}>
              <button className='btn btn-primary' type="submit">Save</button>
            </div>
          </div>
         </div>

       </form>
      </div>
    )
  },
})


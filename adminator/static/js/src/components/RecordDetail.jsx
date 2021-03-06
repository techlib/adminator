import * as React from 'react'
import * as Reflux from 'reflux'
import * as _ from 'lodash'
import {RecordActions, FeedbackActions, DomainActions} from '../actions'
import {RecordStore} from '../stores/Record'
import {DomainStore} from '../stores/Domain'
import {Feedback} from './Feedback'
import {Input} from 'react-bootstrap'
import {inRange, isIP4, isIP6} from '../util/simple-validators'
import {BootstrapSelect} from './Select'

export var RecordDetail = React.createClass({
  mixins: [Reflux.connect(RecordStore, 'data'), Reflux.connect(DomainStore, 'domains')],


  componentDidMount() {
    let { id } = this.props.params
    RecordActions.read(id)
    DomainActions.list()
  },

  getInitialState() {
    return {data: {record: {type: ''}}, domains: {list: [], domain:{}}}
  },

  handleDomainChange(e) {
    var currentDomain = _.filter(this.state.domains.list, (item) => {return item.id == this.state.data.record.domain_id}).pop()
    var newDomain     = _.filter(this.state.domains.list, (item) => {return item.id == e.target.value}).pop()

    this.state.data.record.name = this.state.data.record.name.replace(currentDomain.name, newDomain.name)
    this.state.data.record.domain_id = e.target.value
    this.setState({data: this.state.data})
  },

  handleChange() {
    var data = {data: {record: {
        name: this.refs.name.getValue(),
        content: this.refs.content.getValue(),
        type: this.state.data.record.type,
        domain_id: this.state.data.record.domain_id,
        ttl: this.refs.ttl.getValue(),
        id: this.state.data.record.id
      }
    }}
    if(this.refs.prio) {
        data['prio'] = this.refs.prio.getValue()
    }
    this.setState(data)
  },


  handleSrvChange() {
    let content = this.refs.priority.getValue() + ' ' + this.refs.port.getValue() + ' ' + this.refs.value.getValue()
    this.setState({data: {record: {
        id: this.state.data.record.id,
        name: this.refs.name.getValue(),
        content: content,
        type: this.state.data.record.type,
        ttl: this.state.data.record.ttl,
        domain_id: this.state.data.record.domain_id
      }
    }})
  },

  validate() {
      var data = this.state.data.record
      var errors = []
      if (!data['name']) {errors.push('Name is missing')}

      if(data['type'] == 'SRV') {
        if(!this.refs.priority.getValue()) {errors.push('Priority is missing')}
        if(!inRange(this.refs.priority.getValue(), 0, 1000)) {errors.push('Priority must be a number 0-1000')}
        if(!this.refs.port.getValue()) {errors.push('Port is missing')}
        if(!inRange(this.refs.port.getValue(), 1, 65536)) {errors.push('Port must be a number 1-65536')}
        if(!this.refs.value.getValue()) {errors.push('Value is missing')}
      } else if(data['type'] == 'A') {
          if(!data['content']) {errors.push('IPv4 address is missing')}
          if(data['content'] && !isIP4(data['content'])) {errors.push('IPv4 address is not in the correct format')}
      } else if(data['type'] == 'AAAA') {
          if(!data['content']) {errors.push('IPv6 address is missing')}
          if(data['content'] && !isIP6(data['content'])) {errors.push('IPv6 address is not in the correct format')}
      } else if(data['type'] == 'MX') {
          if(!data['prio']) {errors.push('Priority is missing')}
          if(!inRange(data['prio'], 0, 1000)) {errors.push('Priority must be a number 0-1000')}
      } else if(data['type'] != null) {
        if (!data['content']) {errors.push('Content is missing')}
      }
      return errors
  },

  handleSubmit() {
    var errors = this.validate()

    if (errors.length > 0) {
        FeedbackActions.set('error', 'Form contains invalid data', errors)
    } else {
      RecordActions.update(this.state.data.record)
      FeedbackActions.set('success', 'Form has been submited')
    }
  },

  renderInput() {
    var type = this.state.data.record.type
     if (type == null) {
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
                type='hidden'
                ref='content'
                onChange={this.handleChange}
                value={this.state.data.record.content} />

          </div>)
     } else if (type == 'MX') {
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
              label='Priority'
              labelClassName='col-xs-2'
              wrapperClassName='col-xs-8'
              ref='prio'
              onChange={this.handleChange}
              value={this.state.data.record.prio} />

            <Input
              type='text'
              label='Value'
              labelClassName='col-xs-2'
              wrapperClassName='col-xs-8'
              ref='content'
              onChange={this.handleChange}
              value={this.state.data.record.content} />
            <Input
              type='text'
              label='TTL'
              labelClassName='col-xs-2'
              wrapperClassName='col-xs-2'
              ref='ttl'
              onChange={this.handleChange}
              value={this.state.data.record.ttl} />

       </div>
        )
      } else if (type == 'SRV') {
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
              <Input
                type='text'
                label='TTL'
                labelClassName='col-xs-2'
                wrapperClassName='col-xs-2'
                ref='ttl'
                onChange={this.handleChange}
                value={this.state.data.record.ttl} />

        </div>
        )
      } else if (type == 'TXT') {
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
               <Input
                  type='text'
                  label='TTL'
                  labelClassName='col-xs-2'
                  wrapperClassName='col-xs-2'
                  ref='ttl'
                  onChange={this.handleChange}
                  value={this.state.data.record.ttl} />

           </div>
          )
      } else if (_.includes(['A', 'AAAA', 'CNAME', 'PTR', 'NS', 'SOA'], type)) {
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
              <Input
                type='text'
                label='TTL'
                labelClassName='col-xs-2'
                wrapperClassName='col-xs-2'
                ref='ttl'
                onChange={this.handleChange}
                value={this.state.data.record.ttl} />

          </div>
        )
      }
  },

  render() {
   return (
        <div className='container col-md-6 col-md-offset-3'>
          <h1>{this.state.data.record.name}</h1>
          <Feedback />
          <form className='form-horizontal' onSubmit={this.handleSubmit}>
            <div className="panel panel-default">
              <div className="panel-heading">
                <h1 className="panel-title">
                    <span className={'label label-record label-'+ (this.state.data.record.type ? this.state.data.record.type.toLowerCase() : '')}>
                   {this.state.data.record.type}
                 </span> Record
               </h1>
              </div>
              <div className="panel-body">
              {this.renderInput()}
              <div className='form-group'>
                  <label className="control-label col-xs-2">Domain</label>
                  <BootstrapSelect ref='domain' className="col-xs-8"
                    data-live-search="true" onChange={this.handleDomainChange} updateOnLoad value={this.state.data.record.domain_id}>
                    {this.state.domains['list'].map((domain) => {
                      return <option value={domain.id} data-name={domain.name} key={domain.name}>{domain.name}</option>
                    })}
                  </BootstrapSelect>
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


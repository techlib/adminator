import * as React from 'react'
import {BootstrapSelect} from './Select'
import {Input} from 'react-bootstrap'
import {DateRangePicker} from './DateRangePicker'
import * as _ from 'lodash'
import {minLen} from '../util/simple-validators'
import moment from 'moment'

export var DeviceForm = React.createClass({

    commonProps: {
        labelClassName: 'col-xs-2',
        wrapperClassName: 'col-xs-10',
    },

    componentWillReceiveProps(p) {
        if (p.device.valid == null) {
            delete(p.device.valid)
        }
        if (p.device.type == undefined) {
            delete(p.device.type)
        }
        this.setState(p.device)
    },

    getInitialState() {
        return {type: this.props.allowedTypes[0], valid: [
            moment().startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
            moment().endOf('day').format('YYYY-MM-DDTHH:mm:ss')
        ]}
    },

    getDefaultProps() {
        return {users: []}
    },

    handleChange(evt) {
        this.setState({[evt.target.name]: evt.target.value})
        if (evt.target.name == 'type') {
            this.props.typeChangeHandler(evt.target.value)
        }
    },

    handleValidChange(value) {
        this.setState({valid: value})
    },

    getValues() {
        var data = {
            type: this.state.type,
            description: this.state.description
        }
        if (this.state.type == 'staff') {
            data.description = this.state.description
            data.user = this.state.user
        } else if (this.state.type == 'visitor') {
            data.valid = this.state.valid
        }
        return data
    },

    validate() {
        var r = []
        if (!minLen(this.state.description, 2)) {
            r.push(`Description ${this.state.description} is too short (2 chars min)`)
        }
        if (this.state.type == 'staff') {
            if (!this.state.user) {
                r.push('User is required')
            }
        } else if (this.state.type == 'visitor') {
            r = r.concat(this.refs.valid.validate())
        }

        return r
    },

    getUserSelect() {
        if (this.state.type == 'staff' && this.props.allowedTypes.indexOf('staff') > -1) {
            return (
                <BootstrapSelect
                    label='User'
                    ref='user'
                    name='user'
                    onChange={this.handleChange}
                    data-live-search={true}
                    value={this.state.user}
                    {...this.commonProps}>
                        {this.props.users.map((item) => {
                            return <option value={item.cn} key={item.cn}>
                                {item.display_name}</option>
                        })}
                </BootstrapSelect>
            )
        }
    },

    getVisitorValidRange() {
        if (this.state.type == 'visitor') {
            return (
                <DateRangePicker range={this.state.valid}
                                 ref='valid'
                                 name='valid'
                                 onChange={this.handleValidChange} />
            )
        }
    },

    getAllowedTypes() {
        return _.map(this.props.allowedTypes, function (item) {
            var name = item[0].toUpperCase() + item.substr(1)
            return <option value={item} key={item}>{name}</option>
        })
    },

    render() {
        return (
            <div className='form-horizontal'>
                <Input
                    type='text'
                    label='Description'
                    ref='description'
                    name='description'
                    onChange={this.handleChange}
                    value={this.state.description}
                    {...this.commonProps} />

                <BootstrapSelect
                    ref='type'
                    name='type'
                    label='Type'
                    onChange={this.handleChange}
                    value={this.state.type}
                    {...this.commonProps}>
                        {this.getAllowedTypes()}
                </BootstrapSelect>
                {this.getUserSelect()}
                {this.getVisitorValidRange()}
            </div>
        )
    }
})

import * as React from 'react'
import {Input} from 'react-bootstrap'
import {inRange, isIP4Cidr, isIP6Cidr, isInt} from '../util/simple-validators'

export var NetworkForm = React.createClass({

    getValues() {
        return this.state
    },

    validate() {
        var errors = []
        var data = this.state
        if (!data['description']) {errors.push('Description is missing')}
        if (!data['vlan']) {errors.push('Vlan is missing')}
        if (data['vlan'] && !inRange(data['vlan'], 0, 4096)) {
            errors.push('Vlan must be a number 0-4096')
        }
        if (data['prefix4'] && !isIP4Cidr(data['prefix4'])) {
            errors.push('IPv4 prefix is invalid')
        }
        if (data['prefix6'] && !isIP6Cidr(data['prefix6'])) {
            errors.push('IPv6 prefix is invalid')
        }
        if (!data['max_lease']) {errors.push('Max. lease is missing')}
        if (data['max_lease'] && !isInt(data['max_lease'])) {
            errors.push('Max. lease must be a number')
        }
        return errors

    },

    componentWillReceiveProps(p) {
        this.setState(p.values)
    },

    handleChange(evt) {
        let val = {}
        val[evt.target.name] = evt.target.value
        this.setState(val)
    },

    getInitialState() {
        return {description: null, vlan: null, 
                prefix4: null, prefix6: null, max_lease: null}
    },

    render() {
        return (<div className="panel panel-default">
            <div className="panel-heading">
                <h3 className="panel-title">Basic settings</h3>
            </div>
            <div className="panel-body">
            <form className="form-horizontal">
                <div className="form-group">
                <label className="col-sm-3 control-label">Name</label>
                    <div className="col-sm-8">
                        <Input type="text"
                            onChange={this.handleChange}
                            value={this.state.description}
                            name='description' />
                    </div>
                </div>
                 <div className="form-group">
                <label className="col-sm-3 control-label">VLAN</label>
                    <div className="col-sm-2">
                        <Input type="text"
                            onChange={this.handleChange}
                            value={this.state.vlan}
                            name='vlan'/>
                    </div>
                </div>
                  <div className="form-group">
                <label className="col-sm-3 control-label">Prefix IPv4</label>
                    <div className="col-sm-4">
                        <Input type="text"
                            onChange={this.handleChange}
                            value={this.state.prefix4}
                            name='prefix4' />
                    </div>
                </div>

                <div className="form-group">
                <label className="col-sm-3 control-label">Prefix IPv6</label>
                    <div className="col-sm-8">
                        <Input type="text"
                            onChange={this.handleChange}
                            value={this.state.prefix6}
                            name='prefix6' />
                    </div>
                </div>

                <div className="form-group">
                <label className="col-sm-3 control-label">Max. lease</label>
                    <div className="col-sm-2">
                        <Input type="text"
                            onChange={this.handleChange}
                            value={this.state.max_lease}
                            name='max_lease' />
                    </div>
                </div>
                </form>
            </div>
            <div className="panel-footer">
                <button onClick={this.props.saveHandler}
                        className="btn btn-primary">Save</button>
            </div>
        </div>)
    }
})

import * as React from 'react'
import * as Reflux from 'reflux'

import {DhcpOptionValues} from './DhcpOptionValues'
import {DhcpOptionsStore} from '../stores/DhcpOptions'
import {DhcpValuesStore} from '../stores/DhcpValues'
import {DhcpOptionActions, DhcpValuesActions, FeedbackActions} from '../actions'
import {Feedback} from './Feedback'
import {sortDhcpOptions, sortDhcpValues} from '../util/dhcp'

export var Dhcp = React.createClass({

    mixins: [Reflux.connect(DhcpOptionsStore, 'options'),
             Reflux.connect(DhcpValuesStore, 'values')],

    componentDidMount() {
        DhcpOptionActions.list()
        DhcpValuesActions.listGlobal()
    },

    getInitialState() {
        return {options: [], values: {result: []}}
    },

    save() {
        var dhcp = this.refs['dhcp']
        var dhcp6 = this.refs['dhcp6']

        var errors = []
        errors = errors.concat(dhcp.validate())
        errors = errors.concat(dhcp6.validate())

        if (errors.length > 0) {
            FeedbackActions.set('error', 'Form contains invalid data', errors)
        } else {
            var data = dhcp.getValues().concat(dhcp6.getValues())
            DhcpValuesActions.saveGlobal(data)
        }
    },

    render() {
        var values = sortDhcpValues(this.state.values,
                                    this.state.options)
        var options = sortDhcpOptions(this.state.options)

        return (
                <div className="col-xs-12 container">
                    <h3>Global DHPC options</h3>
                    <Feedback />

                    <div className="row">
                        <div className="col-xs-12 col-md-6">
                            <DhcpOptionValues ref="dhcp"
                                              values={values.inet}
                                              options={options.inet}
                                              title="DHCPv4"/>

                        </div>

                        <div className="col-xs-12 col-md-6">
                            <DhcpOptionValues ref="dhcp6"
                                              values={values.inet6}
                                              options={options.inet6}
                                              title="DHCPv6"/>

                        </div>
                    </div>

                    <button className="btn btn-primary"
                            onClick={this.save}>Save</button>

                </div>
        )
    }
})

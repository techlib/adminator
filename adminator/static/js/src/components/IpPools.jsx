import * as React from 'react'
import * as _ from 'lodash'
import {isIP, isIPSameFamily} from '../util/simple-validators'
export var IPPools = React.createClass({

    c: 0,

    componentWillReceiveProps(p) {
        this.setState(p);
    },

    getInitialState() {
        return {'values': []}
    },

    handleAdd() {
        this.c++;
        this.state.values.push({'range': [], 'uuid': 'new-' + this.c});
        this.setState(this.state);
    },

    handleRemove(index) {
        let removed = this.state.values.splice(index, 1);
        this.setState(this.state);
    },

    validate() {
        return _.flatten(this.state.values.map((item, index) => {
            var result = []

            var ip1 = this.refs[item.uuid + '-0'].value;
            var ip2 = this.refs[item.uuid + '-1'].value;

            if (!isIP(ip1)) {
                result.push(`${ip1} is not valid ip address (pools)`);
            }
            if (!isIP(ip2)) {
                result.push(`${ip2} is not valid ip address (pools)`);
            }

            if (result.length != 0) {
                return result;
            }

            if (!isIPSameFamily(ip1, ip2)) {
                result.push(`${ip1} and ${ip2} are not the same kind`);
                return result;
            }

            return true;

        })).filter(item => {return item !== true})
    },

    getValues() {
        return this.state.values.map((item, index) => {
            var result = {
                'range': [this.refs[item.uuid + '-0'].value,
                          this.refs[item.uuid + '-1'].value]
            };
            if (item.uuid.indexOf('new-') !== 0) {
                result.uuid = item.uuid;
            }
            return result;
        });
    },

    render() {
        return (
            <div className="panel panel-default">
            <div className="panel-heading">
                <h3 className="panel-title">IP pools</h3>
            </div>
            <div className="panel-body">

            {this.state.values.map((item, i) => {
                return <div className="row array-row" key={item.uuid}>
                    <div className="col-xs-6">
                        <input className="form-control"
                            type="text"
                            ref={item.uuid + '-0'}
                            defaultValue={item.range[0]}/>
                    </div>
                    <div className="col-xs-6">
                        <div className="input-group">
                            <input type="text"
                                className="form-control"
                                ref={item.uuid + '-1'}
                                defaultValue={item.range[1]}/>

                            <a className="input-group-addon"
                                onClick={this.handleRemove.bind(null,i)}>
                                    <span className="glyphicon glyphicon-trash"></span>
                            </a>
                        </div>
                        </div>
                    </div>
                })
            }
        </div>
            <div className="panel-footer">
                <a onClick={this.handleAdd}>
                    <span className="pficon pficon-add-circle-o"></span> Add new pool</a>
            </div>

        </div>
        );
    }

})

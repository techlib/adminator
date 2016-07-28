import * as ReactDOM from 'react-dom'
import * as React from 'react'
import {Router, Route, Link, hashHistory, IndexRedirect} from 'react-router'
import {App} from './App'
import {Dhcp} from './Dhcp'
import {Domain} from './Domain'
import {DomainDetail} from './DomainDetail'
import {DomainEdit} from './DomainEdit'
import {NetworkAclList} from './NetworkAclList'
import {NetworkAclEdit} from './NetworkAclEdit'
import {NetworkList} from './NetworkList'
import {NetworkNew} from './NetworkNew'
import {NetworkEdit} from './NetworkEdit'
import {DeviceList} from './DeviceList'
import {DeviceNew} from './DeviceNew'
import {DeviceEdit} from './DeviceEdit'
import {RecordDetail} from './RecordDetail'
import {Record} from './Record'
import {Lease} from './Lease'
import {FeedbackActions} from '../actions'

function onRouterUpdate() {
    FeedbackActions.clear();
};

ReactDOM.render((
  <Router onUpdate={onRouterUpdate} history={hashHistory}>
    <Route path="/" component={App}>
        <IndexRedirect to="/device" />
        <Route path="/dhcp" component={Dhcp} />
        <Route path="/domain" component={Domain} />
        <Route path="/domain/:id" component={DomainDetail} />
        <Route path="/domainEdit/:id" component={DomainEdit} />
        <Route path="/network/acl" component={NetworkAclList} />
        <Route path="/network/acl/:id" component={NetworkAclEdit} />
        <Route path="/network" component={NetworkList} />
        <Route path="/network/new" component={NetworkNew} />
        <Route path="/network/:id" component={NetworkEdit} />
        <Route path="device" component={DeviceList} />
        <Route path="/device/new" component={DeviceNew} />
        <Route path="/device/:id" component={DeviceEdit} />
        <Route path="/record/:id" component={RecordDetail} />
        <Route path="record" component={Record} />
        <Route path="/lease/" component={Lease} />
    </Route>
  </Router>
 ), document.getElementById("AdminatorApp")
)

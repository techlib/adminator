import * as React from 'react'
import * as Reflux from 'reflux'
import {UserInfoStore} from '../stores/UserInfo'
import {Nav, Navbar, NavItem} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'

var Header = Navbar.Header
var Brand = Navbar.Brand

export var AdminNavBar = React.createClass({
  mixins: [Reflux.connect(UserInfoStore, 'user')],

  getInitialState() {
    return {user: {}}
  },

  getAvailableLinks() {
    var res = []

    if (UserInfoStore.isAllowed(['device', 'user'])) {
        res.push(
            <LinkContainer to='/device/' key='device'>
                <NavItem eventKey={2}>Devices</NavItem>
            </LinkContainer>
        )
    }

    if (UserInfoStore.isAllowed('network')) {
        res.push(
            <LinkContainer to='/network/' key='network'>
                <NavItem eventKey={2}>Networks</NavItem>
            </LinkContainer>
        )
    }

    if (UserInfoStore.isAllowed('dns')) {
        res.push(
            <LinkContainer to='/domain/' key='domain'>
                <NavItem eventKey={2}>Domains</NavItem>
            </LinkContainer>
        )
    }

    if (UserInfoStore.isAllowed('dns')) {
        res.push(
            <LinkContainer to='/record/' key='record'>
                <NavItem eventKey={2}>Records</NavItem>
            </LinkContainer>
        )
    }

    if (UserInfoStore.isAllowed('lease')) {
        res.push(
            <LinkContainer to='/lease/' key='lease'>
                <NavItem eventKey={2}>Leases</NavItem>
            </LinkContainer>
        )
    }

    if (UserInfoStore.isAllowed('topology')) {
        res.push(
            <LinkContainer to='/topology/' key='topology'>
                <NavItem eventKey={2}>Topology</NavItem>
            </LinkContainer>
        )
    }

    return res;
  },

  render(){
    return (
    <div className='navbar navbar-pf'>
      <Header>
          <Brand>
              <a href="/#/"><b>ADMINATOR</b> Network management</a>
        </Brand>
    </Header>

            <Nav className="nav navbar-nav navbar-utility">
                <li>
                    <a href="#">
                        <span className="pficon pficon-user"></span>
                        {this.state.user.username}
                    </a>
                </li>
           </Nav>

           <Nav className='navbar-nav navbar-primary'>
              {this.getAvailableLinks()}
           </Nav>
    </div>
    )
  }
})


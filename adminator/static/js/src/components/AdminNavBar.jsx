import * as React from 'react'
import * as Reflux from 'reflux'
import {UserInfoStore} from '../stores/UserInfo'
import {Nav, Navbar, NavItem, NavDropdown, MenuItem} from 'react-bootstrap'
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

    var topology = []

    if (UserInfoStore.isAllowed('topology')) {
        topology.push(
            <LinkContainer to='/topology/' key='topology'>
                <MenuItem eventKey={6.1}>Topology</MenuItem>
            </LinkContainer>
        )
    }

    if (UserInfoStore.isAllowed('macHistory')) {
        topology.push(
            <LinkContainer to='/macHistory/' key='macHistory'>
                <MenuItem eventKey={6.2}>MAC history</MenuItem>
            </LinkContainer>
        )
    }

    if (UserInfoStore.isAllowed('swInterface')) {
        topology.push(
            <LinkContainer to='/swInterface/' key='swInterface'>
                <MenuItem eventKey={6.3}>Switch interfaces</MenuItem>
            </LinkContainer>
        )
    }

    if (UserInfoStore.isAllowed('cfgPattern')) {
        topology.push(
            <LinkContainer to='/cfgPattern/' key='cfgPattern'>
                <MenuItem eventKey={6.4}>Config patterns</MenuItem>
            </LinkContainer>
        )
    }

    if (UserInfoStore.isAllowed('switch')) {
        topology.push(
            <LinkContainer to='/switch/' key='switch'>
                <MenuItem eventKey={6.5}>Switches</MenuItem>
            </LinkContainer>
        )
    }

    if (topology.length > 0) {
        res.push(
          <NavDropdown eventKey={6} title='Topology' id="basic-nav-dropdown">
              {topology}
          </NavDropdown>
        )
    }

    return res
  },

  render() {
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

           <Nav className='navbar-nav navbar-primary navbar-inverse'>
              {this.getAvailableLinks()}
           </Nav>
    </div>
    )
  }
})

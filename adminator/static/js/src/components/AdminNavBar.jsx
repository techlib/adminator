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
            <LinkContainer to='/device/' key='device' eventKey={1}>
                <NavItem >Devices</NavItem>
            </LinkContainer>
        )
    }

    if (UserInfoStore.isAllowed('network')) {
        res.push(
            <LinkContainer to='/network/' key='network' eventKey={2}>
                <NavItem>Networks</NavItem>
            </LinkContainer>
        )
    }

    if (UserInfoStore.isAllowed('dns')) {
        res.push(
            <LinkContainer to='/domain/' key='domain' eventKey={3}>
                <NavItem>Domains</NavItem>
            </LinkContainer>
        )
    }

    if (UserInfoStore.isAllowed('dns')) {
        res.push(
            <LinkContainer to='/record/' key='record' eventKey={4}>
                <NavItem>Records</NavItem>
            </LinkContainer>
        )
    }

    if (UserInfoStore.isAllowed('lease')) {
        res.push(
            <LinkContainer to='/lease/' key='lease' eventKey={5}>
                <NavItem>Leases</NavItem>
            </LinkContainer>
        )
    }

    var topology = []

    if (UserInfoStore.isAllowed('topology')) {
        topology.push(
            <LinkContainer to='/topology/' key='topology' eventKey={6.1}>
                <MenuItem>Topology</MenuItem>
            </LinkContainer>
        )
    }

    if (UserInfoStore.isAllowed('macHistory')) {
        topology.push(
            <LinkContainer to='/macHistory/' key='macHistory' eventKey={6.2}>
                <MenuItem>MAC history</MenuItem>
            </LinkContainer>
        )
    }

    if (UserInfoStore.isAllowed('swInterface')) {
        topology.push(
            <LinkContainer to='/swInterface/' key='swInterface' eventKey={6.3}>
                <MenuItem>Switch interfaces</MenuItem>
            </LinkContainer>
        )
    }

    if (UserInfoStore.isAllowed('cfgPattern')) {
        topology.push(
            <LinkContainer to='/cfgPattern/' key='cfgPattern' eventKey={6.4}>
                <MenuItem>Config patterns</MenuItem>
            </LinkContainer>
        )
    }

    if (UserInfoStore.isAllowed('switch')) {
        topology.push(
            <LinkContainer to='/switch/' key='switch' eventKey={6.5}>
                <MenuItem>Switches</MenuItem>
            </LinkContainer>
        )
    }

    if (topology.length > 0) {
        res.push(
          <NavDropdown title='Topology' eventKey={6} id="basic-nav-dropdown">
              {topology}
          </NavDropdown>
        )
    }

    return res
  },

  render() {
    return (
    <div className='navbar navbar-pf navbar-default'>
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

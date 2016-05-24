var AdminNavbar = React.createClass({
  mixins: [Reflux.connect(UserInfoStore, 'user')],

  getInitialState() {
    return {user: {}}
  },

  render(){
    return (
    <div className='navbar navbar-pf'>
      <Navbar.Header>
        <Navbar.Brand>
          <img src="/static/img/brand.svg" alt="PatternFly Enterprise Application" />
        </Navbar.Brand>
    </Navbar.Header>

            <Nav className="nav navbar-nav navbar-utility">
                <li>
                    <a href="#">
                        <span className="pficon pficon-user"></span>
                        {this.state.user.username}
                    </a>
                </li>
           </Nav>

           <Nav className='navbar-nav navbar-primary'>
              <LinkContainer to='/device/'>
                <NavItem eventKey={2}>
                  Devices
                </NavItem>
              </LinkContainer>
              <LinkContainer to='/network/'>
                <NavItem eventKey={2}>
                  Networks
                </NavItem>
              </LinkContainer>
              <LinkContainer to='/domain/'>
                <NavItem eventKey={2}>
                  Domains
                </NavItem>
              </LinkContainer>
              <LinkContainer to='/record/'>
                <NavItem eventKey={2}>
                  Records
                </NavItem>
              </LinkContainer>
              <LinkContainer to='/lease/'>
                <NavItem eventKey={2}>
                  Leases
                </NavItem>
              </LinkContainer>
            </Nav>
    </div>
    )
  }
})


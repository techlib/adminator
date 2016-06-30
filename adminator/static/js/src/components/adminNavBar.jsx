var AdminNavbar = React.createClass({
  mixins: [Reflux.connect(UserInfoStore, 'user')],

  getInitialState() {
    return {user: {}}
  },

  getAvailableLinks() {
    var res = []

    if (UserInfoStore.isAllowed( 'device')) {
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

   return res;
  },

  render(){
    return (
    <div className='navbar navbar-pf'>
      <Navbar.Header>
          <Navbar.Brand>
              <b>ADMINATOR</b> Network management
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
              {this.getAvailableLinks()}
           </Nav>
    </div>
    )
  }
})


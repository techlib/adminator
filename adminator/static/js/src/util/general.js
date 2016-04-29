_.mixin({
  compact: function(o) {
     var clone = _.clone(o);
     _.each(clone, function(v, k) {
       if(!v) {
         delete clone[k];
       }
     });
     return clone;
  }
});

var AdminNavbar = React.createClass({
  render(){
    return (
    <div className='navbar navbar-pf'>
      <Navbar.Header>
        <Navbar.Brand>
          <img src="/static/img/brand.svg" alt="PatternFly Enterprise Application" />
        </Navbar.Brand>
      </Navbar.Header>
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


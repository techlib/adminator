var AdminNavbar = React.createClass({
  render(){
    return (
    <Navbar>
     <Nav>
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
        <LinkContainer to='/user/'>
          <NavItem eventKey={2}>
            Users
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
      </Nav>
    </Navbar>
    )
  }
})




function regexGridFilter(filter, item, deep) {
  if(typeof deep !== 'object'){
    var deep = this.deep;
  }
  var arr = deep.keys(item);
  var filterArr = s.trim(filter).split(' ');
  var c = 0;
  for (var j = 0; j < filterArr.length; j++){
   for (var i = 0; i < arr.length; i++) {
    if(filterArr[j][0] == '/'){
      var re = new RegExp(filterArr[j].substring(1))
      if ((deep.getAt(item, arr[i]) || "").toString().search(re) >= 0) {
        c++;
        break;
      }
    } else {
      if(typeof(deep.getAt(item, arr[i])) == 'object' && deep.getAt(item, arr[i]) !== null){
        for (var k in deep.getAt(item, arr[i])){
          return regexGridFilter(filter, deep.getAt(item, arr[i])[k], deep)
        }
      }
      if ((deep.getAt(item, arr[i]) || "").toString().toLowerCase().indexOf(filterArr[j].toLowerCase()) >= 0) {
       c++;
       break;
      }
    }
   }
  }
  if(c == filterArr.length){
     return true;
  }
  return false;
}

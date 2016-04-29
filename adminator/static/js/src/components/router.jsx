ReactDOM.render((
  <Router>
    <Route path="/domain" component={Domain} />
    <Route path="/domain/:id" component={DomainDetail} />
    <Route path="/domainEdit/:id" component={DomainEdit} />
    <Route path="/network" component={Network} />
    <Route path="/network/:id" component={NetworkEdit} />
    <Route path="/device" component={Device} />
    <Route path="/device/:id" component={DeviceDetail} />
    <Route path="/record/:id" component={RecordDetail} />
    <Route path="/record/" component={Record} />
    <Route path="/lease/" component={Lease} />
  </Router>
 ), document.getElementById("AdminatorApp")
)

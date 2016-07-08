function onRouterUpdate(a,b) {
    FeedbackActions.clear();
};
ReactDOM.render((
  <Router onUpdate={onRouterUpdate} history={BrowserHistory}>
    <Route path="/" component={App}>
        <ReactRouter.IndexRedirect to='/device' />
        <Route path="/dhcp" component={Dhcp} />
        <Route path="/domain" component={Domain} />
        <Route path="/domain/:id" component={DomainDetail} />
        <Route path="/domainEdit/:id" component={DomainEdit} />
        <Route path="/network/acl" component={NetworkAclList} />
        <Route path="/network/acl/:id" component={NetworkAclEdit} />
        <Route path="/network" component={NetworkList} />
        <Route path="/network/new" component={NetworkNew} />
        <Route path="/network/:id" component={NetworkEdit} />
        <Route path="/device" component={DeviceList} />
        <Route path="/device/new" component={DeviceNew} />
        <Route path="/device/:id" component={DeviceEdit} />
        <Route path="/record/:id" component={RecordDetail} />
        <Route path="/record/" component={Record} />
        <Route path="/lease/" component={Lease} />
    </Route>
  </Router>
 ), document.getElementById("AdminatorApp")
)

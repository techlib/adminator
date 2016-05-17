"use strict";

function onRouterUpdate(a, b) {
  FeedbackActions.clear();
};
ReactDOM.render(React.createElement(
  Router,
  { onUpdate: onRouterUpdate, history: BrowserHistory },
  React.createElement(Route, { path: "/dhcp", component: Dhcp }),
  React.createElement(Route, { path: "/domain", component: Domain }),
  React.createElement(Route, { path: "/domain/:id", component: DomainDetail }),
  React.createElement(Route, { path: "/domainEdit/:id", component: DomainEdit }),
  React.createElement(Route, { path: "/network", component: NetworkList }),
  React.createElement(Route, { path: "/network/new", component: NetworkNew }),
  React.createElement(Route, { path: "/network/:id", component: NetworkEdit }),
  React.createElement(Route, { path: "/", component: Device }),
  React.createElement(Route, { path: "/device", component: Device }),
  React.createElement(Route, { path: "/device/:id", component: DeviceDetail }),
  React.createElement(Route, { path: "/record/:id", component: RecordDetail }),
  React.createElement(Route, { path: "/record/", component: Record }),
  React.createElement(Route, { path: "/lease/", component: Lease })
), document.getElementById("AdminatorApp"));
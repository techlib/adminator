"use strict";

ReactDOM.render(React.createElement(
  Router,
  null,
  React.createElement(Route, { path: "/domain", component: Domain }),
  React.createElement(Route, { path: "/domain/:id", component: DomainDetail }),
  React.createElement(Route, { path: "/domainEdit/:id", component: DomainEdit }),
  React.createElement(Route, { path: "/network", component: Network }),
  React.createElement(Route, { path: "/network/:id", component: NetworkEdit }),
  React.createElement(Route, { path: "/device", component: Device }),
  React.createElement(Route, { path: "/device/:id", component: DeviceDetail }),
  React.createElement(Route, { path: "/record/:id", component: RecordDetail }),
  React.createElement(Route, { path: "/record/", component: Record }),
  React.createElement(Route, { path: "/lease/", component: Lease })
), document.getElementById("AdminatorApp"));
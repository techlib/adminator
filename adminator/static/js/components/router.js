"use strict";

function onRouterUpdate(a, b) {
    FeedbackActions.clear();
};
ReactDOM.render(React.createElement(
    Router,
    { onUpdate: onRouterUpdate, history: BrowserHistory },
    React.createElement(
        Route,
        { path: "/", component: App },
        React.createElement(ReactRouter.IndexRedirect, { to: "/device" }),
        React.createElement(Route, { path: "/dhcp", component: Dhcp }),
        React.createElement(Route, { path: "/domain", component: Domain }),
        React.createElement(Route, { path: "/domain/:id", component: DomainDetail }),
        React.createElement(Route, { path: "/domainEdit/:id", component: DomainEdit }),
        React.createElement(Route, { path: "/network", component: NetworkList }),
        React.createElement(Route, { path: "/network/new", component: NetworkNew }),
        React.createElement(Route, { path: "/network/:id", component: NetworkEdit }),
        React.createElement(Route, { path: "/device", component: DeviceList }),
        React.createElement(Route, { path: "/device/new", component: DeviceNew }),
        React.createElement(Route, { path: "/device/:id", component: DeviceEdit }),
        React.createElement(Route, { path: "/record/:id", component: RecordDetail }),
        React.createElement(Route, { path: "/record/", component: Record }),
        React.createElement(Route, { path: "/lease/", component: Lease })
    )
), document.getElementById("AdminatorApp"));
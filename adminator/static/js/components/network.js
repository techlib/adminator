"use strict";

var NetLink = React.createClass({
    displayName: "NetLink",

    render: function render() {
        return React.createElement(
            Link,
            { to: "/network/" + this.props.rowData.uuid },
            this.props.data
        );
    }
});

var NetActions = React.createClass({
    displayName: "NetActions",

    render: function render() {
        return React.createElement(
            OverlayTrigger,
            { placement: "top", overlay: React.createElement(
                    Tooltip,
                    null,
                    "Delete"
                ) },
            React.createElement(
                Button,
                { bsStyle: "danger" },
                React.createElement("i", { className: "fa fa-trash-o" })
            )
        );
    }
});

var Network = React.createClass({
    displayName: "Network",

    mixins: [Reflux.connect(networkStore, 'data')],

    componentDidMount: function componentDidMount() {
        NetworkActions.list();
    },

    getInitialState: function getInitialState() {
        this.state = { 'data': { 'list': [], 'network': {} } };
        return this.state;
    },

    colMetadata: [{ columnName: 'description', displayName: 'Description',
        customComponent: NetLink }, { columnName: 'vlan', displayName: 'VLAN' }, { columnName: 'prefix', displayName: 'Prefix' }, { columnName: 'max_lease', displayName: 'Max. lease' }, { columnName: 'controls', displayName: 'Actions',
        customComponent: NetActions }],

    render: function render() {
        return React.createElement(
            "div",
            null,
            React.createElement(AdminNavbar, null),
            React.createElement(
                "div",
                { className: "col-xs-12 container" },
                React.createElement(
                    "h3",
                    null,
                    "Networks"
                ),
                React.createElement(Griddle, { results: this.state.data['list'],
                    tableClassName: "table table-striped table-hover",
                    columnMetadata: this.colMetadata,
                    useGriddleStyles: false,
                    showFilter: true,
                    columns: ['description', 'vlan', 'prefix', 'max_lease', 'controls'],
                    showPager: false
                })
            )
        );
    }
});
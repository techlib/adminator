"use strict";

var Lease4ActionsComponent = React.createClass({
  displayName: "Lease4ActionsComponent",

  deleteLease4: function deleteLease4() {
    Lease4Actions["delete"](this.props.rowData.address);
  },
  render: function render() {
    return React.createElement(
      ButtonGroup,
      null,
      React.createElement(
        OverlayTrigger,
        { placement: "top", overlay: React.createElement(
            Tooltip,
            { id: this.props.rowData.address },
            "Delete"
          ) },
        React.createElement(
          Button,
          { bsStyle: "danger", onClick: this.deleteLease4 },
          React.createElement("i", { className: "fa fa-trash-o" })
        )
      )
    );
  }
});

var Lease6ActionsComponent = React.createClass({
  displayName: "Lease6ActionsComponent",

  deleteLease6: function deleteLease6() {
    Lease6Actions["delete"](this.props.rowData.address);
  },
  render: function render() {
    return React.createElement(
      ButtonGroup,
      null,
      React.createElement(
        OverlayTrigger,
        { placement: "top", overlay: React.createElement(
            Tooltip,
            null,
            "Delete"
          ) },
        React.createElement(
          Button,
          { bsStyle: "danger", onClick: this.deleteLease6 },
          React.createElement("i", { className: "fa fa-trash-o" })
        )
      )
    );
  }
});

var LeaseStateComponent = React.createClass({
  displayName: "LeaseStateComponent",

  render: function render() {
    var txt = this.props.data;
    switch (this.props.data) {
      case 0:
        txt = 'default';
        break;
      case 1:
        txt = 'declined';
        break;
      case 2:
        txt = 'expired-reclaimed';
        break;
    }
    return React.createElement(
      "span",
      null,
      txt
    );
  }
});

var LeaseMacComponent = React.createClass({
  displayName: "LeaseMacComponent",

  render: function render() {
    return React.createElement(
      "span",
      null,
      formatMac(this.props.data)
    );
  }
});

var LeaseDateComponent = React.createClass({
  displayName: "LeaseDateComponent",

  render: function render() {
    var txt = moment.parseZone(this.props.data).format('DD. MM. YYYY HH:mm:ss');
    return React.createElement(
      "span",
      null,
      txt
    );
  }
});

var Lease = React.createClass({
  displayName: "Lease",

  mixins: [Reflux.connect(lease4Store, 'lease4data'), Reflux.connect(lease6Store, 'lease6data')],

  componentDidMount: function componentDidMount() {
    Lease4Actions.list();
    Lease6Actions.list();
  },

  getInitialState: function getInitialState() {
    return { lease4data: {}, lease6data: {} };
  },

  render: function render() {
    var lease4ColumnMeta = [{
      columnName: 'actions',
      displayName: 'Actions',
      customComponent: Lease4ActionsComponent
    }, {
      columnName: 'address',
      displayName: 'IP'
    }, {
      columnName: 'hwaddr',
      displayName: 'MAC',
      customComponent: LeaseMacComponent
    }, {
      columnName: 'expire',
      displayName: 'Expire',
      customComponent: LeaseDateComponent
    }, {
      columnName: 'valid_lifetime',
      displayName: 'Valid lifetime'
    }, {
      columnName: 'state',
      displayName: 'State',
      customComponent: LeaseStateComponent
    }, {
      columnName: 'hostname',
      displayName: 'Hostname'
    }];
    var lease6ColumnMeta = [{
      columnName: 'actions',
      displayName: 'Actions',
      customComponent: Lease6ActionsComponent
    }, {
      columnName: 'address',
      displayName: 'IP'
    }, {
      columnName: 'hwaddr',
      displayName: 'MAC',
      customComponent: LeaseMacComponent
    }, {
      columnName: 'expire',
      displayName: 'Expire',
      customComponent: LeaseDateComponent
    }, {
      columnName: 'valid_lifetime',
      displayName: 'Valid lifetime'
    }, {
      columnName: 'state',
      displayName: 'State',
      customComponent: LeaseStateComponent
    }, {
      columnName: 'hostname',
      displayName: 'Hostname'
    }];

    return React.createElement(
      "div",
      { className: "col-xs-12 container-fluid" },
      React.createElement(
        "h1",
        null,
        "Leases"
      ),
      React.createElement(
        "ul",
        { className: "nav nav-tabs", role: "tablist" },
        React.createElement(
          "li",
          { role: "presentation", className: "active" },
          React.createElement(
            "a",
            { href: "#ipv4", "aria-controls": "ipv4", role: "tab", "data-toggle": "tab" },
            "IPv4"
          )
        ),
        React.createElement(
          "li",
          { role: "presentation" },
          React.createElement(
            "a",
            { href: "#ipv6", "aria-controls": "profile", role: "ipv6", "data-toggle": "tab" },
            "IPv6"
          )
        )
      ),
      React.createElement(
        "div",
        { className: "tab-content" },
        React.createElement(
          "div",
          { role: "tabpanel", className: "tab-pane active", id: "ipv4" },
          React.createElement(Griddle, { results: this.state.lease4data['list'],
            tableClassName: "datatable table table-striped table-hover table-bordered datatable",
            useGriddleStyles: false,
            showFilter: true,
            useCustomPagerComponent: "true",
            customPagerComponent: Pager,
            sortAscendingComponent: React.createElement("span", { classNameName: "fa fa-sort-alpha-asc" }),
            sortDescendingComponent: React.createElement("span", { classNameName: "fa fa-sort-alpha-desc" }),
            resultsPerPage: "20",
            customFilterer: regexGridFilter,
            useCustomFilterer: "true",
            columns: ['address', 'hwaddr', 'expire', 'valid_lifetime', 'state', 'hostname', 'actions'],
            columnMetadata: lease4ColumnMeta
          })
        ),
        React.createElement(
          "div",
          { role: "tabpanel", className: "tab-pane", id: "ipv6" },
          React.createElement(Griddle, { results: this.state.lease6data['list'],
            tableClassName: "datatable table table-striped table-hover table-bordered datatable",
            useGriddleStyles: false,
            showFilter: true,
            useCustomPagerComponent: "true",
            customPagerComponent: Pager,
            sortAscendingComponent: React.createElement("span", { classNameName: "fa fa-sort-alpha-asc" }),
            sortDescendingComponent: React.createElement("span", { classNameName: "fa fa-sort-alpha-desc" }),
            resultsPerPage: "20",
            customFilterer: regexGridFilter,
            useCustomFilterer: "true",
            columns: ['address', 'hwaddr', 'expire', 'valid_lifetime', 'state', 'hostname', 'actions'],
            columnMetadata: lease6ColumnMeta
          })
        )
      )
    );
  }

});
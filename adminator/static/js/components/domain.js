"use strict";

var DomainNameComponent = React.createClass({
  displayName: "DomainNameComponent",

  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        Link,
        { to: "/domainEdit/" + this.props.rowData.id },
        this.props.data
      )
    );
  }
});

var DomainActionsComponent = React.createClass({
  displayName: "DomainActionsComponent",

  deleteDomain: function deleteDomain() {
    DomainActions["delete"](this.props.rowData.id);
  },
  render: function render() {
    return React.createElement(
      ButtonGroup,
      null,
      React.createElement(
        LinkContainer,
        { to: "/domain/" + this.props.rowData.id },
        React.createElement(
          OverlayTrigger,
          { placement: "top", overlay: React.createElement(
              Tooltip,
              null,
              "Records"
            ) },
          React.createElement(
            Button,
            { bsStyle: "info" },
            React.createElement("i", { className: "fa fa-list-alt" })
          )
        )
      ),
      React.createElement(
        OverlayTrigger,
        { placement: "top", overlay: React.createElement(
            Tooltip,
            null,
            "Delete"
          ) },
        React.createElement(
          Button,
          { bsStyle: "danger", onClick: this.deleteDomain },
          React.createElement("i", { className: "fa fa-trash-o" })
        )
      )
    );
  }
});

var Domain = React.createClass({
  displayName: "Domain",

  mixins: [Reflux.connect(domainStore, 'data')],

  componentDidMount: function componentDidMount() {
    DomainActions.list();
  },

  getInitialState: function getInitialState() {
    return { data: { list: [] } };
  },

  getList: function getList() {
    var columnMeta = [{
      columnName: 'actions',
      displayName: 'Actions',
      customComponent: DomainActionsComponent
    }, {
      columnName: 'name',
      displayName: 'Name',
      customComponent: DomainNameComponent
    }];

    return React.createElement(
      "div",
      null,
      React.createElement(AdminNavbar, null),
      React.createElement(
        "div",
        { className: "container-fluid" },
        React.createElement(AlertSet, { alerts: this.state.alerts })
      ),
      React.createElement(
        "div",
        { className: "col-xs-12" },
        React.createElement(
          "div",
          { className: "container-fluid" },
          React.createElement(
            "h3",
            null,
            "Domains"
          ),
          React.createElement(
            "a",
            { className: "btn btn-success pull-right", href: "#/domainEdit/new" },
            React.createElement("i", { className: "fa fa-plus" }),
            " New domain"
          ),
          React.createElement(Griddle, { results: this.state.data['list'],
            tableClassName: "table table-bordered table-striped table-hover",
            useGriddleStyles: false,
            showFilter: false,
            useCustomPagerComponent: "true",
            customPagerComponent: Pager,
            sortAscendingComponent: React.createElement("span", { className: "fa fa-sort-alpha-asc" }),
            sortDescendingComponent: React.createElement("span", { className: "fa fa-sort-alpha-desc" }),
            resultsPerPage: "20",
            columns: ['name', 'actions'],
            columnMetadata: columnMeta
          })
        )
      )
    );
  },

  render: function render() {
    return this.getList();
  }
});
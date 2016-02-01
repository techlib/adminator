"use strict";

var DomainIdComponent = React.createClass({
  displayName: "DomainIdComponent",

  deleteDomain: function deleteDomain() {
    DomainActions["delete"](this.props.data);
  },
  render: function render() {
    return React.createElement(
      ButtonGroup,
      null,
      React.createElement(
        LinkContainer,
        { to: "/domain/" + this.props.data },
        React.createElement(
          OverlayTrigger,
          { placement: "top", overlay: React.createElement(
              Tooltip,
              null,
              "Records"
            ) },
          React.createElement(
            Button,
            { className: "btn-info" },
            React.createElement("i", { className: "fa fa-list-alt" })
          )
        )
      ),
      React.createElement(
        LinkContainer,
        { to: "/domainEdit/" + this.props.data },
        React.createElement(
          OverlayTrigger,
          { placement: "top", overlay: React.createElement(
              Tooltip,
              null,
              "Edit"
            ) },
          React.createElement(
            Button,
            { className: "btn-primary" },
            React.createElement("i", { className: "fa fa-pencil-square-o" })
          )
        )
      ),
      React.createElement(
        LinkContainer,
        { to: "/domainEdit/" + this.props.data },
        React.createElement(
          OverlayTrigger,
          { placement: "top", overlay: React.createElement(
              Tooltip,
              null,
              "Delete"
            ) },
          React.createElement(
            Button,
            { className: "btn-danger", onClick: this.deleteDomain },
            React.createElement("i", { className: "fa fa-trash-o" })
          )
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
      columnName: 'id',
      customComponent: DomainIdComponent
    }];

    return React.createElement(
      "div",
      null,
      React.createElement(AdminNavbar, null),
      React.createElement(
        "div",
        { className: "col-xs-12 container well" },
        React.createElement(
          "h3",
          null,
          "Domains"
        ),
        React.createElement(Griddle, { results: this.state.data['list'],
          tableClassName: "table table-striped table-hover",
          useGriddleStyles: false,
          showFilter: false,
          useCustomPagerComponent: "true",
          customPagerComponent: Pager,
          showSettings: true,
          settingsToggleClassName: "btn pull-right",
          sortAscendingComponent: React.createElement("span", { className: "fa fa-sort-alpha-asc" }),
          sortDescendingComponent: React.createElement("span", { className: "fa fa-sort-alpha-desc" }),
          resultsPerPage: "20",
          columns: ['name', 'id'],
          changeFilter: this.setFilter,
          columnMetadata: columnMeta
        })
      )
    );
  },

  render: function render() {
    return this.getList();
  }
});
"use strict";

var DeviceDescComponent = React.createClass({
  displayName: "DeviceDescComponent",

  render: function render() {
    return React.createElement(
      Link,
      { to: "/device/" + this.props.rowData.uuid },
      this.props.data
    );
  }
});

var DeviceActionsComponent = React.createClass({
  displayName: "DeviceActionsComponent",

  deleteDevice: function deleteDevice() {
    DeviceActions["delete"](this.props.rowData.uuid);
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
          { bsStyle: "danger", onClick: this.deleteDevice },
          React.createElement("i", { className: "fa fa-trash-o" })
        )
      )
    );
  }
});

var DeviceInterfacesComponent = React.createClass({
  displayName: "DeviceInterfacesComponent",

  render: function render() {
    return React.createElement(
      "div",
      null,
      this.props.data.map(function (item) {
        return React.createElement(
          "div",
          null,
          React.createElement(
            OverlayTrigger,
            { placement: "right", overlay: React.createElement(
                Tooltip,
                null,
                item.hostname ? item.hostname : 'No hostname',
                " ",
                React.createElement("br", null),
                item.ip4addr ? item.ip4addr : 'Dynamic IPv4',
                " ",
                React.createElement("br", null),
                item.ip6addr ? item.ip6addr : 'Dynamic IPv6'
              ) },
            React.createElement(
              "span",
              { className: "label label-warning" },
              item.macaddr
            )
          )
        );
      })
    );
  }

});

var DeviceValidComponent = React.createClass({
  displayName: "DeviceValidComponent",

  getInitialState: function getInitialState() {
    if (this.props.data == null) {
      return { 'start': '', 'end': '' };
    }
    if (this.props.data[0] != null) {
      var start = moment(this.props.data[0]).format('DD. MM. YYYY');
    }
    if (this.props.data[1] != null) {
      var end = moment(this.props.data[1]).format('DD. MM. YYYY');
    }
    return { 'start': start, 'end': end };
  },
  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "div",
        null,
        React.createElement(
          "span",
          { className: "label label-primary" },
          this.state.start
        ),
        React.createElement(
          "span",
          { className: "label label-success" },
          this.state.end
        )
      )
    );
  }
});

var DeviceUserComponent = React.createClass({
  displayName: "DeviceUserComponent",

  getInitialState: function getInitialState() {
    if (this.props.data == null) {
      return {};
    } else {
      return { 'id': this.props.data, 'name': this.props.rowData.users.display_name };
    }
    this.props.rowData;
  },
  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        OverlayTrigger,
        { placement: "left", overlay: React.createElement(
            Tooltip,
            null,
            this.state.id
          ) },
        React.createElement(
          "div",
          null,
          this.state.name
        )
      )
    );
  }
});

var Device = React.createClass({
  displayName: "Device",

  mixins: [Reflux.connect(deviceStore, 'data')],

  componentDidMount: function componentDidMount() {
    DeviceActions.list();
  },

  getInitialState: function getInitialState() {
    return { data: { list: [] } };
  },

  render: function render() {
    var columnMeta = [{
      columnName: 'actions',
      displayName: 'Actions',
      customComponent: DeviceActionsComponent
    }, {
      columnName: 'description',
      displayName: 'Description',
      customComponent: DeviceDescComponent
    }, {
      columnName: 'valid',
      displayName: 'Valid',
      customComponent: DeviceValidComponent
    }, {
      columnName: 'user',
      displayName: 'User',
      customComponent: DeviceUserComponent
    }, {
      columnName: 'type',
      displayName: 'Type'
    }, {
      columnName: 'interfaces',
      displayName: 'Interfaces',
      customComponent: DeviceInterfacesComponent
    }];

    return React.createElement(
      "div",
      null,
      React.createElement(AdminNavbar, null),
      React.createElement(
        "div",
        { className: "col-xs-12" },
        React.createElement(
          "div",
          { className: "container-fluid" },
          React.createElement(
            "h3",
            null,
            "Devices"
          ),
          React.createElement(
            "a",
            { className: "btn btn-success pull-right", href: "#/device/new" },
            React.createElement("i", { className: "fa fa-plus" }),
            " New device"
          )
        ),
        React.createElement(
          "div",
          { className: "container-fluid" },
          React.createElement(Griddle, { results: this.state.data.list,
            tableClassName: "table table-bordered table-striped table-hover",
            useGriddleStyles: false,
            showFilter: true,
            useCustomPagerComponent: "true",
            customPagerComponent: Pager,
            sortAscendingComponent: React.createElement("span", { className: "fa fa-sort-alpha-asc" }),
            sortDescendingComponent: React.createElement("span", { className: "fa fa-sort-alpha-desc" }),
            columns: ['interfaces', 'description', 'type', 'user', 'valid', 'actions'],
            resultsPerPage: "20",
            customFilter: regexGridFilter,
            columnMetadata: columnMeta
          })
        )
      )
    );
  }
});
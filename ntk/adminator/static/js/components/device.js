"use strict";

var DeviceIdComponent = React.createClass({
  displayName: "DeviceIdComponent",

  deleteDevice: function deleteDevice() {
    DeviceActions["delete"](this.props.data);
  },
  render: function render() {
    return React.createElement(
      ButtonGroup,
      null,
      React.createElement(
        LinkContainer,
        { to: "/device/" + this.props.data },
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
        OverlayTrigger,
        { placement: "top", overlay: React.createElement(
            Tooltip,
            null,
            "Delete"
          ) },
        React.createElement(
          Button,
          { className: "btn-danger", onClick: this.deleteDevice },
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
            { placement: "left", overlay: React.createElement(
                Tooltip,
                null,
                item.hostname,
                " ",
                React.createElement("br", null),
                " ",
                item.ip4addr,
                " ",
                React.createElement("br", null),
                " ",
                item.ip6addr
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
      columnName: 'uuid',
      customComponent: DeviceIdComponent
    }, {
      columnName: 'valid',
      customComponent: DeviceValidComponent
    }, {
      columnName: 'user',
      customComponent: DeviceUserComponent
    }, {
      columnName: 'interfaces',
      customComponent: DeviceInterfacesComponent
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
          "Devices"
        ),
        React.createElement(Griddle, { results: this.state.data.list,
          tableClassName: "table table-striped table-hover",
          useGriddleStyles: false,
          showFilter: true,
          useCustomPagerComponent: "true",
          customPagerComponent: Pager,
          showSettings: true,
          settingsToggleClassName: "btn pull-right",
          sortAscendingComponent: React.createElement("span", { className: "fa fa-sort-alpha-asc" }),
          sortDescendingComponent: React.createElement("span", { className: "fa fa-sort-alpha-desc" }),
          columns: ['interfaces', 'description', 'type', 'user', 'valid', 'uuid'],
          resultsPerPage: "20",
          customFilter: regexGridFilter,
          columnMetadata: columnMeta
        })
      )
    );
  }
});
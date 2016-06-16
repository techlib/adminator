'use strict';

var DeviceDescComponent = React.createClass({
  displayName: 'DeviceDescComponent',

  render: function render() {
    return React.createElement(
      Link,
      { to: '/device/' + this.props.rowData.uuid },
      this.props.data
    );
  }
});

var DeviceActionsComponent = React.createClass({
  displayName: 'DeviceActionsComponent',

  mixins: [ModalConfirmMixin],

  deleteDevice: function deleteDevice() {
    var _this = this;

    var name = this.props.rowData.description;
    this.modalConfirm('Confirm delete', 'Delete ' + name + '?', { 'confirmLabel': 'DELETE', 'confirmClass': 'danger' }).then(function () {
      DeviceActions['delete'](_this.props.rowData.uuid);
    });
  },
  render: function render() {
    return React.createElement(
      ButtonGroup,
      null,
      React.createElement(
        OverlayTrigger,
        { placement: 'top', overlay: React.createElement(
            Tooltip,
            { id: this.props.rowData.uuid },
            'Delete'
          ) },
        React.createElement(
          Button,
          { bsStyle: 'danger', onClick: this.deleteDevice },
          React.createElement('i', { className: 'fa fa-trash-o' })
        )
      )
    );
  }
});

var DeviceInterfacesComponent = React.createClass({
  displayName: 'DeviceInterfacesComponent',

  render: function render() {
    return React.createElement(
      'div',
      null,
      this.props.data.map(function (item) {
        return React.createElement(
          'div',
          { key: item.uuid },
          React.createElement(
            OverlayTrigger,
            { placement: 'right', overlay: React.createElement(
                Tooltip,
                { id: item.uuid },
                item.hostname ? item.hostname : 'No hostname',
                ' ',
                React.createElement('br', null),
                item.ip4addr ? item.ip4addr : 'Dynamic IPv4',
                ' ',
                React.createElement('br', null),
                item.ip6addr ? item.ip6addr : 'Dynamic IPv6'
              ) },
            React.createElement(
              'code',
              null,
              item.macaddr
            )
          )
        );
      })
    );
  }

});

var DeviceValidComponent = React.createClass({
  displayName: 'DeviceValidComponent',

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
      'div',
      null,
      React.createElement(
        'div',
        null,
        React.createElement(
          'span',
          { className: 'label label-primary' },
          this.state.start
        ),
        React.createElement(
          'span',
          { className: 'label label-success' },
          this.state.end
        )
      )
    );
  }
});

var DeviceUserComponent = React.createClass({
  displayName: 'DeviceUserComponent',

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
      'div',
      null,
      React.createElement(
        OverlayTrigger,
        { placement: 'left', overlay: React.createElement(
            Tooltip,
            { id: 42 },
            this.state.id
          ) },
        React.createElement(
          'div',
          null,
          this.state.name
        )
      )
    );
  }
});

var DeviceList = React.createClass({
  displayName: 'DeviceList',

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
      'div',
      { className: 'container-fluid col-xs-12' },
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'div',
          { className: 'col-xs-12 col-sm-10' },
          React.createElement(
            'h1',
            null,
            'Devices'
          )
        ),
        React.createElement(
          'div',
          { className: 'col-xs-12 col-sm-2 h1 text-right' },
          React.createElement(
            'a',
            { className: 'btn btn-success', href: '#/device/new' },
            React.createElement('i', { className: 'fa fa-plus' }),
            ' New device'
          )
        )
      ),
      React.createElement(Feedback, null),
      React.createElement(Griddle, { results: this.state.data.list,
        tableClassName: 'table table-bordered table-striped table-hover',
        useGriddleStyles: false,
        showFilter: true,
        useCustomPagerComponent: 'true',
        customPagerComponent: Pager,
        sortAscendingComponent: React.createElement('span', { className: 'fa fa-sort-alpha-asc' }),
        sortDescendingComponent: React.createElement('span', { className: 'fa fa-sort-alpha-desc' }),
        columns: ['interfaces', 'description', 'type', 'user', 'valid', 'actions'],
        resultsPerPage: '20',
        customFilterer: regexGridFilter,
        useCustomFilterer: 'true',
        columnMetadata: columnMeta
      })
    );
  }
});
'use strict';

var RecordNameComponent = React.createClass({
  displayName: 'RecordNameComponent',

  render: function render() {
    return React.createElement(
      Link,
      { to: '/record/' + this.props.rowData.id },
      this.props.data
    );
  }
});

var RecordTypeComponent = React.createClass({
  displayName: 'RecordTypeComponent',

  render: function render() {
    var className = '';
    switch (this.props.data) {
      case 'A':
        className = 'label label-a';
        break;
      case 'AAAA':
        className = 'label label-aaaa';
        break;
      case 'SOA':
        className = 'label label-soa';
        break;
      case 'MX':
        className = 'label label-mx';
        break;
      case 'CNAME':
        className = 'label label-cname';
        break;
      case 'SRV':
        className = 'label label-srv';
        break;
      case 'NS':
        className = 'label label-ns';
        break;
      case 'TXT':
        className = 'label label-txt';
        break;
      case 'PTR':
        className = 'label label-ptr';
        break;

    }
    return React.createElement(
      'span',
      { className: className },
      this.props.data
    );
  }
});

var RecordActionsComponent = React.createClass({
  displayName: 'RecordActionsComponent',

  mixins: [ModalConfirmMixin],

  handleDelete: function handleDelete() {
    var _this = this;

    var name = this.props.rowData.name;
    var type = this.props.rowData.type;
    this.modalConfirm('Confirm delete', 'Delete ' + type + ' record ' + name + '?', { 'confirmLabel': 'DELETE', 'confirmClass': 'danger' }).then(function () {
      RecordActions['delete'](_this.props.rowData.id);
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
            null,
            'Delete'
          ) },
        React.createElement(
          Button,
          { bsStyle: 'danger', onClick: this.handleDelete },
          React.createElement('i', { className: 'fa fa-trash-o' })
        )
      )
    );
  }
});

var Record = React.createClass({
  displayName: 'Record',

  mixins: [Reflux.connect(recordStore, 'data')],

  componentDidMount: function componentDidMount() {
    RecordActions.list();
  },

  getInitialState: function getInitialState() {
    return { data: { records: [] } };
  },

  render: function render() {
    var columnMeta = [{
      columnName: 'type',
      displayName: 'Type',
      customComponent: RecordTypeComponent
    }, {
      columnName: 'actions',
      displayName: 'Actions',
      customComponent: RecordActionsComponent
    }, {
      columnName: 'name',
      displayName: 'Name',
      customComponent: RecordNameComponent
    }, {
      columnName: 'type',
      displayName: 'Type'
    }, {
      columnName: 'content',
      displayName: 'Content'
    }];

    return React.createElement(
      'div',
      { className: 'col-xs-12 container-fluid' },
      React.createElement(
        'h1',
        null,
        'Records'
      ),
      React.createElement(RecordCreate, null),
      React.createElement(Griddle, { results: this.state.data['list'],
        tableClassName: 'datatable table table-striped table-hover table-bordered datatable',
        useGriddleStyles: false,
        showFilter: true,
        useCustomPagerComponent: 'true',
        customPagerComponent: Pager,
        sortAscendingComponent: React.createElement('span', { className: 'fa fa-sort-alpha-asc' }),
        sortDescendingComponent: React.createElement('span', { className: 'fa fa-sort-alpha-desc' }),
        columns: ['name', 'type', 'content', 'actions'],
        resultsPerPage: '20',
        customFilterer: regexGridFilter,
        useCustomFilterer: 'true',
        columnMetadata: columnMeta
      })
    );
  }

});
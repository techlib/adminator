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

var RecordContentComponent = React.createClass({
  displayName: 'RecordContentComponent',

  render: function render() {
    return React.createElement(
      'span',
      null,
      this.props.rowData.content
    );
  }
});

var RecordTypeComponent = React.createClass({
  displayName: 'RecordTypeComponent',

  render: function render() {
    if (this.props.data == null) {
      return null;
    }
    var className = 'label label-' + this.props.data.toLowerCase();
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
            { id: "recdelete" + this.props.rowData.id },
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

  mixins: [Reflux.listenTo(recordStore, 'handleData')],

  componentDidMount: function componentDidMount() {
    RecordActions.list();
  },

  handleData: function handleData(data) {
    var records = [];
    _.each(data.list, function (item) {
      if (isIP4(item.content)) {
        item.content_sort = item.content.replace(/\./g, '');
      } else if (isIP6(item.content)) {
        item.content_sort = item.content.replace(/\:/g, '');
      } else {
        item.content_sort = item.content;
      }
      records.push(item);
    });
    this.state.data.list = records;
    this.setState(this.state);
  },

  getInitialState: function getInitialState() {
    return { data: { records: [] }, showNewForm: false };
  },

  showNewRecord: function showNewRecord() {
    this.setState({ showNewForm: !this.state.showNewForm });
  },

  hideNewRecord: function hideNewRecord() {
    this.setState({ showNewForm: false });
  },

  getNewRecordForm: function getNewRecordForm() {
    if (this.state.showNewForm) {
      return React.createElement(RecordCreate, { hideHandler: this.hideNewRecord });
    }
  },

  render: function render() {
    var columnMeta = [{
      columnName: 'type',
      displayName: 'Type',
      customComponent: RecordTypeComponent
    }, {
      columnName: 'actions',
      displayName: '',
      customComponent: RecordActionsComponent
    }, {
      columnName: 'name',
      displayName: 'Name',
      customComponent: RecordNameComponent
    }, {
      columnName: 'type',
      displayName: 'Type'
    }, {
      columnName: 'content_sort',
      displayName: 'Content',
      customComponent: RecordContentComponent
    }];

    return React.createElement(
      'div',
      { className: 'col-xs-12 container-fluid' },
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'div',
          { className: 'col-xs-12 col-sm-10' },
          React.createElement(
            'h1',
            null,
            'Records'
          )
        ),
        React.createElement(
          'div',
          { className: 'col-xs-12 col-sm-2 h1 text-right' },
          React.createElement(
            'a',
            { className: 'btn btn-success', onClick: this.showNewRecord },
            React.createElement('i', { className: 'fa fa-plus' }),
            ' New record'
          )
        )
      ),
      this.getNewRecordForm(),
      React.createElement(Griddle, { results: this.state.data['list'],
        tableClassName: 'datatable table table-striped table-hover table-bordered datatable',
        useGriddleStyles: false,
        showFilter: true,
        useCustomPagerComponent: 'true',
        customPagerComponent: Pager,
        sortAscendingComponent: React.createElement('span', { className: 'fa fa-sort-alpha-asc' }),
        sortDescendingComponent: React.createElement('span', { className: 'fa fa-sort-alpha-desc' }),
        columns: ['name', 'type', 'content_sort', 'actions'],
        resultsPerPage: '20',
        customFilterer: regexGridFilter,
        useCustomFilterer: 'true',
        columnMetadata: columnMeta
      })
    );
  }

});
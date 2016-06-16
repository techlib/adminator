'use strict';

var DomainDetail = React.createClass({
  displayName: 'DomainDetail',

  mixins: [Reflux.connect(domainStore, 'data')],

  componentDidMount: function componentDidMount() {
    var id = this.props.params.id;

    DomainActions.read(id);
  },

  getInitialState: function getInitialState() {
    return { data: { domain: { records: [] } }, showNewForm: false };
  },

  showNewRecord: function showNewRecord() {
    this.setState({ showNewForm: !this.state.showNewForm });
  },

  hideNewRecord: function hideNewRecord() {
    this.setState({ showNewForm: false });
  },

  getNewRecordForm: function getNewRecordForm() {
    if (this.state.showNewForm) {
      return React.createElement(RecordCreate, { domain: this.props.params.id,
        hideHandler: this.hideNewRecord });
    }
  },

  getDetail: function getDetail() {
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
      columnName: 'content',
      displayName: 'Content'
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
      React.createElement(Griddle, { results: this.state.data['domain'].records,
        tableClassName: 'table table-bordered table-striped table-hover',
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
  },

  render: function render() {
    return this.getDetail();
  }
});
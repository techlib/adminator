'use strict';

var DomainDetail = React.createClass({
  displayName: 'DomainDetail',

  mixins: [Reflux.connect(domainStore, 'data')],

  componentDidMount: function componentDidMount() {
    var id = this.props.params.id;

    DomainActions.read(id);
  },

  getInitialState: function getInitialState() {
    return { data: { domain: { records: [] } } };
  },

  getDetail: function getDetail() {
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
      null,
      React.createElement(AdminNavbar, null),
      React.createElement(RecordCreate, { domain: this.props.params.id }),
      React.createElement(
        'div',
        { className: 'col-xs-12 container' },
        React.createElement(
          'h3',
          null,
          'Records'
        ),
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
          customFilter: regexGridFilter,
          columnMetadata: columnMeta
        })
      )
    );
  },

  render: function render() {
    return this.getDetail();
  }
});
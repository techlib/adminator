'use strict';

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

var RecordIdComponent = React.createClass({
  displayName: 'RecordIdComponent',

  deleteRecord: function deleteRecord() {
    RecordActions['delete'](this.props.data);
  },
  render: function render() {
    return React.createElement(
      ButtonGroup,
      null,
      React.createElement(
        LinkContainer,
        { to: '/record/' + this.props.data },
        React.createElement(
          OverlayTrigger,
          { placement: 'top', overlay: React.createElement(
              Tooltip,
              null,
              'Edit'
            ) },
          React.createElement(
            Button,
            { className: 'btn-primary' },
            React.createElement('i', { className: 'fa fa-pencil-square-o' })
          )
        )
      ),
      React.createElement(
        OverlayTrigger,
        { placement: 'top', overlay: React.createElement(
            Tooltip,
            null,
            'Delete'
          ) },
        React.createElement(
          Button,
          { className: 'btn-danger', onClick: this.deleteRecord },
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
      customComponent: RecordTypeComponent
    }, {
      columnName: 'id',
      customComponent: RecordIdComponent
    }];

    return React.createElement(
      'div',
      null,
      React.createElement(AdminNavbar, null),
      React.createElement(RecordCreate, null),
      React.createElement(
        'div',
        { className: 'col-xs-12 container well' },
        React.createElement(
          'h3',
          null,
          'Records'
        ),
        React.createElement(Griddle, { results: this.state.data['list'],
          tableClassName: 'table table-striped table-hover',
          useGriddleStyles: false,
          showFilter: true,
          useCustomPagerComponent: 'true',
          customPagerComponent: Pager,
          showSettings: true,
          settingsToggleClassName: 'btn pull-right',
          sortAscendingComponent: React.createElement('span', { className: 'fa fa-sort-alpha-asc' }),
          sortDescendingComponent: React.createElement('span', { className: 'fa fa-sort-alpha-desc' }),
          columns: ['name', 'type', 'content', 'id'],
          resultsPerPage: '20',
          customFilter: regexGridFilter,
          columnMetadata: columnMeta
        })
      )
    );
  }

});
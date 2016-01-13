'use strict';

var RecordCreate = React.createClass({
  displayName: 'RecordCreate',

  mixins: [Reflux.connect(recordStore, 'record'), Reflux.connect(domainStore, 'data')],

  componentDidMount: function componentDidMount() {
    DomainActions.list();
  },

  getInitialState: function getInitialState() {
    return { record: { type: '' }, alerts: [], data: { list: [] } };
  },

  setType: function setType(type) {
    this.setState({ record: {
        type: type
      }
    });
  },

  handleChange: function handleChange() {
    var i = this.refs.domain.refs.input.selectedIndex;
    var domainName = $(this.refs.domain.refs.input[i]).data('name');
    if (this.state.record.type == 'SRV') {
      var content = this.refs.priority.getValue() + ' ' + this.refs.port.getValue() + ' ' + this.refs.value.getValue();
    } else {
      var content = this.refs.content.getValue();
    }
    this.setState({ record: {
        name: this.refs.name.getValue(),
        content: content,
        type: this.state.record.type,
        domain_id: this.refs.domain.getValue()
      },
      domainName: domainName
    });
  },

  handleSubmit: function handleSubmit() {
    // Append selected domain name if not present
    if (this.state.record.name.indexOf(this.state.domainName) < 0) {
      this.state.record.name = this.state.record.name + '.' + this.state.domainName;
    }
    RecordActions.create(this.state.record);
    this.setState({ alerts: this.state.alerts.concat([new SuccessAlert('Record created')]) });
  },

  renderInput: function renderInput() {
    switch (this.state.record.type) {
      case 'A':
      case 'AAAA':
      case 'CNAME':
      case 'MX':
      case 'PTR':
      case 'NS':
      case 'SOA':
        return React.createElement(
          'div',
          { className: 'form-group' },
          React.createElement(
            'div',
            { className: 'col-xs-8 col-sm-4' },
            React.createElement(Input, {
              type: 'text',
              label: 'Name',
              ref: 'name',
              onChange: this.handleChange,
              value: this.state.record.name })
          ),
          React.createElement(
            'div',
            { className: 'col-xs-8 col-sm-4' },
            React.createElement(Input, {
              type: 'text',
              label: 'Value',
              ref: 'content',
              onChange: this.handleChange,
              value: this.state.record.content })
          )
        );
      case 'SRV':
        var priority = '',
            port = '',
            value = '';

        if (!_.isUndefined(this.state.record.content)) {
          var _state$record$content$split = this.state.record.content.split(' ');

          priority = _state$record$content$split[0];
          port = _state$record$content$split[1];
          value = _state$record$content$split[2];
        }
        return React.createElement(
          'div',
          { className: 'form-group' },
          React.createElement(
            'div',
            { className: 'col-xs-8 col-sm-4' },
            React.createElement(Input, {
              type: 'text',
              label: 'Name',
              ref: 'name',
              onChange: this.handleChange,
              value: this.state.record.name })
          ),
          React.createElement(
            'div',
            { className: 'col-xs-4 col-sm-2' },
            React.createElement(Input, {
              type: 'text',
              label: 'Priority',
              ref: 'priority',
              onChange: this.handleChange,
              value: priority })
          ),
          React.createElement(
            'div',
            { className: 'col-xs-4 col-sm-2' },
            React.createElement(Input, {
              type: 'text',
              label: 'Port',
              ref: 'port',
              onChange: this.handleChange,
              value: port })
          ),
          React.createElement(
            'div',
            { className: 'col-xs-8 col-sm-4' },
            React.createElement(Input, {
              type: 'text',
              label: 'Value',
              ref: 'value',
              onChange: this.handleChange,
              value: value })
          )
        );
        break;
      case 'TXT':
        return React.createElement(
          'div',
          { className: 'form-group' },
          React.createElement(
            'div',
            { className: 'col-xs-4' },
            React.createElement(Input, {
              type: 'text',
              label: 'Name',
              ref: 'name',
              onChange: this.handleChange,
              value: this.state.record.name })
          ),
          React.createElement(
            'div',
            { className: 'col-xs-8' },
            React.createElement(Input, {
              type: 'textarea',
              ref: 'content',
              label: 'Content',
              onChange: this.handleChange,
              value: this.state.record.content })
          )
        );
        break;
    }
  },

  renderDomainSelect: function renderDomainSelect() {
    var rows = [];
    for (var _iterator = this.state.data['list'], _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var domain = _ref;

      rows.push(React.createElement(
        'option',
        { value: domain.id, 'data-name': domain.name },
        domain.name
      ));
    }
    return React.createElement(
      Input,
      { type: 'select', ref: 'domain', onChange: this.handleChange },
      rows
    );
  },

  renderTypeButton: function renderTypeButton(type) {
    return React.createElement(
      Button,
      { className: this.state.record.type == type ? 'btn-' + type.toLowerCase() : '',
        onClick: this.setType.bind(this, type),
        value: type },
      type
    );
  },

  render: function render() {
    return React.createElement(
      'div',
      { className: 'col-xs-8 container well' },
      React.createElement(AlertSet, { alerts: this.state.alerts }),
      React.createElement(
        'h3',
        null,
        'New record'
      ),
      React.createElement(
        'form',
        { onSubmit: this.handleSubmit },
        React.createElement(
          'div',
          { className: 'col-xs-12 col-sm-9' },
          React.createElement(
            'div',
            { className: 'form-group' },
            React.createElement(
              ButtonGroup,
              null,
              this.renderTypeButton('A'),
              this.renderTypeButton('AAAA'),
              this.renderTypeButton('CNAME'),
              this.renderTypeButton('SRV'),
              this.renderTypeButton('PTR'),
              this.renderTypeButton('TXT'),
              this.renderTypeButton('SOA'),
              this.renderTypeButton('NS'),
              this.renderTypeButton('MX')
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'col-xs-12 col-sm-3' },
          this.renderDomainSelect()
        ),
        React.createElement(
          'div',
          { className: 'col-xs-12 col-sm-12' },
          this.renderInput()
        ),
        React.createElement(
          'div',
          { className: 'col-xs-12 col-sm-12' },
          React.createElement(
            'div',
            { className: 'col-xs-8 col-sm-4' },
            React.createElement(ButtonInput, { type: 'submit', className: 'btn-primary', value: 'Save' })
          )
        )
      )
    );
  }
});
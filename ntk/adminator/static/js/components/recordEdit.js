'use strict';

var RecordDetail = React.createClass({
  displayName: 'RecordDetail',

  mixins: [Reflux.connect(recordStore, 'record')],

  componentDidMount: function componentDidMount() {
    var id = this.props.params.id;

    RecordActions.read(id);
  },

  getInitialState: function getInitialState() {
    return { record: { type: '' }, alerts: [] };
  },

  handleChange: function handleChange() {
    this.setState({ record: {
        name: this.refs.name.getValue(),
        content: this.refs.content.getValue(),
        type: this.state.record.type,
        domain_id: this.state.record.domain_id,
        id: this.state.record.id
      }
    });
  },

  handleSrvChange: function handleSrvChange() {
    var content = this.refs.priority.getValue() + ' ' + this.refs.port.getValue() + ' ' + this.refs.value.getValue();
    this.setState({ record: {
        id: this.state.record.id,
        name: this.refs.name.getValue(),
        content: content,
        type: this.state.record.type,
        domain_id: this.state.record.domain_id
      }
    });
  },

  handleSubmit: function handleSubmit() {
    RecordActions.update(this.state.record);
    this.setState({ alerts: this.state.alerts.concat([new SuccessAlert('Record updated')]) });
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
        var _state$record$content$split = this.state.record.content.split(' '),
            priority = _state$record$content$split[0],
            port = _state$record$content$split[1],
            value = _state$record$content$split[2];

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
              onChange: this.handleSrvChange,
              value: this.state.record.name })
          ),
          React.createElement(
            'div',
            { className: 'col-xs-4 col-sm-2' },
            React.createElement(Input, {
              type: 'text',
              label: 'Priority',
              ref: 'priority',
              onChange: this.handleSrvChange,
              value: priority })
          ),
          React.createElement(
            'div',
            { className: 'col-xs-4 col-sm-2' },
            React.createElement(Input, {
              type: 'text',
              label: 'Port',
              ref: 'port',
              onChange: this.handleSrvChange,
              value: port })
          ),
          React.createElement(
            'div',
            { className: 'col-xs-8 col-sm-4' },
            React.createElement(Input, {
              type: 'text',
              label: 'Value',
              ref: 'value',
              onChange: this.handleSrvChange,
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

  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(AlertSet, { alerts: this.state.alerts }),
      React.createElement(
        Navbar,
        null,
        React.createElement(
          Nav,
          null,
          React.createElement(
            LinkContainer,
            { to: '/domain/' },
            React.createElement(
              NavItem,
              { eventKey: 1 },
              'Domains'
            )
          ),
          React.createElement(
            LinkContainer,
            { to: '/domain/' + this.state.record.domain_id },
            React.createElement(
              NavItem,
              { eventKey: 1 },
              'This domain'
            )
          ),
          React.createElement(
            LinkContainer,
            { to: '/record/' },
            React.createElement(
              NavItem,
              { eventKey: 2 },
              'All records'
            )
          )
        )
      ),
      React.createElement(
        'h3',
        null,
        'Record'
      ),
      React.createElement(
        'form',
        { onSubmit: this.handleSubmit },
        React.createElement(
          'div',
          { className: 'col-xs-2 col-sm-1' },
          React.createElement(
            'label',
            null,
            'Type'
          ),
          React.createElement(
            'span',
            { className: 'label label-record label-' + this.state.record.type.toLowerCase() },
            this.state.record.type
          )
        ),
        React.createElement(
          'div',
          { className: 'col-xs-10 col-sm-11' },
          this.renderInput()
        ),
        React.createElement(
          'div',
          { className: 'col-xs-10 col-sm-11 col-sm-offset-1' },
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
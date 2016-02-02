'use strict';

var RecordDetail = React.createClass({
  displayName: 'RecordDetail',

  mixins: [Reflux.connect(recordStore, 'data')],

  componentDidMount: function componentDidMount() {
    var id = this.props.params.id;

    RecordActions.read(id);
  },

  getInitialState: function getInitialState() {
    return { data: { record: { type: '' } }, alerts: [] };
  },

  handleChange: function handleChange() {
    this.setState({ data: { record: {
          name: this.refs.name.getValue(),
          content: this.refs.content.getValue(),
          type: this.state.data.record.type,
          domain_id: this.state.data.record.domain_id,
          id: this.state.data.record.id
        }
      } });
  },

  handleSrvChange: function handleSrvChange() {
    var content = this.refs.priority.getValue() + ' ' + this.refs.port.getValue() + ' ' + this.refs.value.getValue();
    this.setState({ data: { record: {
          id: this.state.data.record.id,
          name: this.refs.name.getValue(),
          content: content,
          type: this.state.data.record.type,
          domain_id: this.state.data.record.domain_id
        }
      } });
  },

  handleSubmit: function handleSubmit() {
    RecordActions.update(this.state.data.record);
    this.setState({ alerts: this.state.alerts.concat([new SuccessAlert('Record updated')]) });
  },

  renderInput: function renderInput() {
    switch (this.state.data.record.type) {
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
              addonBefore: 'Name',
              ref: 'name',
              onChange: this.handleChange,
              value: this.state.data.record.name })
          ),
          React.createElement(
            'div',
            { className: 'col-xs-8 col-sm-4' },
            React.createElement(Input, {
              type: 'text',
              addonBefore: 'Value',
              ref: 'content',
              onChange: this.handleChange,
              value: this.state.data.record.content })
          )
        );
      case 'SRV':
        var _state$data$record$content$split = this.state.data.record.content.split(' '),
            priority = _state$data$record$content$split[0],
            port = _state$data$record$content$split[1],
            value = _state$data$record$content$split[2];

        return React.createElement(
          'div',
          { className: 'form-group' },
          React.createElement(
            'div',
            { className: 'col-xs-8 col-sm-4' },
            React.createElement(Input, {
              type: 'text',
              addonBefore: 'Name',
              ref: 'name',
              onChange: this.handleSrvChange,
              value: this.state.data.record.name })
          ),
          React.createElement(
            'div',
            { className: 'col-xs-4 col-sm-2' },
            React.createElement(Input, {
              type: 'text',
              addonBefore: 'Priority',
              ref: 'priority',
              onChange: this.handleSrvChange,
              value: priority })
          ),
          React.createElement(
            'div',
            { className: 'col-xs-4 col-sm-2' },
            React.createElement(Input, {
              type: 'text',
              addonBefore: 'Port',
              ref: 'port',
              onChange: this.handleSrvChange,
              value: port })
          ),
          React.createElement(
            'div',
            { className: 'col-xs-8 col-sm-4' },
            React.createElement(Input, {
              type: 'text',
              addonBefore: 'Value',
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
              addonBefore: 'Name',
              ref: 'name',
              onChange: this.handleChange,
              value: this.state.data.record.name })
          ),
          React.createElement(
            'div',
            { className: 'col-xs-8' },
            React.createElement(Input, {
              type: 'textarea',
              ref: 'content',
              addonBefore: 'Content',
              onChange: this.handleChange,
              value: this.state.data.record.content })
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
      React.createElement(AdminNavbar, null),
      React.createElement(
        'div',
        { className: 'container col-xs-12' },
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
              'span',
              { className: 'label label-record label-' + this.state.data.record.type.toLowerCase() },
              this.state.data.record.type
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
      )
    );
  }
});
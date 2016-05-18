'use strict';

var RecordDetail = React.createClass({
  displayName: 'RecordDetail',

  mixins: [Reflux.connect(recordStore, 'data')],

  componentDidMount: function componentDidMount() {
    var id = this.props.params.id;

    RecordActions.read(id);
  },

  getInitialState: function getInitialState() {
    return { data: { record: { type: '' } } };
  },

  handleChange: function handleChange() {
    var data = { data: { record: {
          name: this.refs.name.getValue(),
          content: this.refs.content.getValue(),
          type: this.state.data.record.type,
          domain_id: this.state.data.record.domain_id,
          id: this.state.data.record.id
        }
      } };
    if (this.refs.prio) {
      data['prio'] = this.refs.prio.getValue();
    }
    this.setState(data);
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

  validate: function validate() {
    var data = this.state.data.record;
    var errors = [];
    if (!data['name']) {
      errors.push('Name is missing');
    }

    if (data['type'] == 'SRV') {
      if (!this.refs.priority.getValue()) {
        errors.push('Priority is missing');
      }
      if (!inRange(this.refs.priority.getValue(), 0, 1000)) {
        errors.push('Priority must be a number 0-1000');
      }
      if (!this.refs.port.getValue()) {
        errors.push('Port is missing');
      }
      if (!inRange(this.refs.port.getValue(), 1, 65536)) {
        errors.push('Port must be a number 1-65536');
      }
      if (!this.refs.value.getValue()) {
        errors.push('Value is missing');
      }
    } else if (data['type'] == 'A') {
      if (!data['content']) {
        errors.push('IPv4 address is missing');
      }
      if (data['content'] && !isIP4(data['content'])) {
        errors.push('IPv4 address is not in the correct format');
      }
    } else if (data['type'] == 'AAAA') {
      if (!data['content']) {
        errors.push('IPv6 address is missing');
      }
      if (data['content'] && !isIP6(data['content'])) {
        errors.push('IPv6 address is not in the correct format');
      }
    } else if (data['type'] == 'MX') {
      if (!data['prio']) {
        errors.push('Priority is missing');
      }
      if (!inRange(data['prio'], 0, 1000)) {
        errors.push('Priority must be a number 0-1000');
      }
    } else {
      if (!data['content']) {
        errors.push('Content is missing');
      }
    }
    return errors;
  },

  handleSubmit: function handleSubmit() {
    var errors = this.validate();

    if (errors.length > 0) {
      FeedbackActions.set('error', 'Form contains invalid data', errors);
    } else {
      RecordActions.update(this.state.data.record);
      FeedbackActions.set('success', 'Form has been submited');
    }
  },

  renderInput: function renderInput() {
    switch (this.state.data.record.type) {
      case 'A':
      case 'AAAA':
      case 'CNAME':
      case 'PTR':
      case 'NS':
      case 'SOA':
        return React.createElement(
          'div',
          { className: 'form-group' },
          React.createElement(Input, {
            type: 'text',
            label: 'Name',
            labelClassName: 'col-xs-2',
            wrapperClassName: 'col-xs-8',
            ref: 'name',
            onChange: this.handleChange,
            value: this.state.data.record.name }),
          React.createElement(Input, {
            type: 'text',
            label: 'Value',
            labelClassName: 'col-xs-2',
            wrapperClassName: 'col-xs-8',
            ref: 'content',
            onChange: this.handleChange,
            value: this.state.data.record.content })
        );
        break;
      case 'MX':
        return React.createElement(
          'div',
          { className: 'form-group' },
          React.createElement(Input, {
            type: 'text',
            label: 'Name',
            labelClassName: 'col-xs-2',
            wrapperClassName: 'col-xs-8',
            ref: 'name',
            onChange: this.handleChange,
            value: this.state.data.record.name }),
          React.createElement(Input, {
            type: 'text',
            label: 'Priority',
            labelClassName: 'col-xs-2',
            wrapperClassName: 'col-xs-8',
            ref: 'prio',
            onChange: this.handleChange,
            value: this.state.data.record.prio }),
          React.createElement(Input, {
            type: 'text',
            label: 'Value',
            labelClassName: 'col-xs-2',
            wrapperClassName: 'col-xs-8',
            ref: 'content',
            onChange: this.handleChange,
            value: this.state.data.record.content })
        );
      case 'SRV':
        var _state$data$record$content$split = this.state.data.record.content.split(' '),
            priority = _state$data$record$content$split[0],
            port = _state$data$record$content$split[1],
            value = _state$data$record$content$split[2];

        return React.createElement(
          'div',
          { className: 'form-group' },
          React.createElement(Input, {
            type: 'text',
            label: 'Name',
            labelClassName: 'col-xs-2',
            wrapperClassName: 'col-xs-8',
            ref: 'name',
            onChange: this.handleSrvChange,
            value: this.state.data.record.name }),
          React.createElement(Input, {
            type: 'text',
            label: 'Priority',
            labelClassName: 'col-xs-2',
            wrapperClassName: 'col-xs-8',
            ref: 'priority',
            onChange: this.handleSrvChange,
            value: priority }),
          React.createElement(Input, {
            type: 'text',
            label: 'Port',
            labelClassName: 'col-xs-2',
            wrapperClassName: 'col-xs-8',
            ref: 'port',
            onChange: this.handleSrvChange,
            value: port }),
          React.createElement(Input, {
            type: 'text',
            label: 'Value',
            labelClassName: 'col-xs-2',
            wrapperClassName: 'col-xs-8',
            ref: 'value',
            onChange: this.handleSrvChange,
            value: value })
        );
        break;
      case 'TXT':
        return React.createElement(
          'div',
          { className: 'form-group' },
          React.createElement(Input, {
            type: 'text',
            label: 'Name',
            labelClassName: 'col-xs-2',
            wrapperClassName: 'col-xs-8',
            ref: 'name',
            onChange: this.handleChange,
            value: this.state.data.record.name }),
          React.createElement(Input, {
            type: 'textarea',
            ref: 'content',
            label: 'Content',
            labelClassName: 'col-xs-2',
            wrapperClassName: 'col-xs-8',
            onChange: this.handleChange,
            value: this.state.data.record.content })
        );
        break;
    }
  },

  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(AdminNavbar, null),
      React.createElement(
        'div',
        { className: 'container col-md-6 col-md-offset-3' },
        React.createElement(
          'h1',
          null,
          this.state.data.record.name
        ),
        React.createElement(Feedback, null),
        React.createElement(
          'form',
          { className: 'form-horizontal', onSubmit: this.handleSubmit },
          React.createElement(
            'div',
            { className: 'panel panel-default' },
            React.createElement(
              'div',
              { className: 'panel-heading' },
              React.createElement(
                'h3',
                { className: 'panel-title' },
                React.createElement(
                  'span',
                  { className: 'label label-record label-' + this.state.data.record.type.toLowerCase() },
                  this.state.data.record.type
                ),
                ' Record'
              )
            ),
            React.createElement(
              'div',
              { className: 'panel-body' },
              this.renderInput()
            ),
            React.createElement(
              'div',
              { className: 'panel-footer' },
              React.createElement(
                'button',
                { type: 'submit', className: 'btn btn-primary' },
                'Save'
              )
            )
          )
        )
      )
    );
  }
});
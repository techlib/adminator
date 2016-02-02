'use strict';

var DomainEdit = React.createClass({
  displayName: 'DomainEdit',

  mixins: [Reflux.connect(domainStore, 'data')],

  componentDidMount: function componentDidMount() {
    var id = this.props.params.id;

    DomainActions.read(id);
  },

  getInitialState: function getInitialState() {
    return { data: { domain: {} }, alerts: [] };
  },

  handleChange: function handleChange() {
    this.setState({ data: { domain: {
          name: this.refs.name.getValue(),
          master: this.refs.master.getValue(),
          type: this.refs.type.getValue(),
          last_check: this.refs.last_check.getValue(),
          id: this.state.data.domain.id
        }
      } });
  },

  handleSubmit: function handleSubmit() {
    DomainActions.update(this.state.data.domain);
    this.setState({ alerts: this.state.alerts.concat([new SuccessAlert('Domain updated')]) });
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
          'Domain'
        ),
        React.createElement(
          'form',
          { onSubmit: this.handleSubmit },
          React.createElement(
            'div',
            { className: 'col-xs-6' },
            React.createElement(Input, {
              type: 'text',
              addonBefore: 'Name',
              ref: 'name',
              onChange: this.handleChange,
              value: this.state.data.domain.name })
          ),
          React.createElement(
            'div',
            { className: 'col-xs-6' },
            React.createElement(Input, {
              type: 'text',
              addonBefore: 'Master',
              ref: 'master',
              onChange: this.handleChange,
              value: this.state.data.domain.master })
          ),
          React.createElement(
            'div',
            { className: 'col-xs-6' },
            React.createElement(
              Input,
              {
                type: 'select',
                addonBefore: 'Type',
                ref: 'type',
                onChange: this.handleChange,
                value: this.state.data.domain.type },
              React.createElement(
                'option',
                { value: 'MASTER' },
                'Master'
              ),
              React.createElement(
                'option',
                { value: 'SLAVE' },
                'Slave'
              )
            )
          ),
          React.createElement(
            'div',
            { className: 'col-xs-6' },
            React.createElement(
              'div',
              { className: 'form-group' },
              React.createElement(
                'div',
                { className: 'input-group' },
                React.createElement(
                  'span',
                  { className: 'input-group-addon' },
                  'Last check'
                ),
                React.createElement(DateTimeField, {
                  ref: 'last_check',
                  defaultText: '',
                  onChange: this.handleChange,
                  format: 'X',
                  inputFormat: 'DD.MM.YYYY HH:mm',
                  dateTime: this.state.data.domain.last_check })
              )
            )
          ),
          React.createElement(
            'div',
            { className: 'col-xs-12' },
            React.createElement(ButtonInput, { type: 'submit', className: 'btn-primary', value: 'Save' })
          )
        )
      )
    );
  }
});
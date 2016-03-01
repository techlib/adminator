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

  handleChangeType: function handleChangeType(event) {
    this.state.data.domain.type = event.target.value;
    this.setState({ data: this.state.data });
  },

  handleChange: function handleChange() {
    this.setState({ data: { domain: {
          name: this.refs.name.getValue(),
          master: this.refs.master.getValue(),
          type: this.state.data.domain.type,
          last_check: this.refs.last_check.getValue(),
          id: this.state.data.domain.id
        }
      } });
  },

  handleSubmit: function handleSubmit(e) {
    e.preventDefault();
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
        { className: 'container col-md-12' },
        React.createElement(
          'h3',
          null,
          'Domain'
        ),
        React.createElement(
          'div',
          { className: 'col-md-12 well' },
          React.createElement(
            'form',
            { className: 'form-horizontal', onSubmit: this.handleSubmit },
            React.createElement(
              'div',
              { className: 'col-md-6' },
              React.createElement(Input, {
                type: 'text',
                label: 'Name',
                labelClassName: 'col-md-2',
                wrapperClassName: 'col-md-10',
                ref: 'name',
                onChange: this.handleChange,
                value: this.state.data.domain.name })
            ),
            React.createElement(
              'div',
              { className: 'col-md-6' },
              React.createElement(Input, {
                type: 'text',
                label: 'Master',
                labelClassName: 'col-md-2',
                wrapperClassName: 'col-md-10',
                ref: 'master',
                onChange: this.handleChange,
                value: this.state.data.domain.master })
            ),
            React.createElement(
              'div',
              { className: 'col-md-6' },
              React.createElement(
                BootstrapSelect,
                {
                  label: 'Type',
                  labelClassName: 'col-md-2',
                  wrapperClassName: 'col-md-10',
                  ref: 'type',
                  onChange: this.handleChangeType,
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
              { className: 'col-md-6' },
              React.createElement(
                'div',
                { className: 'form-group' },
                React.createElement(
                  'label',
                  { className: 'col-md-2' },
                  'Last check'
                ),
                React.createElement(
                  'div',
                  { className: 'col-md-10' },
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
              { className: 'col-md-6' },
              React.createElement(
                'div',
                { className: 'form-group' },
                React.createElement(
                  'div',
                  { className: 'col-md-10 col-md-offset-2' },
                  React.createElement(ButtonInput, { type: 'submit', className: 'btn-primary', value: 'Save' })
                )
              )
            )
          )
        )
      )
    );
  }
});
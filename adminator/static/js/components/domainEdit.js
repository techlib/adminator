'use strict';

var DomainEdit = React.createClass({
  displayName: 'DomainEdit',

  mixins: [Reflux.connect(domainStore, 'data'), Reflux.listenTo(domainStore, 'handleErrors')],

  componentDidMount: function componentDidMount() {
    var id = this.props.params.id;

    if (id != 'new') {
      DomainActions.read(id);
    }
  },

  getInitialState: function getInitialState() {
    return { data: { domain: { type: 'MASTER', last_check: moment().format('X') } } };
  },

  handleErrors: function handleErrors(data) {
    var errors = [];
    data.errors.map(function (item) {
      errors.append(item.message.message);
    });
    FeedbackActions.set('error', 'Errors from server', errors);
  },

  handleChangeType: function handleChangeType(event) {
    this.state.data.domain.type = event.target.value;
    this.setState({ data: this.state.data });
  },

  validate: function validate() {
    var data = this.state.data.domain;
    var errors = [];
    if (!data['name']) {
      errors.push('Name is missing');
    }
    if (!data['type']) {
      errors.push('Type is missing');
    }
    if (data['type'] == 'SLAVE' && !data['master']) {
      errors.push('Master is missing');
    }
    if (data['type'] == 'SLAVE' && !isIP4(data['master'])) {
      errors.push('Master is not an IP address');
    }
    if (!data['last_check']) {
      errors.push('Last check is missing');
    }

    return errors;
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
    var errors = this.validate();

    if (errors.length > 0) {
      FeedbackActions.set('error', 'Form contains invalid data', errors);
    } else {
      if (_.isUndefined(this.state.data.domain.id)) {
        DomainActions.create(this.state.data.domain);
        FeedbackActions.set('success', 'Domain created');
      } else {
        DomainActions.update(this.state.data.domain);
        FeedbackActions.set('success', 'Domain updated');
      }
    }
  },

  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(AdminNavbar, null),
      React.createElement(
        'div',
        { className: 'container col-md-12 ' },
        React.createElement(
          'h1',
          null,
          this.state.data.domain.name
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
                'h1',
                { className: 'panel-title' },
                'Domain'
              )
            ),
            React.createElement(
              'div',
              { className: 'panel-body' },
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
                    { className: 'control-label col-md-2' },
                    'Last check'
                  ),
                  React.createElement(
                    'div',
                    { className: 'col-md-10' },
                    React.createElement(DateTimeField, {
                      ref: 'last_check',
                      onChange: this.handleChange,
                      format: 'X',
                      inputFormat: 'DD.MM.YYYY HH:mm',
                      dateTime: this.state.data.domain.last_check })
                  )
                )
              )
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
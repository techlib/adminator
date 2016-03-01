/* global React, $ */
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var BootstrapSelect = React.createClass({ displayName: 'BootstrapSelect',
  getInitialState: function getInitialState() {
    return {
      open: false
    };
  },
  componentDidUpdate: function componentDidUpdate() {
    $(ReactDOM.findDOMNode(this)).find('select').selectpicker('refresh');
    var select = $(ReactDOM.findDOMNode(this)).find('div.bootstrap-select');
    select.toggleClass('open', this.state.open);
  },
  componentWillUnmount: function componentWillUnmount() {
    var self = this;
    var select = $(ReactDOM.findDOMNode(this)).find('select');

    var button = $(ReactDOM.findDOMNode(this)).find('button');
    var dropdown = $(ReactDOM.findDOMNode(this)).find('.dropdown-menu.open');
    var items = $(ReactDOM.findDOMNode(this)).find('ul.dropdown-menu li a');

    $('html').off('click');
    button.off('click');
    items.off('click');
  },
  componentDidMount: function componentDidMount() {
    var self = this;
    var select = $(ReactDOM.findDOMNode(this)).find('select');
    $(select).selectpicker();

    var button = $(ReactDOM.findDOMNode(this)).find('button');
    var dropdown = $(ReactDOM.findDOMNode(this)).find('.dropdown-menu.open');
    var items = $(ReactDOM.findDOMNode(this)).find('ul.dropdown-menu li a');

    $('html').click(function () {
      self.setState({ open: false });
    });

    button.click(function (e) {
      e.stopPropagation();
      self.setState({ open: !self.state.open });
    });

    items.click(function () {
      if (self.props.multiple) return;
      self.setState({ open: !self.state.open });
    });
  },
  render: function render() {
    return React.createElement(Input, _extends({}, this.props, { type: 'select' }));
  }
});
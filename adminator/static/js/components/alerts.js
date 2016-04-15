'use strict';

function AlertNotice(level, message, code) {
    this.level = level;
    this.message = message;
    this.code = code || null;
}

function SuccessAlert(message) {
    AlertNotice.call(this, 'success', message);
}
SuccessAlert.prototype = Object.create(AlertNotice);
SuccessAlert.prototype.constructor = SuccessAlert;

function ErrorAlert(message, code) {
    AlertNotice.call(this, 'danger', message, code);
}
ErrorAlert.prototype = Object.create(AlertNotice);
ErrorAlert.prototype.constructor = ErrorAlert;

var AlertDismissible = React.createClass({
    displayName: 'AlertDismissible',

    getInitialState: function getInitialState() {
        return {
            isVisible: true
        };
    },

    icon: function icon() {
        return ({ 'success': 'pficon pficon-ok',
            'danger': 'pficon pficon-error-circle-o' })[this.props.level];
    },

    render: function render() {
        if (!this.state.isVisible) return null;

        var message = this.props.message;
        if (this.props.code !== null) message = message + '(Code ' + this.props.code + ')';
        return React.createElement(
            Alert,
            { className: 'toast-pf toast-pf-top-right alert alert-dismissable', bsStyle: this.props.level },
            React.createElement(
                'button',
                { type: 'button', className: 'close', 'data-dismiss': 'alert', 'aria-hidden': 'true' },
                React.createElement('span', { className: 'pficon pficon-close' })
            ),
            React.createElement('span', { className: this.icon() }),
            ' ',
            message
        );
    },

    dismissAlert: function dismissAlert() {
        this.setState({ isVisible: false });
    },

    showAlert: function showAlert() {
        this.setState({ isVisible: true });
    }
});

var AlertSet = React.createClass({
    displayName: 'AlertSet',

    render: function render() {
        if (this.props.alerts) {
            var alerts = this.props.alerts.map(function (alert, i) {
                return React.createElement(AlertDismissible, { key: "alert-" + i, level: alert.level,
                    message: alert.message, code: alert.code });
            });
        }
        // component must be a single node, so wrap in a div
        return React.createElement(
            'div',
            null,
            alerts
        );
    }
});
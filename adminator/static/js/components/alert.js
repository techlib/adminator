'use strict';

var Alert = React.createClass({
    displayName: 'Alert',

    render: function render() {
        if (this.props.type == 'success') {
            var cls = 'alert-success';
            var title = 'Success';
            var icon = 'pficon-ok';
        } else if (this.props.type == 'error') {
            var cls = 'alert-danger';
            var title = 'Error';
            var icon = 'pficon-error-circle-o';
        }

        var clsIco = classNames('pficon', icon);
        var clsAlert = classNames('alert', cls);

        return React.createElement(
            'div',
            { className: clsAlert },
            React.createElement('span', { className: clsIco }),
            React.createElement(
                'strong',
                null,
                title,
                ': '
            ),
            ' ',
            this.props.message
        );
    }

});
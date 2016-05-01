'use strict';

var Message = React.createClass({
    displayName: 'Message',

    renderExtra: function renderExtra() {
        if (!this.props.extra) {
            return null;
        }

        if (Array.isArray(this.props.extra)) {
            return React.createElement(
                'ul',
                null,
                this.props.extra.map(function (item) {
                    return React.createElement(
                        'li',
                        null,
                        item
                    );
                })
            );
        } else {
            return this.props.extra;
        }
    },

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
            this.props.message,
            this.renderExtra()
        );
    }

});
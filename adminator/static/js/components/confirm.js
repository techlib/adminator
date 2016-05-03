'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var Confirm = React.createClass({
    displayName: 'Confirm',

    getDefaultProps: function getDefaultProps() {
        return {
            'title': null,
            'text': null,
            'confirmLabel': 'OK',
            'abortLabel': 'Cancel',
            'confirmClass': 'primary',
            'abortClass': 'default',
            'show': true
        };
    },

    componentDidMount: function componentDidMount() {
        this.promise = $.Deferred();
        ReactDOM.findDOMNode(this.refs.confirm).focus();
    },

    getHeader: function getHeader() {
        if (this.props.title) {
            return React.createElement(
                ReactBootstrap.Modal.Header,
                null,
                this.props.title
            );
        }
    },

    getBody: function getBody() {
        if (this.props.text) {
            return React.createElement(
                ReactBootstrap.Modal.Body,
                null,
                this.props.text
            );
        }
    },

    getFooter: function getFooter() {
        var clsConfirm = classNames('btn', 'btn-' + this.props.confirmClass);
        var clsAbort = classNames('btn', 'btn-' + this.props.abortClass);

        return React.createElement(
            ReactBootstrap.Modal.Footer,
            null,
            React.createElement(
                'div',
                { className: 'text-right' },
                React.createElement(
                    'button',
                    { role: 'abort', className: clsAbort,
                        onClick: this.abort },
                    this.props.abortLabel
                ),
                React.createElement(
                    'button',
                    { role: 'confirm', className: clsConfirm,
                        ref: 'confirm',
                        onClick: this.confirm },
                    this.props.confirmLabel
                )
            )
        );
    },

    confirm: function confirm() {
        this.promise.resolve();
    },

    abort: function abort() {
        this.promise.reject();
    },

    render: function render() {
        return React.createElement(
            ReactBootstrap.Modal,
            { show: this.props.show,
                onHide: this.abort,
                keyboard: true },
            this.getHeader(),
            this.getBody(),
            this.getFooter()
        );
    }
});

var ModalConfirmMixin = {
    wrapper: null,
    component: null,

    getModal: function getModal(title, text, others, show) {
        return React.createElement(Confirm, _extends({ title: title, text: text, show: show }, others));
    },

    modalConfirm: function modalConfirm(title, text, others) {
        var modal = this.getModal(title, text, others, true);
        this.wrapper = document.body.appendChild(document.createElement('div'));
        this.component = ReactDOM.render(modal, this.wrapper);
        this.component.promise.always(this.cleanup).promise();
        return this.component.promise;
    },

    cleanup: function cleanup() {
        var _this = this;

        ReactDOM.render(this.getModal(null, null, null, false), this.wrapper);
        setTimeout(function () {
            ReactDOM.unmountComponentAtNode(_this.wrapper);
            _this.wrapper.remove();
        });
    }
};
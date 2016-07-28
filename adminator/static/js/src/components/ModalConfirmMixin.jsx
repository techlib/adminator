import * as React from 'react'
import {Modal} from 'react-bootstrap'
import ReactDOM from 'react-dom'
import classNames from 'classnames'

let Header = Modal.Header
let Body = Modal.Body
let Footer = Modal.Footer

export var Confirm = React.createClass({

    getDefaultProps() {
        return {
            'title': null,
            'text': null,
            'confirmLabel': 'OK',
            'abortLabel': 'Cancel',
            'confirmClass': 'primary',
            'abortClass': 'default',
            'show': true,
        }
    },

    componentDidMount() {
        this.promise = $.Deferred();
        ReactDOM.findDOMNode(this.refs.confirm).focus()
    },

    getHeader() {
        if (this.props.title) {
            return <Header>
                        {this.props.title}
                   </Header>
        }
    },

    getBody() {
        if (this.props.text) {
            return <Body>
                        {this.props.text}
                   </Body>
        }
    },

    getFooter() {
        var clsConfirm = classNames('btn', 'btn-' + this.props.confirmClass);
        var clsAbort   = classNames('btn', 'btn-' + this.props.abortClass);

        return (
            <Footer>
            <div className='text-right'>
                <button role='abort' className={clsAbort}
                        onClick={this.abort}>
                    {this.props.abortLabel}
                </button>
                <button role='confirm' className={clsConfirm}
                        ref='confirm'
                        onClick={this.confirm}>
                    {this.props.confirmLabel}
                </button>
            </div>
            </Footer>
        )
    },

    confirm() {
        this.promise.resolve();
    },

    abort() {
        this.promise.reject();
    },

    render() {
        return (
            <Modal show={this.props.show}
                    onHide={this.abort}
                    keyboard={true}>
                {this.getHeader()}
                {this.getBody()}
                {this.getFooter()}
            </Modal>
        );
    }
})

export var ModalConfirmMixin = {
    wrapper: null,
    component: null,

    getModal(title, text, others, show) {
        return <Confirm title={title} text={text} show={show} {...others}  />
    },

    modalConfirm(title, text, others) {
        var modal = this.getModal(title, text, others, true);
        this.wrapper = document.body.appendChild(document.createElement('div'));
        this.component = ReactDOM.render(modal, this.wrapper);
        this.component.promise.always(this.cleanup).promise();
        return this.component.promise;
    },

    cleanup() {
        ReactDOM.render(this.getModal(null,null,null, false), this.wrapper);
        setTimeout(() => {
            ReactDOM.unmountComponentAtNode(this.wrapper);
            this.wrapper.remove();
        })
    }
}

var Confirm = React.createClass({

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
            return <ReactBootstrap.Modal.Header>
                        {this.props.title}
                   </ReactBootstrap.Modal.Header>
        }
    },

    getBody() {
        if (this.props.text) {
            return <ReactBootstrap.Modal.Body>
                        {this.props.text}
                   </ReactBootstrap.Modal.Body>
        }
    },

    getFooter() {
        var clsConfirm = classNames('btn', 'btn-' + this.props.confirmClass);
        var clsAbort   = classNames('btn', 'btn-' + this.props.abortClass);

        return (
            <ReactBootstrap.Modal.Footer>
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
            </ReactBootstrap.Modal.Footer>
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
            <ReactBootstrap.Modal show={this.props.show}
                    onHide={this.abort}
                    keyboard={true}>
                {this.getHeader()}
                {this.getBody()}
                {this.getFooter()}
            </ReactBootstrap.Modal>
        );
    }
})

var ModalConfirmMixin = {
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

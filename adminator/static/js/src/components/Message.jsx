import * as React from 'react'
import classNames from 'classnames'

export var Message = React.createClass({

    renderExtra() {
        if (!this.props.extra) {
            return null;
        }

        if (Array.isArray(this.props.extra)) {
            return <ul>
                {this.props.extra.map((item, index) => {
                    return <li key={index}>{item}</li>
                })}
            </ul>

        } else {
            return this.props.extra;
        }
    },

    render() {
        var cls, title, icon

        if (this.props.type == 'success') {
            cls = 'alert-success';
            title = 'Success';
            icon = 'pficon-ok';
        } else if (this.props.type == 'error') {
            cls = 'alert-danger';
            title = 'Error';
            icon = 'pficon-error-circle-o';
        }

        var clsIco = classNames('pficon', icon);
        var clsAlert = classNames('alert', cls);

        return (
            <div className={clsAlert}>
                <span className={clsIco}></span>
                <strong>{title}: </strong> {this.props.message}

                {this.renderExtra()}
            </div>
        )
    }


})

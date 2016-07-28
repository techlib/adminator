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

        return (
            <div className={clsAlert}>
                <span className={clsIco}></span>
                <strong>{title}: </strong> {this.props.message}

                {this.renderExtra()}
            </div>
        )
    }


})

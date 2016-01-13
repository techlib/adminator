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
    getInitialState: function() {
        return {
            isVisible: true
        };
    },

    render: function() {
        if(!this.state.isVisible)
            return null;

        var message = this.props.message;
        if(this.props.code !== null)
            message = message +'(Code '+ this.props.code +')';
        return (
            <Alert bsStyle={this.props.level} onDismiss={this.dismissAlert}>
                <p>{message}</p>
            </Alert>
        );
    },

    dismissAlert: function() {
        this.setState({isVisible: false});
    },

    showAlert: function() {
      this.setState({isVisible: true});
    }
});

var AlertSet = React.createClass({
    render: function() {
      if(this.props.alerts){
        var alerts = this.props.alerts.map(function(alert, i) {
            return (
                <AlertDismissible key={"alert-"+i} level={alert.level}
                        message={alert.message} code={alert.code} />
            );
        });
      }
        // component must be a single node, so wrap in a div
        return (
            <div>{alerts}</div>
        );
    }
});

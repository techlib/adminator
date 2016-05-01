var Feedback = React.createClass({

    mixins: [Reflux.connect(feedbackStore, 'data')],

    data: {},

    render() {
        if (!this.state.data) {
            return null
        }

        return <Message type={this.state.data.type}
                        message={this.state.data.message} 
                        extra={this.state.data.extra} />

    }

});

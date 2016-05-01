'use strict';

var Feedback = React.createClass({
    displayName: 'Feedback',

    mixins: [Reflux.connect(feedbackStore, 'data')],

    data: {},

    render: function render() {
        if (!this.state.data) {
            return null;
        }

        return React.createElement(Message, { type: this.state.data.type,
            message: this.state.data.message,
            extra: this.state.data.extra });
    }

});
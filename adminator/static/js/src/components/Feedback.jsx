import * as React from 'react'
import * as Reflux from 'reflux'
import {FeedbackStore} from '../stores/Feedback'
import {Message} from './Message'

export var Feedback = React.createClass({
    mixins: [Reflux.connect(FeedbackStore, 'data')],

    data: {},

    render() {
        if (!this.state.data) {
            return null
        }

        return <Message type={this.state.data.type}
                        message={this.state.data.message} 
                        extra={this.state.data.extra} />

    }

})

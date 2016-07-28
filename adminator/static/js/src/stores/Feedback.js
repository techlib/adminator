import * as Reflux from 'reflux'
import {FeedbackActions} from '../actions'

export var FeedbackStore = Reflux.createStore({

    listenables: [FeedbackActions],

    data: {},

    onClear() {
        this.trigger(null)
    },

    onSet(type, message, extra) {
        this.trigger({
            type: type,
            message: message,
            extra: extra
        })
    },
})

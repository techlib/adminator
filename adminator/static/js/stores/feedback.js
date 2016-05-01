"use strict";

var feedbackStore = Reflux.createStore({

    listenables: [FeedbackActions],

    data: {},

    onClear: function onClear() {
        this.trigger(null);
    },

    onSet: function onSet(type, message, extra) {
        this.trigger({
            type: type,
            message: message,
            extra: extra
        });
    }
});
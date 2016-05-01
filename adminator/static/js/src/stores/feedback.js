var feedbackStore = Reflux.createStore({

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

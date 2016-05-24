'use strict';

var UserInfoStore = Reflux.createStore({

    listenables: [UserInfoActions],
    data: {},

    init() {
        this.onRead()
    },

    onRead() {
        $.ajax({url: '/user-info/',
            success: result => {
                this.data = result
                this.trigger(this.data)
            },
            error: result => {
                FeedbackActions.set('error', result.responseJSON.message);
            }
        })
    },
})

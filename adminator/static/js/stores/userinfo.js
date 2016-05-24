'use strict';

var UserInfoStore = Reflux.createStore({

    listenables: [UserInfoActions],
    data: {},

    init: function init() {
        this.onRead();
    },

    onRead: function onRead() {
        var _this = this;

        $.ajax({ url: '/user-info/',
            success: function success(result) {
                _this.data = result;
                _this.trigger(_this.data);
            },
            error: function error(result) {
                FeedbackActions.set('error', result.responseJSON.message);
            }
        });
    }
});
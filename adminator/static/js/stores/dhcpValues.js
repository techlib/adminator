'use strict';

var dhcpValuesStore = Reflux.createStore({

    listenables: [DhcpValuesActions],

    onListGlobal: function onListGlobal() {
        var _this = this;

        $.ajax({ url: '/dhcp-global/',
            success: function success(result) {
                _this.trigger(result.result);
            }
        });
    },

    onSaveGlobal: function onSaveGlobal(data) {
        $.ajax({
            url: '/dhcp-global/',
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function success(result) {
                FeedbackActions.set('success', 'DHCP options saved');
            },
            error: function error(result) {
                FeedbackActions.set('error', result.responseJSON.message);
            }
        });
    }

});
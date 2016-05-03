'use strict';

var dhcpValuesStore = Reflux.createStore({

    listenables: [DhcpValuesActions],

    onListGlobal() {
        $.ajax({url: '/dhcp-global/',
            success: result => {
                this.trigger(result.result);
            }
        })
    },

    onSaveGlobal(data) {
        $.ajax({
            url: '/dhcp-global/',
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: result => {
                FeedbackActions.set('success', 'DHCP options saved');
            },
            error: result => {
                FeedbackActions.set('error', result.responseJSON.message);
            }
        })
    }

});


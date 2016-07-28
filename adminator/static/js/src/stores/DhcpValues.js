'use strict';

import * as Reflux from 'reflux'
import {DhcpValuesActions, FeedbackActions} from '../actions'

export var DhcpValuesStore = Reflux.createStore({

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


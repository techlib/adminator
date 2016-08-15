'use strict';

import * as Reflux from 'reflux'
import {FeedbackActions, NetworkActions} from '../actions'
import {hashHistory as BrowserHistory} from 'react-router'

export var NetworkStore = Reflux.createStore({
  listenables: [NetworkActions],
  data: {network: [], list: []},

  ajaxSuccess(message) {
    FeedbackActions.set('success', message);
  },

  ajaxError(result) {
    FeedbackActions.set('error', result.responseJSON.message)
  },

  onRead(id) {
    var me = this;
    $.ajax({url: `/network/${id}`,
        success: result => {
            this.data.network = result
            this.trigger(this.data)
        },
        error: result => {
            BrowserHistory.push('/network/')
            me.ajaxError(result)
        }
    })
  },

  onDelete(id){
    var me = this;
    $.ajax({
      url: `/network/${id}`,
      method: 'DELETE',
      dataType: 'json',
      contentType: 'application/json',
      success: () => {
          BrowserHistory.push('/network/')
          me.ajaxSuccess('Network deleted')
      },
      error: me.ajaxError
    })
  },


  onUpdate(network){
    var me = this;
    $.ajax({
      url: `/network/${network.uuid}`,
      method: 'PATCH',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(network),
      success: () => {
          BrowserHistory.push('/network/')
          me.ajaxSuccess('Network updated')
      },
      error: me.ajaxError
    })
  },

  onCreate(network){
    var me = this;
    $.ajax({
      url: '/network/',
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(network),
      success: result => {
          BrowserHistory.push(`/network/${result.uuid}`)
          me.ajaxSuccess('Network created')
      },
      error: me.ajaxError
    })
  },

  onList() {
    $.ajax({url: '/network/', success: result => {
        this.data.list = result.result
        this.trigger(this.data)
      }
    })
  }
});

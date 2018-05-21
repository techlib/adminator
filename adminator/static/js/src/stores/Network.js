'use strict'

import * as Reflux from 'reflux'
import {FeedbackActions, NetworkActions} from '../actions'
import {hashHistory as BrowserHistory} from 'react-router'

export var NetworkStore = Reflux.createStore({
  listenables: [NetworkActions],
  data: {network: [], list: []},

  ajaxSuccess(message) {
    FeedbackActions.set('success', message)
  },

  ajaxError(result) {
    FeedbackActions.set('error', result.responseJSON.message)
  },

  onRead(id) {
    var _this = this
    $.ajax({url: `/network/${id}`,
        success: result => {
            this.data.network = result
            this.trigger(this.data)
        },
        error: result => {
            BrowserHistory.push('/network/')
            _this.ajaxError(result)
        }
    })
  },

  onDelete(id) {
    var _this = this
    $.ajax({
      url: `/network/${id}`,
      method: 'DELETE',
      dataType: 'json',
      contentType: 'application/json',
      success: () => {
          _this.onList()
          BrowserHistory.push('/network/')
          _this.ajaxSuccess('Network deleted')
      },
      error: _this.ajaxError
    })
  },


  onUpdate(network) {
    var _this = this
    $.ajax({
      url: `/network/${network.uuid}`,
      method: 'PATCH',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(network),
      success: () => {
          BrowserHistory.push('/network/')
          _this.ajaxSuccess('Network updated')
      },
      error: _this.ajaxError
    })
  },

  onCreate(network) {
    var _this = this
    $.ajax({
      url: '/network/',
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(network),
      success: result => {
          BrowserHistory.push(`/network/${result.uuid}`)
          _this.ajaxSuccess('Network created')
      },
      error: _this.ajaxError
    })
  },

  onList() {
    $.ajax({url: '/network/', success: result => {
        this.data.list = result.result
        this.trigger(this.data)
      }
    })
  }
})

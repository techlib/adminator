'use strict'

import * as Reflux from 'reflux'
import {DeviceActions, FeedbackActions} from '../actions'
import {ErrorMixin} from './Mixins'
import {hashHistory as BrowserHistory} from 'react-router'

export var DeviceStore = Reflux.createStore({
  mixins: [ErrorMixin],
  listenables: [DeviceActions],
  data: {'device': [], 'list': [], 'errors': []},

  onRead(id) {
    $.ajax({url: `/device/${id}`, 
      success: result => {
        this.data.errors = []
        this.data.device = result
        this.trigger(this.data)
      },
      error: result => {
        FeedbackActions.set('error', result.responseJSON.message)
      }
    })
  },

  onDelete(id) {
    var _this = this
    $.ajax({
      url: `/device/${id}`,
      method: 'DELETE',
      dataType: 'json',
      contentType: 'application/json',
      success: () => {
        console.log('Device delete', id)
        _this.onList()
        BrowserHistory.push('/device/')
        FeedbackActions.set('success', 'Device deleted')
      },
      error: result => {
        FeedbackActions.set('error', result.responseJSON.message)
      }
    })
  },


  onUpdate(device) {
    $.ajax({
      url: `/device/${device.uuid}`,
      method: 'PATCH',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(device),
      success: function success() {
        BrowserHistory.push('/device/')
        FeedbackActions.set('success', 'Device updated')
      },
      error: result => {
        FeedbackActions.set('error', result.responseJSON.message)
      }
    })
  },

  onCreate(device) {
    $.ajax({
      url: '/device/',
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(device),
      success: function success(result) {
        BrowserHistory.push('/device/' + result.uuid)
        FeedbackActions.set('success', 'Device created')
      },
      error: result => {
        FeedbackActions.set('error', result.responseJSON.message)
      }


      })
  },

  onList() {
    $.ajax({url: '/device/', success: result => {
        this.data.errors = []
        this.data['list'] = result.result
        this.trigger(this.data)
      }
    })
  }
})

'use strict'

import * as Reflux from 'reflux'
import {SwitchActions, FeedbackActions} from '../actions'
import {ErrorMixin} from './Mixins'
import {hashHistory as BrowserHistory} from 'react-router'

export var SwitchStore = Reflux.createStore({
  mixins: [ErrorMixin],
  listenables: [SwitchActions],
  data: {'switch': {}, 'list': []},

  onRead(id) {
    $.ajax({url: `/switch/${id}`, success: result => {
      this.data.errors = []
      this.data.switch = result
      this.trigger(this.data)
      },
      error: result => {
        FeedbackActions.set('error', result.responseJSON.message)
      }
    })
  },

  onUpdate(switch_data) {
    $.ajax({
      url: `/switch/${switch_data.uuid}`,
      method: 'PUT',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(switch_data),
      success: function success() {
        BrowserHistory.push('/switch/')
        FeedbackActions.set('success', 'Switch updated')
      },
      error: result => {
        FeedbackActions.set('error', result.responseJSON.message)
      }
    })
  },

  onDelete(id) {
    $.ajax({
      url: `/switch/${id}`,
      method: 'DELETE',
      dataType: 'json',
      contentType: 'application/json',
      success: () => {
        BrowserHistory.push('/switch/')
        FeedbackActions.set('success', 'Switch deleted')
      },
      error: result => {
        FeedbackActions.set('error', result.responseJSON.message)
      }
    })
  },

  onCreate(switch_data) {
    $.ajax({
      url: '/switch/',
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(switch_data),
      success: function success(result) {
        BrowserHistory.push('/switch/' + result.uuid)
        FeedbackActions.set('success', 'Switch created')
      },
      error: result => {
        FeedbackActions.set('error', result.responseJSON.message)
      }
    })
  },

  onList() {
    $.ajax({url: '/switch/', success: result => {
      this.data.errors = []
      this.data.list = result.result
      this.trigger(this.data)
      }
    })
  }
})

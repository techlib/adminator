'use strict'

import * as Reflux from 'reflux'
import {ConfigPatternActions, FeedbackActions} from '../actions'
import {ErrorMixin} from './Mixins'
import {hashHistory as BrowserHistory} from 'react-router'

export var ConfigPatternStore = Reflux.createStore({
  mixins: [ErrorMixin],
  listenables: [ConfigPatternActions],
  data: {'pattern': {}, 'list': []},

  onRead(id) {
    $.ajax({url: `/config_pattern/${id}`, success: result => {
      this.data.errors = []
      this.data.pattern = result
      this.trigger(this.data)
      },
      error: result => {
        FeedbackActions.set('error', result.responseJSON.message)
      }
    })
  },

  onUpdate(pattern) {
    $.ajax({
      url: `/config_pattern/${pattern.uuid}`,
      method: 'PUT',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(pattern),
      success: function success() {
        BrowserHistory.push('/cfgPattern/')
        FeedbackActions.set('success', 'Pattern updated')
      },
      error: result => {
        FeedbackActions.set('error', result.responseJSON.message)
      }
    })
  },

  onDelete(id) {
    $.ajax({
      url: `/config_pattern/${id}`,
      method: 'DELETE',
      dataType: 'json',
      contentType: 'application/json',
      success: () => {
        BrowserHistory.push('/cfgPattern/')
        FeedbackActions.set('success', 'Pattern deleted')
      },
      error: result => {
        FeedbackActions.set('error', result.responseJSON.message)
      }
    })
  },

  onCreate(pattern) {
    var _this = this
    $.ajax({
      url: '/config_pattern/',
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(pattern),
      success: function success(result) {
        BrowserHistory.push('/cfgPattern/' + result.uuid)
        FeedbackActions.set('success', 'Pattern created')
      },
      error: result => {
        FeedbackActions.set('error', result.responseJSON.message)
      }
    })
  },

  onList() {
    $.ajax({url: '/config_pattern/', success: result => {
      this.data.errors = []
      this.data.list = result.result
      this.trigger(this.data)
      }
    })
  },

  onRecalculate(id) {
    $.ajax({url: `/config_pattern/${id}/recalculate`,
      success: function success(result) {
        var message = 'Pattern matching recalculated'
        message += ', interfaces: ' + result.interfacses
        message += ', matching interfaces: ' + result.matching
        FeedbackActions.set('success', message)
      },
      error: result => {
        FeedbackActions.set('error', result.responseJSON.message)
      }
    })
  },

  onRecalculateall() {
    $.ajax({url: '/config_pattern/recalculate',
      success: result => {
        FeedbackActions.set('success', 'Pattern matching recalculated')
      },
    })
  }
})

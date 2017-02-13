'use strict'

import * as Reflux from 'reflux'
import {SwitchInterfaceActions, FeedbackActions} from '../actions'
import {ErrorMixin} from './Mixins'
import {hashHistory as BrowserHistory} from 'react-router'

export var SwitchInterfaceStore = Reflux.createStore({
  mixins: [ErrorMixin],
  listenables: [SwitchInterfaceActions],
  data: {'interface': [], 'list': []},

  onRead(id) {
    $.ajax({url: `/switch_interface/${id}`, success: result => {
      this.data.errors = []
      this.data.interface = result.result
      this.trigger(this.data)
      },
      error: result => {
        FeedbackActions.set('error', result.responseJSON.message)
      }
    })
  },

  onUpdate(swInterface) {
    $.ajax({
      url: `/switch_interface/${swInterface.uuid}`,
      method: 'PUT',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(swInterface),
      success: function success() {
        BrowserHistory.push('/swInterface/')
        FeedbackActions.set('success', 'Interface updated')
      },
      error: result => {
        FeedbackActions.set('error', result.responseJSON.message)
      }
    })
  },

  onList() {
    $.ajax({url: '/switch_interface/', success: result => {
        this.data.errors = []
        this.data.list = result.result
        this.trigger(this.data)
      }
    })
  }
})

'use strict'

import * as Reflux from 'reflux'
import {MacHistoryActions} from '../actions'
import {ErrorMixin} from './Mixins'

export var MacHistoryStore = Reflux.createStore({
  mixins: [ErrorMixin],
  listenables: [MacHistoryActions],
  data: {'list': []},

  onList() {
    $.ajax({url: '/mac_history/', success: result => {
        this.data.errors = []
        this.data.list = result.result
        this.trigger(this.data)
      }
    })
  }
})

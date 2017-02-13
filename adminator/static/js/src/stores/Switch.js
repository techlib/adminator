'use strict'

import * as Reflux from 'reflux'
import {SwitchActions} from '../actions'
import {ErrorMixin} from './Mixins'

export var SwitchStore = Reflux.createStore({
  mixins: [ErrorMixin],
  listenables: [SwitchActions],
  data: {'switch': {}, 'list': []},

  onRead(id) {
    $.ajax({url: `/switch/${id}`, success: result => {
      this.data.errors = []
      this.data.switch = result
      this.trigger(this.data)
      }
    })
  },

  onUpdate(switch_data) {
    $.ajax({
      url: `/switch/${switch_data.uuid}`,
      method: 'PUT',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(switch_data)
    })
  },

  onDelete(id) {
    var _this = this
    $.ajax({
      url: `/switch/${id}`,
      method: 'DELETE',
      dataType: 'json',
      contentType: 'application/json',
      success: () => {
        _this.onList()
      }
    })
  },

  onCreate(switch_data) {
    var _this = this
    $.ajax({
      url: '/switch/',
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(switch_data),
      success: () => {
        _this.onList()
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

'use strict'

import * as Reflux from 'reflux'
import {ConfigPatternActions} from '../actions'
import {ErrorMixin} from './Mixins'

export var ConfigPatternStore = Reflux.createStore({
  mixins: [ErrorMixin],
  listenables: [ConfigPatternActions],
  data: {'pattern': {}, 'list': []},

  onRead(id) {
    $.ajax({url: `/config_pattern/${id}`, success: result => {
      this.data.errors = []
      this.data.pattern = result
      this.trigger(this.data)
      }
    })
  },

  onUpdate(pattern) {
    $.ajax({
      url: `/config_pattern/${pattern.uuid}`,
      method: 'PUT',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(pattern)
    })
  },

  onDelete(id) {
    var _this = this
    $.ajax({
      url: `/config_pattern/${id}`,
      method: 'DELETE',
      dataType: 'json',
      contentType: 'application/json',
      success: () => {
        _this.onList()
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
      success: () => {
        _this.onList()
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
  }
})

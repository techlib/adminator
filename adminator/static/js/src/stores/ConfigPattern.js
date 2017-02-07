'use strict'

import * as Reflux from 'reflux'
import {ConfigPatternActions} from '../actions'

export var ConfigPatternStore = Reflux.createStore({
  listenables: [ConfigPatternActions],
  data: {'pattern': [], 'list': []},

  // onRead(id) {
  //   $.ajax({url: `/record/${id}`, success: result => {
  //       this.data['record'] = result
  //       this.trigger(this.data)
  //     }
  //   })
  // },
  //
  // onDelete(id) {
  //   var _this = this
  //   $.ajax({
  //     url: `/record/${id}`,
  //     method: 'DELETE',
  //     dataType: 'json',
  //     contentType: 'application/json',
  //     success: () => {
  //       _this.onList()
  //     }
  //   })
  // },
  //
  //
  // onUpdate(record) {
  //   $.ajax({
  //     url: `/record/${record.id}`,
  //     method: 'PUT',
  //     dataType: 'json',
  //     contentType: 'application/json',
  //     data: JSON.stringify(record)
  //   })
  // },
  //
  // onCreate(record) {
  //   var _this = this
  //   $.ajax({
  //     url: '/record/',
  //     method: 'POST',
  //     dataType: 'json',
  //     contentType: 'application/json',
  //     data: JSON.stringify(record),
  //     success: () => {
  //       _this.onList()
  //     }
  //   })
  // },

  onList() {
    $.ajax({url: '/config_pattern/', success: result => {
        this.data['list'] = result.result
        this.trigger(this.data)
      }
    })
  }
})

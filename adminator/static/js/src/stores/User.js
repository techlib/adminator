'use strict'

import * as Reflux from 'reflux'
import {UserActions} from '../actions'
import * as _ from 'lodash'

export var UserStore = Reflux.createStore({
  listenables: [UserActions],
  data: {'user': [], 'list': []},

  onRead(id) {
    $.ajax({url: `/user/${id}`, success: result => {
        this.data.user = result
        this.trigger(this.data)
      }
    })
  },

  onDelete(id) {
    var _this = this
    $.ajax({
      url: `/user/${id}`,
      method: 'DELETE',
      dataType: 'json',
      contentType: 'application/json',
      success: () => {
        _this.onList()
      }
    })
  },


  onUpdate(user) {
    $.ajax({
      url: `/user/${user.id}`,
      method: 'PUT',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(user)
    })
  },

  onCreate(user) {
    var _this = this
    $.ajax({
      url: '/user/',
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(user),
      success: () => {
        _this.onList()
      }
    })
  },

  onList() {
    $.ajax({url: '/user/', success: result => {
        this.data.list = result.result
        this.trigger(this.data)
      }
    })
  },

  onListEnabled() {
    $.ajax({url: '/user/', success: result => {
        this.data.list = _.filter(result.result, (item) => { return item.enabled })
        this.trigger(this.data)
      }
    })
  }
})

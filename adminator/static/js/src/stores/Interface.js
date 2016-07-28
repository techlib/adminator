'use strict';

import * as Reflux from 'reflux'
import {FeedbackActions, InterfaceActions} from '../actions'
import {ErrorMixin} from './Mixins'

export var InterfaceStore = Reflux.createStore({
  listenables: [InterfaceActions],
  mixins: [ErrorMixin],
  data: {'interface': [], 'list': []},

  onRead(id) {
    $.ajax({url: `/interface/${id}`, success: result => {
        this.data['interface'] = result
        this.trigger(this.data)
      },
      error: result => {
        this.handleError('onRead', result.status, result.responseJSON)
      }
    })
  },

  onDelete(id){
    var _this = this;
    $.ajax({
      url: `/interface/${id}`,
      method: 'DELETE',
      dataType: 'json',
      contentType: 'application/json',
      success: result => {
        _this.onList()
      },
      error: result => {
        this.handleError('onDelete', result.status, result.responseJSON)
      }
    })
  },


  onUpdate(item){
    $.ajax({
      url: `/interface/${item.uuid}`,
      method: 'PUT',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(item),
      error: result => {
        this.handleError('onUpdate', result.status, result.responseJSON)
      }
    })
  },

  onCreate(item){
    var _this = this;
    $.ajax({
      url: '/interface/',
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(item),
      success: result => {
        _this.onList()
      },
      error: result => {
        this.handleError('onCreate', result.status, result.responseJSON)
      }
    })
  },

  onList() {
    $.ajax({url: '/interface/', success: result => {
        this.data['list'] = result.result
        this.trigger(this.data)
      }
    })
  }
});

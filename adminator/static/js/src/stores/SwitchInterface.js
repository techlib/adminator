'use strict'

import * as Reflux from 'reflux'
import {SwitchInterfaceActions} from '../actions'
import {ErrorMixin} from './Mixins'

export var SwitchInterfaceStore = Reflux.createStore({
  mixins: [ErrorMixin],
  listenables: [SwitchInterfaceActions],
  data: {'list': []},

  onList() {
    $.ajax({url: '/switch_interface/', success: result => {
        this.data.errors = []
        this.data.list = result.result
        this.trigger(this.data)
      }
    })
  }
})

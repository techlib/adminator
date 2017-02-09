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

  onList() {
    $.ajax({url: '/config_pattern/', success: result => {
      this.data.errors = []
      this.data.list = result.result
      this.trigger(this.data)
      }
    })
  }
})

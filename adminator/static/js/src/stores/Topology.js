'use strict';

import * as Reflux from 'reflux'
import {FeedbackActions, TopologyActions} from '../actions'
import {ErrorMixin} from './Mixins'

export var TopologyStore = Reflux.createStore({
  mixins: [ErrorMixin],
  listenables: [TopologyActions],
  data: {'list': []},

  onList() {
    $.ajax({url: '/connection/', success: result => {
        this.data.errors = []
        this.data.list = result.result
        this.trigger(this.data)
      }
    })
  }
});


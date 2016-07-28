'use strict';

import * as Reflux from 'reflux'
import {DhcpOptionActions} from '../actions'
import * as _ from 'lodash'

export var DhcpOptionsStore = Reflux.createStore({

  listenables: [DhcpOptionActions],

  onList() {
    $.ajax({url: '/dhcp-options/', success: result => {
        let res = {};
        _.each(result.result, (item) => {
            res[item.name] = item
        });
        this.trigger(res);
      }
    })
  }
});


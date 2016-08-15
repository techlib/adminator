'use strict';

import * as Reflux from 'reflux'
import {FeedbackActions, NetworkAclActions} from '../actions'
import {ErrorMixin} from './Mixins'
import {hashHistory as BrowserHistory} from 'react-router'
import * as _ from 'lodash'

export var NetworkAclStore = Reflux.createStore({
  mixins: [ErrorMixin],
  listenables: [NetworkAclActions],
  data: {'role': [], 'list': [], 'errors': []},

  onRead(id) {
    $.ajax({url: `/network-acl/${id}`, 
      success: result => {
        this.data.errors = []
        this.data.role = result.result
        this.trigger(this.data)
      },
      error: result => {
        FeedbackActions.set('error', result.responseJSON.message);
      }
    })
  },

  onUpdate(role, data) {
    $.ajax({
      url: `/network-acl/${role}`,
      method: 'PATCH',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function success() {
        BrowserHistory.push('/network/acl/');
        FeedbackActions.set('success', 'Role updated');
      },
      error: result => {
        FeedbackActions.set('error', result.responseJSON.message)
      }
    })
  },

  onList() {
    $.ajax({url: '/network-acl/', success: result => {
        this.data.errors = []
        this.data.list = _.map(result.result, (item) => {
            return {'role': item}
        })
        this.trigger(this.data)
      }
    })
  }
});

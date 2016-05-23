'use strict';

var lease4Store = Reflux.createStore({
  mixins: [ErrorMixin],
  listenables: [Lease4Actions],
  data: {'lease4': [], 'list': [], 'errors': []},

  onRead(id) {
    $.ajax({url: `/lease4/${id}`, 
      success: result => {
        this.data.errors = []
        this.data.lease4 = result
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
      url: `/lease4/${id}`,
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

  onList() {
    console.log('list leases')
    $.ajax({url: '/lease4/', success: result => {
        this.data.errors = []
        this.data.list = result.result
        this.trigger(this.data)
      }
    })
  }
});


var lease6Store = Reflux.createStore({
  mixins: [ErrorMixin],
  listenables: [Lease6Actions],
  data: {'lease6': [], 'list': [], 'errors': []},

  onRead(id) {
    $.ajax({url: `/lease6/${id}`, 
      success: result => {
        this.data.errors = []
        this.data.lease6 = result
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
      url: `/lease6/${id}`,
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

  onList() {
    $.ajax({url: '/lease6/', success: result => {
        this.data.errors = []
        this.data.list = result.result
        this.trigger(this.data)
      }
    })
  }
});

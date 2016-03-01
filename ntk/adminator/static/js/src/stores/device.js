'use strict';

var deviceStore = Reflux.createStore({
  listenables: [DeviceActions],
  data: {'device': [], 'list': [], 'errors': []},

  handleError(method, status, message){
    this.data.errors = [{'method': method, 'status': status, 'message': message}]
    this.trigger(this.data)
  },

  onRead(id) {
    $.ajax({url: `/device/${id}`, 
      success: result => {
        this.data.errors = []
        this.data.device = result
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
      url: `/device/${id}`,
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


  onUpdate(device){
    $.ajax({
      url: `/device/${device.uuid}`,
      method: 'PUT',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(device),
      error: result => {
        this.handleError('onUpdate', result.status, result.responseJSON)
      }
    })
  },

  onCreate(device){
    var _this = this;
    $.ajax({
      url: '/device/',
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(device),
      success: result => {
        this.data.errors = []
        this.data.device = result
        this.trigger(this.data)
      },
      error: result => {
        this.handleError('onCreate', result.status, result.responseJSON)
      }
    })
  },

  onList() {
    $.ajax({url: '/device', success: result => {
        this.data.errors = []
        this.data.list = result.result
        this.trigger(this.data)
      }
    })
  }
});

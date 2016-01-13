'use strict';

var deviceStore = Reflux.createStore({
  listenables: [DeviceActions],
  data: {'device': [], 'list': []},

  onRead(id) {
    $.ajax({url: `/device/${id}`, success: result => {
        this.data.device = result
        this.trigger(this.data)
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
      }
    })
  },


  onUpdate(device){
    $.ajax({
      url: `/device/${device.id}`,
      method: 'PUT',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(device)
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
        _this.onList()
      }
    })
  },

  onList() {
    $.ajax({url: '/device', success: result => {
        this.data.list = result.result
        this.trigger(this.data)
      }
    })
  }
});

'use strict';

var deviceStore = Reflux.createStore({
  listenables: [DeviceActions],
  data: { 'device': [], 'list': [] },

  onRead: function onRead(id) {
    var _this2 = this;

    $.ajax({ url: '/device/' + id, success: function success(result) {
        _this2.data.device = result;
        _this2.trigger(_this2.data);
      }
    });
  },

  onDelete: function onDelete(id) {
    var _this = this;
    $.ajax({
      url: '/device/' + id,
      method: 'DELETE',
      dataType: 'json',
      contentType: 'application/json',
      success: function success(result) {
        _this.onList();
      }
    });
  },

  onUpdate: function onUpdate(device) {
    $.ajax({
      url: '/device/' + device.id,
      method: 'PUT',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(device)
    });
  },

  onCreate: function onCreate(device) {
    var _this = this;
    $.ajax({
      url: '/device/',
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(device),
      success: function success(result) {
        _this.onList();
      }
    });
  },

  onList: function onList() {
    var _this3 = this;

    $.ajax({ url: '/device', success: function success(result) {
        _this3.data.list = result.result;
        _this3.trigger(_this3.data);
      }
    });
  }
});
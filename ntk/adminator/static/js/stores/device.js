'use strict';

var deviceStore = Reflux.createStore({
  listenables: [DeviceActions],
  data: { 'device': [], 'list': [], 'errors': [] },

  handleError: function handleError(method, status, message) {
    this.data.errors = [{ 'method': method, 'status': status, 'message': message }];
    this.trigger(this.data);
  },

  onRead: function onRead(id) {
    var _this2 = this;

    $.ajax({ url: '/device/' + id,
      success: function success(result) {
        _this2.data.errors = [];
        _this2.data.device = result;
        _this2.trigger(_this2.data);
      },
      error: function error(result) {
        _this2.handleError('onRead', result.status, result.responseJSON);
      }
    });
  },

  onDelete: function onDelete(id) {
    var _this3 = this;

    var _this = this;
    $.ajax({
      url: '/device/' + id,
      method: 'DELETE',
      dataType: 'json',
      contentType: 'application/json',
      success: function success(result) {
        _this.onList();
      },
      error: function error(result) {
        _this3.handleError('onDelete', result.status, result.responseJSON);
      }
    });
  },

  onUpdate: function onUpdate(device) {
    var _this4 = this;

    $.ajax({
      url: '/device/' + device.uuid,
      method: 'PUT',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(device),
      error: function error(result) {
        _this4.handleError('onUpdate', result.status, result.responseJSON);
      }
    });
  },

  onCreate: function onCreate(device) {
    var _this5 = this;

    var _this = this;
    $.ajax({
      url: '/device/',
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(device),
      success: function success(result) {
        _this5.data.errors = [];
        _this5.data.device = result;
        _this5.trigger(_this5.data);
      },
      error: function error(result) {
        _this5.handleError('onCreate', result.status, result.responseJSON);
      }
    });
  },

  onList: function onList() {
    var _this6 = this;

    $.ajax({ url: '/device', success: function success(result) {
        _this6.data.errors = [];
        _this6.data.list = result.result;
        _this6.trigger(_this6.data);
      }
    });
  }
});
'use strict';

var deviceStore = Reflux.createStore({
  mixins: [ErrorMixin],
  listenables: [DeviceActions],
  data: { 'device': [], 'list': [], 'errors': [] },

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
    var _this = this;
    $.ajax({
      url: '/device/' + id,
      method: 'DELETE',
      dataType: 'json',
      contentType: 'application/json',
      success: function success(result) {
        BrowserHistory.push('/device/');
        FeedbackActions.set('success', 'Device deleted');
      },
      error: function error(result) {
        FeedbackActions.set('error', result.responseJSON.message);
      }
    });
  },

  onUpdate: function onUpdate(device) {
    $.ajax({
      url: '/device/' + device.uuid,
      method: 'PUT',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(device),
      success: function success(result) {
        BrowserHistory.push('/device/');
        FeedbackActions.set('success', 'Device updated');
      },
      error: function error(result) {
        FeedbackActions.set('error', result.responseJSON.message);
      }
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
        BrowserHistory.push('/device/' + result.uuid);
        FeedbackActions.set('success', 'Device created');
      },
      error: function error(result) {
        FeedbackActions.set('error', result.responseJSON.message);
      }

    });
  },

  onList: function onList() {
    var _this3 = this;

    $.ajax({ url: '/device/', success: function success(result) {
        _this3.data.errors = [];
        _this3.data.list = result.result;
        _this3.trigger(_this3.data);
      }
    });
  }
});
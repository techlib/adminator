'use strict';

var networkStore = Reflux.createStore({
  listenables: [NetworkActions],
  data: { 'network': [], 'list': [] },

  onRead: function onRead(id) {
    var _this2 = this;

    $.ajax({ url: '/network/' + id, success: function success(result) {
        _this2.data.network = result;
        _this2.trigger(_this2.data);
      }
    });
  },

  onDelete: function onDelete(id) {
    var _this = this;
    $.ajax({
      url: '/network/' + id,
      method: 'DELETE',
      dataType: 'json',
      contentType: 'application/json',
      success: function success(result) {
        _this.onList();
      }
    });
  },

  onUpdate: function onUpdate(network) {
    $.ajax({
      url: '/network/' + network.id,
      method: 'PUT',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(network)
    });
  },

  onCreate: function onCreate(network) {
    var _this = this;
    $.ajax({
      url: '/network/',
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(network),
      success: function success(result) {
        _this.onList();
      }
    });
  },

  onList: function onList() {
    var _this3 = this;

    $.ajax({ url: '/network', success: function success(result) {
        _this3.data.list = result.result;
        _this3.trigger(_this3.data);
      }
    });
  }
});
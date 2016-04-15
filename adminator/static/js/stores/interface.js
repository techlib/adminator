'use strict';

var interfaceStore = Reflux.createStore({
  listenables: [InterfaceActions],
  mixins: [ErrorMixin],
  data: { 'interface': [], 'list': [] },

  onRead: function onRead(id) {
    var _this2 = this;

    $.ajax({ url: '/interface/' + id, success: function success(result) {
        _this2.data['interface'] = result;
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
      url: '/interface/' + id,
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

  onUpdate: function onUpdate(item) {
    var _this4 = this;

    $.ajax({
      url: '/interface/' + item.uuid,
      method: 'PUT',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(item),
      error: function error(result) {
        _this4.handleError('onUpdate', result.status, result.responseJSON);
      }
    });
  },

  onCreate: function onCreate(item) {
    var _this5 = this;

    var _this = this;
    $.ajax({
      url: '/interface/',
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(item),
      success: function success(result) {
        _this.onList();
      },
      error: function error(result) {
        _this5.handleError('onCreate', result.status, result.responseJSON);
      }
    });
  },

  onList: function onList() {
    var _this6 = this;

    $.ajax({ url: '/interface', success: function success(result) {
        _this6.data['list'] = result.result;
        _this6.trigger(_this6.data);
      }
    });
  }
});
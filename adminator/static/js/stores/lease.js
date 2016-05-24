'use strict';

var lease4Store = Reflux.createStore({
  mixins: [ErrorMixin],
  listenables: [Lease4Actions],
  data: { 'lease4': [], 'list': [], 'errors': [] },

  onRead: function onRead(id) {
    var _this2 = this;

    $.ajax({ url: '/lease4/' + id,
      success: function success(result) {
        _this2.data.errors = [];
        _this2.data.lease4 = result;
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
      url: '/lease4/' + id,
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

  onList: function onList() {
    var _this4 = this;

    $.ajax({ url: '/lease4/', success: function success(result) {
        _this4.data.errors = [];
        _this4.data.list = result.result;
        _this4.trigger(_this4.data);
      }
    });
  }
});

var lease6Store = Reflux.createStore({
  mixins: [ErrorMixin],
  listenables: [Lease6Actions],
  data: { 'lease6': [], 'list': [], 'errors': [] },

  onRead: function onRead(id) {
    var _this5 = this;

    $.ajax({ url: '/lease6/' + id,
      success: function success(result) {
        _this5.data.errors = [];
        _this5.data.lease6 = result;
        _this5.trigger(_this5.data);
      },
      error: function error(result) {
        _this5.handleError('onRead', result.status, result.responseJSON);
      }
    });
  },

  onDelete: function onDelete(id) {
    var _this6 = this;

    var _this = this;
    $.ajax({
      url: '/lease6/' + id,
      method: 'DELETE',
      dataType: 'json',
      contentType: 'application/json',
      success: function success(result) {
        _this.onList();
      },
      error: function error(result) {
        _this6.handleError('onDelete', result.status, result.responseJSON);
      }
    });
  },

  onList: function onList() {
    var _this7 = this;

    $.ajax({ url: '/lease6/', success: function success(result) {
        _this7.data.errors = [];
        _this7.data.list = result.result;
        _this7.trigger(_this7.data);
      }
    });
  }
});
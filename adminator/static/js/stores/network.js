'use strict';

var networkStore = Reflux.createStore({
  listenables: [NetworkActions],
  data: { network: [], list: [] },

  ajaxSuccess: function ajaxSuccess(message) {
    FeedbackActions.set('success', message);
  },

  ajaxError: function ajaxError(result) {
    FeedbackActions.set('error', result.responseJSON.message);
  },

  onRead: function onRead(id) {
    var _this = this;

    var me = this;
    $.ajax({ url: '/network/' + id,
      success: function success(result) {
        _this.data.network = result;
        _this.trigger(_this.data);
      },
      error: function error(result) {
        BrowserHistory.push('/network/');
        me.ajaxError(result);
      }
    });
  },

  onDelete: function onDelete(id) {
    var me = this;
    $.ajax({
      url: '/network/' + id,
      method: 'DELETE',
      dataType: 'json',
      contentType: 'application/json',
      success: function success(result) {
        BrowserHistory.push('/network/');
        me.ajaxSuccess('Network deleted');
      },
      error: me.ajaxError
    });
  },

  onUpdate: function onUpdate(network) {
    var me = this;
    $.ajax({
      url: '/network/' + network.uuid,
      method: 'PATCH',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(network),
      success: function success(result) {
        BrowserHistory.push('/network/');
        me.ajaxSuccess('Network updated');
      },
      error: me.ajaxError
    });
  },

  onCreate: function onCreate(network) {
    var me = this;
    $.ajax({
      url: '/network/',
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(network),
      success: function success(result) {
        BrowserHistory.push('/network/' + result.uuid);
        me.ajaxSuccess('Network created');
      },
      error: me.ajaxError
    });
  },

  onList: function onList() {
    var _this2 = this;

    $.ajax({ url: '/network/', success: function success(result) {
        _this2.data.list = result.result;
        _this2.trigger(_this2.data);
      }
    });
  }
});
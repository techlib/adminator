'use strict';

var userStore = Reflux.createStore({
  listenables: [UserActions],
  data: { 'user': [], 'list': [] },

  onRead: function onRead(id) {
    var _this2 = this;

    $.ajax({ url: '/user/' + id, success: function success(result) {
        _this2.data.user = result;
        _this2.trigger(_this2.data);
      }
    });
  },

  onDelete: function onDelete(id) {
    var _this = this;
    $.ajax({
      url: '/user/' + id,
      method: 'DELETE',
      dataType: 'json',
      contentType: 'application/json',
      success: function success(result) {
        _this.onList();
      }
    });
  },

  onUpdate: function onUpdate(user) {
    $.ajax({
      url: '/user/' + user.id,
      method: 'PUT',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(user)
    });
  },

  onCreate: function onCreate(user) {
    var _this = this;
    $.ajax({
      url: '/user/',
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(user),
      success: function success(result) {
        _this.onList();
      }
    });
  },

  onList: function onList() {
    var _this3 = this;

    $.ajax({ url: '/user/', success: function success(result) {
        _this3.data.list = result.result;
        _this3.trigger(_this3.data);
      }
    });
  }
});
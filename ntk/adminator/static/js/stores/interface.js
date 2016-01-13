'use strict';

var interfaceStore = Reflux.createStore({
  listenables: [InterfaceActions],
  data: { 'interface': [], 'list': [] },

  onRead: function onRead(id) {
    var _this2 = this;

    $.ajax({ url: '/interface/' + id, success: function success(result) {
        _this2.data['interface'] = result;
        _this2.trigger(_this2.data);
      }
    });
  },

  onDelete: function onDelete(id) {
    var _this = this;
    $.ajax({
      url: '/interface/' + id,
      method: 'DELETE',
      dataType: 'json',
      contentType: 'application/json',
      success: function success(result) {
        _this.onList();
      }
    });
  },

  onUpdate: function onUpdate(item) {
    $.ajax({
      url: '/interface/' + item.id,
      method: 'PUT',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(item)
    });
  },

  onCreate: function onCreate(item) {
    var _this = this;
    $.ajax({
      url: '/interface/',
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(item),
      success: function success(result) {
        _this.onList();
      }
    });
  },

  onList: function onList() {
    var _this3 = this;

    $.ajax({ url: '/interface', success: function success(result) {
        _this3.data['list'] = result.result;
        _this3.trigger(_this3.data);
      }
    });
  }
});
'use strict';

var recordStore = Reflux.createStore({
  listenables: [RecordActions],
  data: { 'record': [], 'list': [] },

  onRead: function onRead(id) {
    var _this2 = this;

    $.ajax({ url: '/record/' + id, success: function success(result) {
        _this2.data['record'] = result;
        _this2.trigger(_this2.data);
      }
    });
  },

  onDelete: function onDelete(id) {
    var _this = this;
    $.ajax({
      url: '/record/' + id,
      method: 'DELETE',
      dataType: 'json',
      contentType: 'application/json',
      success: function success(result) {
        _this.onList();
      }
    });
  },

  onUpdate: function onUpdate(record) {
    $.ajax({
      url: '/record/' + record.id,
      method: 'PUT',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(record)
    });
  },

  onCreate: function onCreate(record) {
    var _this = this;
    $.ajax({
      url: '/record/',
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(record),
      success: function success(result) {
        _this.onList();
      }
    });
  },

  onList: function onList() {
    var _this3 = this;

    $.ajax({ url: '/record/', success: function success(result) {
        _this3.data['list'] = result.result;
        _this3.trigger(_this3.data);
      }
    });
  }
});
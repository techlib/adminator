'use strict';

var domainStore = Reflux.createStore({
  listenables: [DomainActions],
  data: { 'domain': [], 'list': [] },

  onUpdate: function onUpdate(domain) {
    $.ajax({
      url: '/domain/' + domain.id,
      method: 'PUT',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(domain)
    });
  },

  onCreate: function onCreate(domain) {
    var _this = this;
    $.ajax({
      url: '/domain/',
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(domain),
      success: function success(result) {
        _this.onList();
      }
    });
  },

  onRead: function onRead(id) {
    var _this2 = this;

    $.ajax({ url: '/domain/' + id, success: function success(result) {
        _this2.data['domain'] = result;
        _this2.trigger(_this2.data);
      }
    });
  },

  onList: function onList() {
    var _this3 = this;

    $.ajax({ url: '/domain', success: function success(result) {
        _this3.data['list'] = result.result;
        _this3.trigger(_this3.data);
      }
    });
  }
});
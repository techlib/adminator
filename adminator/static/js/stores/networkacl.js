'use strict';

var networkAclStore = Reflux.createStore({
  mixins: [ErrorMixin],
  listenables: [NetworkAclActions],
  data: { 'role': [], 'list': [], 'errors': [] },

  onRead: function onRead(id) {
    var _this = this;

    $.ajax({ url: '/network-acl/' + id,
      success: function success(result) {
        _this.data.errors = [];
        _this.data.role = result.result;
        _this.trigger(_this.data);
      },
      error: function error(result) {
        FeedbackActions.set('error', result.responseJSON.message);
      }
    });
  },

  onUpdate: function onUpdate(role, data) {
    $.ajax({
      url: '/network-acl/' + role,
      method: 'PATCH',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function success(result) {
        BrowserHistory.push('/network/acl/');
        FeedbackActions.set('success', 'Role updated');
      },
      error: function error(result) {
        FeedbackActions.set('error', result.responseJSON.message);
      }
    });
  },

  onList: function onList() {
    var _this2 = this;

    $.ajax({ url: '/network-acl/', success: function success(result) {
        _this2.data.errors = [];
        _this2.data.list = _.map(result.result, function (item) {
          return { 'role': item };
        });
        _this2.trigger(_this2.data);
      }
    });
  }
});
'use strict';

var dhcpOptionsStore = Reflux.createStore({

  listenables: [DhcpOptionActions],

  onList: function onList() {
    var _this = this;

    $.ajax({ url: '/dhcp-options/', success: function success(result) {
        var res = {};
        _.each(result.result, function (item) {
          res[item.name] = item;
        });
        _this.trigger(res);
      }
    });
  }
});
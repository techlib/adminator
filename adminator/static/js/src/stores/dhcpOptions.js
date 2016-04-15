'use strict';

var dhcpOptionsStore = Reflux.createStore({

  listenables: [DhcpOptionActions],

  onList() {
    $.ajax({url: '/dhcp-options', success: result => {
        let res = {};
        _.each(result.result, (item) => {
            res[item.uuid] = item
        });
        this.trigger(res);
      }
    })
  }
});


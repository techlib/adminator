'use strict';

var networkStore = Reflux.createStore({
  listenables: [NetworkActions],
  data: {'network': [], 'list': []},

  onRead(id) {
    $.ajax({url: `/network/${id}`, success: result => {
        this.data.network = result
        this.trigger(this.data)
      }
    })
  },

  onDelete(id){
    var _this = this;
    $.ajax({
      url: `/network/${id}`,
      method: 'DELETE',
      dataType: 'json',
      contentType: 'application/json',
      success: result => {
        _this.onList()
      }
    })
  },


  onUpdate(network){
    $.ajax({
      url: `/network/${network.id}`,
      method: 'PUT',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(network)
    })
  },

  onCreate(network){
    var _this = this;
    $.ajax({
      url: '/network/',
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(network),
      success: result => {
        _this.onList()
      }
    })
  },

  onList() {
    $.ajax({url: '/network/', success: result => {
        this.data.list = result.result
        this.trigger(this.data)
      }
    })
  }
});

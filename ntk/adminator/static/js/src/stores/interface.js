'use strict';

var interfaceStore = Reflux.createStore({
  listenables: [InterfaceActions],
  data: {'interface': [], 'list': []},

  onRead(id) {
    $.ajax({url: `/interface/${id}`, success: result => {
        this.data['interface'] = result
        this.trigger(this.data)
      }
    })
  },

  onDelete(id){
    var _this = this;
    $.ajax({
      url: `/interface/${id}`,
      method: 'DELETE',
      dataType: 'json',
      contentType: 'application/json',
      success: result => {
        _this.onList()
      }
    })
  },


  onUpdate(item){
    $.ajax({
      url: `/interface/${item.uuid}`,
      method: 'PUT',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(item)
    })
  },

  onCreate(item){
    var _this = this;
    $.ajax({
      url: '/interface/',
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(item),
      success: result => {
        _this.onList()
      }
    })
  },

  onList() {
    $.ajax({url: '/interface', success: result => {
        this.data['list'] = result.result
        this.trigger(this.data)
      }
    })
  }
});

'use strict';

var recordStore = Reflux.createStore({
  listenables: [RecordActions],
  data: {'record': [], 'list': []},

  onRead(id) {
    $.ajax({url: `/record/${id}`, success: result => {
        this.data['record'] = result
        this.trigger(this.data)
      }
    })
  },

  onDelete(id){
    var _this = this;
    $.ajax({
      url: `/record/${id}`,
      method: 'DELETE',
      dataType: 'json',
      contentType: 'application/json',
      success: result => {
        _this.onList()
      }
    })
  },


  onUpdate(record){
    $.ajax({
      url: `/record/${record.id}`,
      method: 'PUT',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(record)
    })
  },

  onCreate(record){
    var _this = this;
    $.ajax({
      url: '/record/',
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(record),
      success: result => {
        _this.onList()
      }
    })
  },

  onList() {
    $.ajax({url: '/record/', success: result => {
        this.data['list'] = result.result
        this.trigger(this.data)
      }
    })
  }
});

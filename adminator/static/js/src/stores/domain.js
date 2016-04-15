'use strict';

var domainStore = Reflux.createStore({
  listenables: [DomainActions],
  data: {'domain': [], 'list': []},

  onUpdate(domain){
    $.ajax({
      url: `/domain/${domain.id}`,
      method: 'PUT',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(domain)
    })
  },

  onCreate(domain){
    var _this = this;
    $.ajax({
      url: '/domain/',
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(domain),
      success: result => {
        _this.onList()
      }
    })
  },

  onDelete(id){
    var _this = this;
    $.ajax({
      url: `/domain/${id}`,
      method: 'DELETE',
      dataType: 'json',
      contentType: 'application/json',
      success: result => {
        _this.onList()
      }
    })
  },


  onRead(id) {
    $.ajax({url: `/domain/${id}`, success: result => {
        this.data['domain'] = result
        this.trigger(this.data)
      }
    })
  },

  onList() {
    $.ajax({url: '/domain', success: result => {
        this.data['list'] = result.result
        this.trigger(this.data)
      }
    })
  }
});
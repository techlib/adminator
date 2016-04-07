'use strict';

function regexGridFilter(_x, _x2, _x3) {
  var _this = this;

  var _again = true;

  _function: while (_again) {
    var filter = _x,
        item = _x2,
        deep = _x3;
    _again = false;

    if (typeof deep !== 'object') {
      var deep = _this.deep;
    }
    var arr = deep.keys(item);
    var filterArr = s.trim(filter).split(' ');
    var c = 0;
    for (var j = 0; j < filterArr.length; j++) {
      for (var i = 0; i < arr.length; i++) {
        if (filterArr[j][0] == '/') {
          var re = new RegExp(filterArr[j].substring(1));
          if ((deep.getAt(item, arr[i]) || "").toString().search(re) >= 0) {
            c++;
            break;
          }
        } else {
          if (typeof deep.getAt(item, arr[i]) == 'object' && deep.getAt(item, arr[i]) !== null) {
            for (var k in deep.getAt(item, arr[i])) {
              _this = undefined;
              _x = filter;
              _x2 = deep.getAt(item, arr[i])[k];
              _x3 = deep;
              _again = true;
              deep = arr = filterArr = c = j = i = re = k = undefined;
              continue _function;
            }
          }
          if ((deep.getAt(item, arr[i]) || "").toString().toLowerCase().indexOf(filterArr[j].toLowerCase()) >= 0) {
            c++;
            break;
          }
        }
      }
    }
    if (c == filterArr.length) {
      return true;
    }
    return false;
  }
}
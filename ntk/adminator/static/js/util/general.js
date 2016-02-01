"use strict";

_.mixin({
  compact: function compact(o) {
    var clone = _.clone(o);
    _.each(clone, function (v, k) {
      if (!v) {
        delete clone[k];
      }
    });
    return clone;
  }
});
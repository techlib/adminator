import * as _ from 'lodash'

_.mixin({
  compact: function(o) {
     var clone = _.clone(o);
     _.each(clone, function(v, k) {
       if(!v) {
         delete clone[k];
       }
     });
     return clone;
  }
});

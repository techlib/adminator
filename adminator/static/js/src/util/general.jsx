import * as _ from 'lodash'
import {Address6, Address4} from 'ip-address'

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


export function ipToPtr(ip) {
    var ip6 = new Address6(ip)
    var ip4 = new Address4(ip)
    if(ip6.isValid()) {
        return ip6.canonicalForm().replace(/:/g,'').split('').reverse().join('.')+'.ip6.arpa'
    } else if(ip4.isValid()) {
        return ip4.toArray().reverse().join('.') + '.in-addr.arpa'
    } else {
        return ''
    }
}

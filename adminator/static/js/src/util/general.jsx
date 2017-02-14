import * as _ from 'lodash'
import {Address6, Address4} from 'ip-address'

_.mixin({
  compact: function (o) {
     var clone = _.clone(o)
     _.each(clone, function (v, k) {
       if(!v) {
         delete clone[k]
       }
     })
     return clone
  }
})


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


export function pseudoNaturalCompare (a, b) {
  var number_re = /(\d+)/g;
  var aa = String(a).split(number_re)
  var bb = String(b).split(number_re)
  var min = Math.min(aa.length, bb.length)

  for (var i = 0; i < min; i++) {
    var x = parseInt(aa[i]) || aa[i].toLowerCase()
    var y = parseInt(bb[i]) || bb[i].toLowerCase()
    if (x < y) return -1
    else if (x > y) return 1
  }
  return 0;
}

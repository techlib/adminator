import * as ipaddr from 'ipaddr.js'

export function isInt(val) {
    return !isNaN(parseFloat(val)) && isFinite(val)
}

export function inRange(val, min, max) {
    return isInt(val) && val >= min && val <= max
}

export function isIP(val) {
    return isIP4(val) || isIP6(val)
}

export function isIP4(val) {
    return ipaddr.IPv4.isValid(val)
}

export function isIP4Cidr(val) {
    try {
        ipaddr.IPv4.parseCIDR(val)
    } catch(e) {
        return false
    }
    return true
}

export function isIP6(val) {
    return ipaddr.IPv6.isValid(val)
}

export function isIP6Cidr(val) {
    try {
        ipaddr.IPv6.parseCIDR(val)
    } catch(e) {
        return false
    }
    return true
}

export function isIPSameFamily(val1, val2) {
    if (!ipaddr.isValid(val1) || !ipaddr.isValid(val2)) {
        return false
    }

    var ip1 = ipaddr.parse(val1)
    var ip2 = ipaddr.parse(val2)

    return ip1.kind() == ip2.kind()
}

export function notEmpty(val) {
    return !!val
}

export function isMAC(val) {
    val = formatMac(val)
    var test = new RegExp("^([0-9a-f]{2}:){5}[0-9a-f]{2}$")
    return test.test(val)
}

export function minLen(val, len) {
    return val && val.length > len
}

export function formatMac(val) {
    if (!val) val = ''
    val = val.toLowerCase()
    val = val.replace(/[^a-f0-9]/g, '')
    val = val.replace(/([a-f0-9]{2})/g, '$1:').substring(0,17)
    return val
}

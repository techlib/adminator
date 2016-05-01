"use strict";

function isInt(val) {
    return !isNaN(parseFloat(val)) && isFinite(val);
}

function inRange(val, min, max) {
    return isInt(val) && val >= min && val <= max;
}

function isIP(val) {
    return isIP4(val) || isIP6(val);
}

function isIP4(val) {
    return ipaddr.IPv4.isValid(val);
}

function isIP4Cidr(val) {
    try {
        ipaddr.IPv4.parseCIDR(val);
    } catch (e) {
        return false;
    }
    return true;
}

function isIP6(val) {
    return ipaddr.IPv6.isValid(val);
}

function isIP6Cidr(val) {
    try {
        ipaddr.IPv6.parseCIDR(val);
    } catch (e) {
        return false;
    }
    return true;
}

function isIPSameFamily(val1, val2) {
    if (!ipaddr.isValid(val1) || !ipaddr.isValid(val2)) {
        return false;
    }

    var ip1 = ipaddr.parse(val1);
    var ip2 = ipaddr.parse(val2);

    return ip1.kind() == ip2.kind();
}

function notEmpty(val) {
    return !!val;
}
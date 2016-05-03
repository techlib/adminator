'use strict';

function sortDhcpOptions(options) {
    var result = { 'inet': {}, 'inet6': {} };
    _.map(options, function (val, key) {
        result[val.family][key] = val;
    });
    return result;
}

function sortDhcpValues(values, options) {
    var result = { 'inet': [], 'inet6': [] };

    _.map(values, function (val) {
        if (!_.has(options, val.option)) {
            return;
        }
        result[options[val.option].family].push(val);
    });
    return result;
}
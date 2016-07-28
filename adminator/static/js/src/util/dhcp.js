import * as _ from 'lodash'

export function sortDhcpOptions(options) {
    var result = {'inet': {}, 'inet6': {}};
    _.map(options, (val, key) => {
        result[val.family][key] = val
    });
    return result;
}

export function sortDhcpValues(values, options) {
    var result = {'inet': [], 'inet6': []};

    _.map(values, val => {
        if (!_.has(options, val.option)) {
            return;
        }
        result[options[val.option].family].push(val);
    })
    return result;
}


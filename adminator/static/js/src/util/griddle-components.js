import * as _ from 'lodash'
import {trim} from 'underscore.string'

export function regexGridFilter(rows, filter) {
	var filterArr = trim(filter).split(' ')

	return _.filter(rows, (row) => {
        var found = true
        _.forEach(filterArr, (match) => {
			var filterWordFound = false
            _.forEach(row, (v) => {

				if (_.isArray(v)) {
                    v = _.map(v, _.values).toString()
				}
				if (_.isObject(v)) {
					v = _.values(v).toString()
				}

				if (match.substr(0,1) == '/') {
					var re = new RegExp(match.substr(1, match.length-1))
                    if( ( v || '').toString().search(re) >= 0 ) {
                        filterWordFound = true
                    }
                } else {
					if( (v || '').toString()
						.toLowerCase().indexOf(match.toLowerCase()) >= 0 )
					{
                        filterWordFound = true
                    }
                }
				if (filterWordFound) {return true}
            })
			found = found && filterWordFound
		})
        return found
	})
}

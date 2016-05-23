function regexGridFilter(rows, filter) {
	var filterArr = s.trim(filter).split(' ');

	return _.filter(rows, (row, row_id) => {
        var found = false
        _.forEach(filterArr, (match) => {
            _.forEach(row, (v,k) => {

				if (_.isArray(v)) {
                    v = _.map(v, _.values).toString()
				}
				if (_.isObject(v)) {
					v = _.values(v).toString()
				}

				if (match.substr(0,1) == '/') {
					var re = new RegExp(match.substr(1, match.length-1))
                    if( ( v || "").toString().search(re) >= 0 ){
                        found = true
                    }
                } else {
					if( (v || "").toString()
						.toLowerCase().indexOf(match.toLowerCase()) >= 0 )
					{
                        found = true
                    }
                }
            })
            if (found) {
				return false;
			}
		})
        return found;
	})
}

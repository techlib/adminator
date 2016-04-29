function regexGridFilter(rows, filter) {
  var filterArr = s.trim(filter).split(' ');
  var results = []

  _.each(filterArr, (match) => {
    _.each(rows, (row,row_id) => {
      _.each(row, (v,k) => {
        if(_.isArray(v)){
                v = _.map(v, _.values).toString()
        }
        if(_.isObject(v)){
                v = _.values(v).toString()
        }
        if(match.substr(0,1) == '/'){
          var re = new RegExp(match.substr(1, match.length-1))
          if( ( v || "").toString().search(re) >= 0 ){
            results.push(row)
            return
          }
        } else {
          if( (v || "").toString().toLowerCase().indexOf(match.toLowerCase()) >= 0 ){
            results.push(row)
            return
          }
        }
      })
    })
    rows = results
    results = []
  })
  return rows
}

import * as React from 'react'

export var ConfigPatternOptions = React.createClass({

  c: 0,

  componentWillReceiveProps(p) {
    var state = {
      'name': p.name,
      'options': p.options.map((item, i) => {return {'val': item, 'id': 'old-'+i}}),
    }
    this.setState(state)
  },

  getInitialState() {
    return {'name': '', 'options': []}
  },

  handleAdd() {
    this.state.options.push({'val': '', 'id': 'new-' + this.c++})
    this.setState(this.state)
  },

  handleRemove(index) {
    this.state.options.splice(index, 1)
    this.setState(this.state)
  },

  getValues() {
    return this.state.options.map((item) => {return this.refs[item.id].value})
  },

  render() {
    return <div className="panel panel-default">
      <div className="panel-heading">
          <h3 className="panel-title">{this.state.name}</h3>
      </div>
      <div className="panel-body">
        {this.state.options.map((item, i) => {
          return <div className="row array-row" key={item.id}>
            <div className="col-xs-12">
              <div className="input-group">
                <input type="text" className="form-control" ref={item.id} defaultValue={item.val}/>
                <a className="input-group-addon" onClick={this.handleRemove.bind(null,i)}>
                  <span className="glyphicon glyphicon-trash"></span>
                </a>
              </div>
            </div>
          </div>
        })}
      </div>
      <div className="panel-footer">
        <a onClick={this.handleAdd}>
          <span className="pficon pficon-add-circle-o"></span> Add new option
        </a>
      </div>
    </div>
  }
})

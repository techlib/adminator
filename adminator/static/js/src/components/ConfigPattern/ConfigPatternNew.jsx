import * as React from 'react'
import {ConfigPatternActions} from '../../actions'
import {ConfigPattern} from './ConfigPattern'

export var ConfigPatternNew = React.createClass({
  getInitialState() {
    return {'pattern': {'uuid': ''}}
  },

  save(data) {
    ConfigPatternActions.create(data)
  },

  render() {
    return <ConfigPattern
      pattern={this.state.pattern}
      save_handler={this.save} />
  }
})

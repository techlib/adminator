import * as React from 'react'
import * as Reflux from 'reflux'
import {ConfigPatternStore} from '../../stores/ConfigPattern'
import {ConfigPatternActions} from '../../actions'
import {ConfigPattern} from './ConfigPattern'

export var ConfigPatternDetail = React.createClass({
  mixins: [Reflux.connect(ConfigPatternStore, 'data')],

  componentDidMount() {
    ConfigPatternActions.read(this.props.params.id)
  },

  getInitialState() {
    return {data: {pattern: {}}}
  },

  save(data) {
    ConfigPatternActions.update(data)
  },

  render() {
    return <ConfigPattern
      pattern={this.state.data.pattern}
      save_handler={this.save} />
  }
})

import * as React from 'react'
import * as Reflux from 'reflux'
import {ConfigPatternStore} from '../stores/ConfigPattern'
import {ConfigPatternActions} from '../actions'
import {ConfigPatternOptions} from './ConfigPatternOptions'
import {ConfigPatternForm} from './ConfigPatternForm'

export var ConfigPatternDetail = React.createClass({
  mixins: [Reflux.connect(ConfigPatternStore, 'data')],

  componentDidMount() {
    ConfigPatternActions.read(this.props.params.id)
  },

  getInitialState() {
    return {data: {pattern: {}}}
  },

  render() {
    return <div className='container-fluid'>
      <h1>{this.state.data.pattern.name}</h1>
      <div className="row">
        <div className="col-xs-12 col-md-2">
          <ConfigPatternForm ref="basic"
            name={this.state.data.pattern.name}
            style={this.state.data.pattern.style} />
        </div>
        <div className="col-xs-12 col-md-5">
          <ConfigPatternOptions ref="mandatory"
            options={this.state.data.pattern.mandatory}
            name="Mandatory" />
        </div>
        <div className="col-xs-12 col-md-5">
          <ConfigPatternOptions ref="optimal"
            options={this.state.data.pattern.optimal}
            name="Optimal" />
        </div>
      </div>
    </div>
  }
})

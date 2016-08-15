import * as React from 'react'
import * as Reflux from 'reflux'
import {NetworkStore} from '../stores/Network'
import {Network} from './Network'
import {NetworkActions} from '../actions'

export var NetworkEdit = React.createClass({

  mixins: [Reflux.connect(NetworkStore, 'network')],

  componentDidMount() {
    NetworkActions.read(this.props.params.id)
  },

  save(data) {
      NetworkActions.update(data)
  },

  getInitialState() {
    return {network: {network: {}}}
  },

  render() {
      return (
          <Network
            title={this.state.network.network.description}
            save_handler={this.save}
            network_data={this.state.network.network}
             />
    )
  }
})



import * as React from 'react'
import {Network} from './Network'
import {NetworkActions} from '../actions'

export var NetworkNew = React.createClass({

    save(data) {
        NetworkActions.create(data)
    },

    render() {
        return (
            <Network title="New network"
                     save_handler={this.save}
            />
        )
    }
})



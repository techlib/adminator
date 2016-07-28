import * as React from 'react'
import {AdminNavBar} from './AdminNavBar'

export var App = React.createClass({
    render() {
        return <div>
            <AdminNavBar />
            {this.props.children}
        </div>
    }
})

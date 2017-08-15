import * as React from 'react'
import {AdminNavBar} from './AdminNavBar'

export var App = React.createClass({

    componentDidMount() {
      setInterval(this.poll, 10000);
    },

    poll() {
			$.ajax({
					url: "/ping"
      }).fail(function(err){
						location.reload();
      }).then(function(data) {
					if(!data.pong){
						location.reload();
					}
			}.bind(this))
    },

    render() {
        return <div>
            <AdminNavBar />
            {this.props.children}
        </div>
    }
})

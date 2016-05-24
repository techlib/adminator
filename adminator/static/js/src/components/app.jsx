var App = React.createClass({
    render() {
        return <div>
            <AdminNavbar />
            {this.props.children}
        </div>
    }
})

"use strict";

var NetworkNew = React.createClass({
    displayName: "NetworkNew",

    save: function save(data) {
        NetworkActions.create(data);
    },

    render: function render() {
        return React.createElement(Network, { title: "New network",
            save_handler: this.save
        });
    }
});
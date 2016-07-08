'use strict';

var AclLink = React.createClass({
    displayName: 'AclLink',

    render: function render() {
        return React.createElement(
            Link,
            { to: '/network/acl/' + this.props.data },
            this.props.data
        );
    }
});

var AclActions = React.createClass({
    displayName: 'AclActions',

    render: function render() {
        return null;
    }
});

var NetworkAclList = React.createClass({
    displayName: 'NetworkAclList',

    mixins: [Reflux.connect(networkStore, 'networks'), Reflux.connect(networkAclStore, 'acl')],

    componentDidMount: function componentDidMount() {
        NetworkActions.list();
        NetworkAclActions.list();
    },

    getInitialState: function getInitialState() {
        this.state = { 'networks': { 'list': [] }, 'acl': { 'list': [] } };
        return this.state;
    },

    colMetadata: [{ columnName: 'role', displayName: 'Role',
        customComponent: AclLink }, { columnName: 'controls', displayName: '',
        customComponent: AclActions }],

    render: function render() {
        return React.createElement(
            'div',
            { className: 'container-fluid col-xs-12' },
            React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                    'div',
                    { className: 'col-xs-12 col-sm-6' },
                    React.createElement(
                        'h1',
                        null,
                        'Network ACL'
                    )
                )
            ),
            React.createElement(Feedback, null),
            React.createElement(Griddle, { results: this.state.acl.list,
                tableClassName: 'table table-bordered table-striped table-hover',
                columnMetadata: this.colMetadata,
                useGriddleStyles: false,
                showFilter: true,
                showPager: false,
                columns: ['role', 'controls'],
                initialSort: 'role'
            })
        );
    }

});
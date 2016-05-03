'use strict';

var NetLink = React.createClass({
    displayName: 'NetLink',

    render: function render() {
        return React.createElement(
            Link,
            { to: '/network/' + this.props.rowData.uuid },
            this.props.data
        );
    }
});

var NetActions = React.createClass({
    displayName: 'NetActions',

    mixins: [ModalConfirmMixin],

    handleDelete: function handleDelete() {
        var _this = this;

        var name = this.props.rowData.description;
        this.modalConfirm('Confirm delete', 'Delete ' + name + '?', { 'confirmLabel': 'DELETE', 'confirmClass': 'danger' }).then(function () {
            NetworkActions['delete'](_this.props.rowData.uuid);
        });
    },

    render: function render() {
        var id = 'row' + this.props.rowData.uuid;
        return React.createElement(
            OverlayTrigger,
            { placement: 'top', overlay: React.createElement(
                    Tooltip,
                    { id: id },
                    'Delete'
                ) },
            React.createElement(
                Button,
                { bsStyle: 'danger', onClick: this.handleDelete },
                React.createElement('i', { className: 'fa fa-trash-o' })
            )
        );
    }
});

var NetworkList = React.createClass({
    displayName: 'NetworkList',

    mixins: [Reflux.connect(networkStore, 'data')],

    componentDidMount: function componentDidMount() {
        NetworkActions.list();
    },

    getInitialState: function getInitialState() {
        this.state = { 'data': { 'list': [], 'network': {} } };
        return this.state;
    },

    colMetadata: [{ columnName: 'description', displayName: 'Description',
        customComponent: NetLink }, { columnName: 'vlan', displayName: 'VLAN' }, { columnName: 'prefix4', displayName: 'Prefix IPv4' }, { columnName: 'prefix6', displayName: 'Prefix IPv6' }, { columnName: 'max_lease', displayName: 'Max. lease' }, { columnName: 'controls', displayName: 'Actions',
        customComponent: NetActions }],

    render: function render() {
        return React.createElement(
            'div',
            null,
            React.createElement(AdminNavbar, null),
            React.createElement(
                'div',
                { className: 'col-xs-12 container' },
                React.createElement(
                    'h3',
                    null,
                    'Networks'
                ),
                React.createElement(Feedback, null),
                React.createElement(
                    'p',
                    null,
                    React.createElement(
                        Link,
                        { to: '/dhcp/' },
                        'Global DHCP options'
                    ),
                    React.createElement(
                        'a',
                        { className: 'btn btn-success pull-right', href: '#/network/new' },
                        React.createElement('i', { className: 'fa fa-plus' }),
                        ' New network'
                    )
                ),
                React.createElement(Griddle, { results: this.state.data['list'],
                    tableClassName: 'table table-striped table-hover',
                    columnMetadata: this.colMetadata,
                    useGriddleStyles: false,
                    showFilter: true,
                    columns: ['description', 'vlan', 'prefix4', 'prefix6', 'max_lease', 'controls'],
                    showPager: true,
                    resultsPerPage: '50',
                    useCustomPagerComponent: true,
                    customPagerComponent: Pager,
                    initialSort: 'description'
                })
            )
        );
    }
});
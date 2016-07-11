'use strict';

var UserInfoStore = Reflux.createStore({

    listenables: [UserInfoActions],
    data: {},

    init: function init() {
        this.onRead();
    },

    onRead: function onRead() {
        var _this = this;

        $.ajax({ url: '/user-info/',
            success: function success(result) {
                _this.data = result;
                _this.processNetworks();
                _this.trigger(_this.data);
            },
            error: function error(result) {
                FeedbackActions.set('error', result.responseJSON.message);
            }
        });
    },

    isAllowed: function isAllowed(privilegesAllowed) {
        if (!_.isArray(privilegesAllowed)) {
            privilegesAllowed = _.map(privilegesAllowed.split(','), function (i) {
                return i.trim();
            });
        }
        privilegesAllowed.push('admin'); // admin is always allowed
        return _.intersection(this.data.privileges, privilegesAllowed).length > 0;
    },

    processNetworks: function processNetworks() {
        var result = {
            'device': [],
            'staff': [],
            'visitor': []
        };

        _.each(this.data.networks, function (item, network) {
            _.each(item, function (type) {
                result[type].push(network);
            });
        });

        this.data.networks = _.pick(result, function (value) {
            return value.length > 0;
        });

        if (this.isAdmin()) {
            this.data.networks = null;
        }
    },

    isAdmin: function isAdmin() {
        return _.includes(this.data.privileges, 'admin');
    },

    getDeviceTypePermissions: function getDeviceTypePermissions() {
        return this.data.networks;
    }

});
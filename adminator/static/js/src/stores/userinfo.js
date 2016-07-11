'use strict';

var UserInfoStore = Reflux.createStore({

    listenables: [UserInfoActions],
    data: {},

    init() {
        this.onRead()
    },

    onRead() {
        $.ajax({url: '/user-info/',
            success: result => {
                this.data = result
                this.processNetworks()
                this.trigger(this.data)
            },
            error: result => {
                FeedbackActions.set('error', result.responseJSON.message);
            }
        })
    },

	isAllowed(privilegesAllowed) {
        if (!_.isArray(privilegesAllowed)) {
            privilegesAllowed = _.map(privilegesAllowed.split(','), (i) => i.trim())
        }
        privilegesAllowed.push('admin') // admin is always allowed
        return _.intersection(this.data.privileges, privilegesAllowed).length > 0
	},

    processNetworks() {
        var result = {
           'device': [],
           'staff': [],
           'visitor': []
        }

        _.each(this.data.networks, (item, network) => {
            _.each(item, (type) => {
                result[type].push(network)
            })
        })

        this.data.networks = _.pick(result, (value) => {
            return value.length > 0
        })

        if (_.isEmpty(this.data.networks) || this.isAdmin()) {
            this.data.networks = null
        }
    },

    isAdmin() {
        return _.includes(this.data.privileges, 'admin')
    },

	getDeviceTypePermissions() {
        return this.data.networks
	},

})

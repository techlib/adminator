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

	getDeviceTypePermissions() {
        return null;
        /*
		return {
            'visitor': ['0b645942-c6b9-4e21-9c97-c47f2524e9ea'],
			'device':  ['5e269bd2-be39-49f9-9810-519529fdc86c',
                        'a4e8d238-9f6d-44ac-8444-176a568a0cbd'],
		}
       */
	},

})

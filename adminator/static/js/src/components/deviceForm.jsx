var DeviceForm = React.createClass({

    commonProps: {
        labelClassName: 'col-xs-2',
        wrapperClassName: 'col-xs-10',
    },

    componentWillReceiveProps(p) {
        this.setState(p.device);
    },

    getInitialState() {
        return {type: 'staff', valid: [
            moment().format('YYYY-MM-DDTHH:mm:ss'),
            moment().add(1, 'y').format('YYYY-MM-DDTHH:mm:ss')
        ]}
    },

    getDefaultProps() {
        return {users: []}
    },

    handleChange(evt) {
        this.setState({[evt.target.name]: evt.target.value})
    },

    handleValidChange(value) {
        this.setState({valid: value})
    },

    getValues() {
        var data = {
            type: this.state.type,
            description: this.state.description
        }
        if (this.state.type == 'staff') {
            data.description = this.state.description
            data.user = this.state.user
        } else if (this.state.type == 'visitor') {
            data.valid = this.state.valid
        }
        return data
    },

    validate() {
        var r = []
        if (!minLen(this.state.description, 4)) {
            r.push(`Description ${this.state.description} is too short (4 chars min)`)
        }
        if (this.state.type == 'staff') {
            if (!this.state.user) {
                r.push('User is required')
            }
        } else if (this.state.type == 'visitor') {
            r = r.concat(this.refs.valid.validate())
        }

        return r
    },

    getUserSelect() {
        if (this.state.type == 'staff') {
            return (
                <BootstrapSelect
                    label='User'
                    ref='user'
                    name='user'
                    onChange={this.handleChange}
                    data-live-search={true}
                    value={this.state.user}
                    {...this.commonProps}>
                        {this.props.users.map((item) => {
                            return <option value={item.cn} key={item.cn}>
                                {item.display_name}</option>
                        })}
                </BootstrapSelect>
            )
        }
    },

    getVisitorValidRange() {
        if (this.state.type == 'visitor') {
            return (
                <DateRangePicker range={this.state.valid}
                                 ref='valid'
                                 name='valid'
                                 onChange={this.handleValidChange} />
            )
        }
    },

    render() {
        return (
            <div className='form-horizontal'>
                <Input
                    type='text'
                    label='Description'
                    ref='description'
                    name='description'
                    onChange={this.handleChange}
                    value={this.state.description}
                    {...this.commonProps} />

                <BootstrapSelect
                    ref='type'
                    name='type'
                    label='Type'
                    onChange={this.handleChange}
                    defaultValue='staff'
                    value={this.state.type}
                    {...this.commonProps}>
                        <option value='visitor'>Visitor</option>
                        <option value='staff'>Staff</option>
                        <option value='device'>Device</option>
                </BootstrapSelect>
                {this.getUserSelect()}
                {this.getVisitorValidRange()}
            </div>
        )
    }
})

var DeviceInterface = React.createClass({

    mixins: [Reflux.connect(interfaceStore, 'data')],

    getInitialState() {
        return this.props.item
    },

    componentDidMount() {
        if (!this.state.network && _.isArray(this.props.networks)) {
            this.setState({network: this.props.networks[0].uuid})
        }
    },

    handleChange(evt) {
        this.setState({[evt.target.name]: evt.target.value})
    },

    formatMac() {
        this.setState({macaddr: formatMac(this.state.macaddr)})
    },

    handleDelete() {
        this.props.deleteHandler(this.props.index)
    },

    getValues() {
        var r = this.state
        delete r.uuid
        return r
    },

    validate() {
        var r = []
        var mac = formatMac(this.state.macaddr)
        if (!notEmpty(mac)) {r.push('Missing mac address')}
        if (!isMAC(mac)) {r.push(`Mac ${mac} address invadlid`)}
        if (notEmpty(this.state.hostname) && !minLen(this.state.hostname, 4)) {
            r.push(`Hostname ${this.state.hostname} is too short (4 chars min)`)
        }

        if (this.state.ip4addr && !isIP4(this.state.ip4addr)) {
            r.push(`${this.state.ip4addr} is not valid IPv4 address`)
        }

        if (this.state.ip6addr && !isIP6(this.state.ip6addr)) {
            r.push(`${this.state.ip6addr} is not valid IPv6 address`)
        }
        return r;
    },

    render() {
        var commonProps = {
            type: 'text',
            labelClassName: 'col-xs-2',
            wrapperClassName: 'col-xs-10',
            onChange: this.handleChange
        }

        var delimiter = null;
        if (this.props.delimiter) {
            var delimiter = <hr />
        }

        return (
            <div className='form-horizontal'>
                <Input
                    label='MAC'
                    ref='macaddr'
                    name='macaddr'
                    value={this.state.macaddr}
                    onBlur={this.formatMac}
                    {...commonProps} />

                <Input
                    label='Hostname'
                    ref='hostname'
                    name='hostname'
                    value={this.state.hostname}
                    {...commonProps} />

                <Input
                    label='IPv4 address'
                    ref='ip4addr'
                    name='ip4addr'
                    placeholder='Dynamic'
                    value={this.state.ip4addr}
                    {...commonProps} />

                <Input
                    label='IPv6 address'
                    ref='ip6addr'
                    name='ip6addr'
                    placeholder='Dynamic'
                    value={this.state.ip6addr}
                    {...commonProps} />

                <BootstrapSelect
                    updateOnLoad
                    label='Network'
                    ref='network'
                    name='network'
                    {...commonProps}
                    value={this.state.network}>
                    {_.map(this.props.networks, (item) => {
                        return <option value={item.uuid} key={item.uuid}>
                                {item.description}
                            </option>
                    })}
                </BootstrapSelect>

                <div className='form-group'>
                <div className='col-xs-offset-2 col-xs-10'>
                    <Button
                        label=''
                        bsStyle='danger'
                        onClick={this.handleDelete}>
                        <i className="fa fa-trash-o"></i> delete
                    </Button>
                </div>
                </div>
                {delimiter}
            </div>
        )
    }
})

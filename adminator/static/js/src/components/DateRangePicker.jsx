import * as React from 'react'
import DateTimeField from 'react-bootstrap-datetimepicker'
import moment from 'moment'
export var DateRangePicker = React.createClass({

  handleValidSince(since){
     this.props.onChange([since, this.props.range[1]])
  },

  handleValidUntil(until){
     this.props.onChange([this.props.range[0], until])
  },

  componentDidMount() {
      if (!this.props.range) {
        this.handleValidSince(this.state.range[0])
        this.handleValidUntil(this.state.range[1])
      }
  },

  validate() {
      var r = []
      if (this.props.range[0] == 'Invalid date') {
        r.push('Valid not before is required for visitors')
      }
      if (this.props.range[1] == 'Invalid date') {
        r.push('Valid not after is required for visitors')
      }
      return r
  },

  getValues() {
    return this.props.range
  },

  render(){
    var max = this.props.range[1]
    var min = this.props.range[0]

   return (
      <div>
        <div className='form-group'>
           <label className='control-label col-xs-2'>Not before</label>
           <div className='col-xs-10'>
           <DateTimeField
             ref='valid_since'
             format='YYYY-MM-DDTHH:mm:ss'
             inputFormat='YYYY-MM-DD HH:mm:ss'
             maxDate={moment(max)}
             onChange={this.handleValidSince}
             dateTime={min} />
          </div>
        </div>

        <div className='form-group'>
          <label className='control-label col-xs-2'>Not after</label>
          <div className='col-xs-10'>
          <DateTimeField
            ref='valid_until'
            onChange={this.handleValidUntil}
            format='YYYY-MM-DDTHH:mm:ss'
            inputFormat='YYYY-MM-DD HH:mm:ss'
            minDate={moment(min)}
            dateTime={max} />
         </div>
        </div>
      </div>
    )
  }
})

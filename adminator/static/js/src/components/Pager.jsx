import * as React from 'react'

export var Pager = React.createClass({
    getDefaultProps() {
        return{
            'maxPage': 0,
            'nextText': '',
            'previousText': '',
            'currentPage': 0,
        }
    },
    pageChange(event) {
        this.props.setPage(parseInt(event.target.getAttribute('data-value')))
    },
    render() {

      var prevActive = this.props.currentPage > 0 ? '': 'disabled'
      var previous = <li className={prevActive}><a onClick={this.props.previous}><i className="glyphicon glyphicon-arrow-left"></i> {this.props.previousText}</a></li>

      var nextActive = this.props.currentPage != (this.props.maxPage -1) ? '': 'disabled'
      var next = <li className={nextActive}><a onClick={this.props.next}>{this.props.nextText} <i className="glyphicon glyphicon-arrow-right"></i></a></li>

      var options = []

      var startIndex = Math.max(this.props.currentPage - 5, 0)
      var endIndex = Math.min(startIndex + 11, this.props.maxPage)

      if (this.props.maxPage >= 11 && (endIndex - startIndex) <= 10) {
        startIndex = endIndex - 11
      }

      var firstActive = startIndex > 0 ? '': 'disabled'
      var first = <li className={firstActive}><a onClick={this.pageChange} data-value='0'><i className="glyphicon glyphicon-step-backward"></i>First</a></li>

      var lastActive = endIndex < this.props.maxPage ? '' : 'disabled'
      var last = <li className={lastActive}><a onClick={this.pageChange} data-value={this.props.maxPage - 1}>Last <i className="glyphicon glyphicon-step-forward"></i></a></li>


        for(var i = startIndex; i < endIndex;  i++) {
          var selected = this.props.currentPage == i ? 'active' : ''
            options.push(<li key={i} className={selected}><a onClick={this.pageChange} data-value={i}>{i + 1}</a></li>)
        }

        return (
          <div className="row">
            <div className="col-md-11">
              <ul className="pagination noselect">
                {first}{previous}{options}{next}{last}
              </ul>
            </div>
          </div>
        )
    }
})

var Pager = React.createClass({
    getDefaultProps(){
        return{
            "maxPage": 0,
            "nextText": "",
            "previousText": "",
            "currentPage": 0,
        }
    },
    pageChange(event){
        this.props.setPage(parseInt(event.target.getAttribute("data-value")));
    },
    render(){

      var prevActive = this.props.currentPage > 0 ? '': 'disabled'
      var previous = <li className={prevActive}><a onClick={this.props.previous}><i className="glyphicon glyphicon-arrow-left"></i> {this.props.previousText}</a></li>

      var nextActive = this.props.currentPage != (this.props.maxPage -1) ? '': 'disabled'
      var next = <li className={nextActive}><a onClick={this.props.next}>{this.props.nextText} <i className="glyphicon glyphicon-arrow-right"></i></a></li>

      var options = [];

      var startIndex = Math.max(this.props.currentPage - 5, 0);
      var endIndex = Math.min(startIndex + 11, this.props.maxPage);

      if (this.props.maxPage >= 11 && (endIndex - startIndex) <= 10) {
        startIndex = endIndex - 11;
      }

        for(var i = startIndex; i < endIndex ; i++){
          var selected = this.props.currentPage == i ? 'active' : '';
            options.push(<li key={i} className={selected}><a onClick={this.pageChange} data-value={i}>{i + 1}</a></li>);
        }

        return (
          <div className="row">
            <div className="col-md-12">
              <ul className="pagination noselect">
                {previous}{options}{next}
              </ul>
            </div>
          </div>
        )
    }
});

"use strict";

var Pager = React.createClass({
  displayName: "Pager",

  getDefaultProps: function getDefaultProps() {
    return {
      "maxPage": 0,
      "nextText": "",
      "previousText": "",
      "currentPage": 0
    };
  },
  pageChange: function pageChange(event) {
    this.props.setPage(parseInt(event.target.getAttribute("data-value")));
  },
  render: function render() {

    var prevActive = this.props.currentPage > 0 ? '' : 'disabled';
    var previous = React.createElement(
      "li",
      { className: prevActive },
      React.createElement(
        "a",
        { onClick: this.props.previous },
        React.createElement("i", { className: "glyphicon glyphicon-arrow-left" }),
        " ",
        this.props.previousText
      )
    );

    var nextActive = this.props.currentPage != this.props.maxPage - 1 ? '' : 'disabled';
    var next = React.createElement(
      "li",
      { className: nextActive },
      React.createElement(
        "a",
        { onClick: this.props.next },
        this.props.nextText,
        " ",
        React.createElement("i", { className: "glyphicon glyphicon-arrow-right" })
      )
    );

    var options = [];

    var startIndex = Math.max(this.props.currentPage - 5, 0);
    var endIndex = Math.min(startIndex + 11, this.props.maxPage);

    if (this.props.maxPage >= 11 && endIndex - startIndex <= 10) {
      startIndex = endIndex - 11;
    }

    for (var i = startIndex; i < endIndex; i++) {
      var selected = this.props.currentPage == i ? 'active' : '';
      options.push(React.createElement(
        "li",
        { className: selected },
        React.createElement(
          "a",
          { onClick: this.pageChange, "data-value": i },
          i + 1
        )
      ));
    }

    return React.createElement(
      "div",
      { className: "row" },
      React.createElement(
        "div",
        { className: "col-md-12" },
        React.createElement(
          "ul",
          { className: "pagination noselect" },
          previous,
          options,
          next
        )
      )
    );
  }
});
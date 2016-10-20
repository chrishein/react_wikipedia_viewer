var SEARCH_WIKIPEDIA_URL = "https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&utf8=1&origin=*&srsearch=";
var RANDOM_WIKIPEDIA_ARTICLE_URL = "https://en.wikipedia.org/wiki/Special:Random";
var WIKIPEDIA_BASE_URL = "https://en.wikipedia.org/wiki/";

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

var InstantBox = React.createClass({
  doSearch: function(queryText) {
      this.setState({
        query: queryText,
      });

      // This should use some kind of debounce
      var self = this;
      $.getJSON(SEARCH_WIKIPEDIA_URL + encodeURIComponent(queryText),
        function(data) {
          self.setState({
            filteredData: data['query']['search']
          });
      });
  },

  getInitialState: function() {
      return {
          query: '',
          filteredData: undefined
      }
  },

  renderResults: function() {
      if (this.state.filteredData) {
          return (
              <DisplayTable data={this.state.filteredData}/>
          );
      }
  },

  render: function() {
      return (
          <div className="InstantBox">
              <h2>
                <i className="fa fa-wikipedia-w"></i>
                <span className="search-title">Search Wikipedia</span>
              </h2>
              <div className="input-group">
                <SearchBox query={this.state.query} doSearch={this.doSearch}/>
                <RandomButton/>
              </div>
              {this.renderResults()}
          </div>
      );
  }
});

var RandomButton = React.createClass({
  componentDidMount: function() {
    this.attachTooltip();
  },

  componentDidUpdate: function() {
    this.attachTooltip();
  },

  attachTooltip: function() {
    $(this.refs.random).tooltip();
  },

  render: function() {
      return (
        <div className="input-group-btn">
          <button ref="random" className="btn btn-success" type="button" data-toggle="tooltip"
            data-placement="bottom" title="Click to read a random Wikipedia entry"
            onClick={this.openRandomArticle}>
            <i className="fa fa-cube"></i>
            <span className="random-label">Random</span>
          </button>
        </div>
      );
  },

  openRandomArticle: function(e) {
    var win = window.open(RANDOM_WIKIPEDIA_ARTICLE_URL, '_blank');
  }
});

var SearchBox = React.createClass({
  doSearch: function() {
    var query = this.refs.searchInput.value;
    this.props.doSearch(query);
  },
  render: function() {
      return <input className="searchbar-edit form-control" type="text" ref="searchInput" placeholder="Search Wikipedia" value={this.props.query} onChange={this.doSearch}/>
  }
});

var DisplayTable = React.createClass({
  render: function() {
    var rows = [];
    this.props.data.forEach(function(article) {
      rows.push(<DisplayTableRow article={article}/>);
    });

    return (
         <table className="display-table table table-striped">
            <tbody>{rows}</tbody>
        </table>
    );
  }
});

var DisplayTableRow = React.createClass({
  render: function() {
    var url = WIKIPEDIA_BASE_URL + encodeURIComponent(this.props.article.title);
    return (
      <tr>
        <td>
          <i className="fa fa-newspaper-o"></i>
          <a className="article-title" href={url} target="_blank">{this.props.article.title}</a>
        </td>
      </tr>
    );
  }
});



ReactDOM.render(
  <InstantBox/>,
  document.getElementById('content')
);

const SEARCH_WIKIPEDIA_URL = "https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&utf8=1&origin=*&srsearch=";
const RANDOM_WIKIPEDIA_ARTICLE_URL = "https://en.wikipedia.org/wiki/Special:Random";
const WIKIPEDIA_BASE_URL = "https://en.wikipedia.org/wiki/";

class InstantBox extends React.Component {
  constructor() {
    super();
    this.state = {
      query: '',
      filteredData: undefined
    };
  }

  doSearch = (queryText) => {
    this.setState({
      query: queryText,
    });

    // This should use some kind of debounce
    $.getJSON(SEARCH_WIKIPEDIA_URL + encodeURIComponent(queryText),
      (data) => {
        this.setState({
          filteredData: data['query']['search']
        });
    });
  }

  renderResults() {
    if (this.state.filteredData) {
      return (
          <DisplayTable data={this.state.filteredData}/>
      );
    }
  }

  render() {
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
}

class RandomButton extends React.Component {
  componentDidMount() {
    this.attachTooltip();
  }

  componentDidUpdate() {
    this.attachTooltip();
  }

  attachTooltip = () => {
    $(this.refs.random).tooltip();
  }

  render() {
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
  }

  openRandomArticle(e) {
    window.open(RANDOM_WIKIPEDIA_ARTICLE_URL, '_blank');
  }
}

class SearchBox extends React.Component {
  doSearch = () => {
    this.props.doSearch(this.refs.searchInput.value);
  }

  render() {
    return (
          <input className="searchbar-edit form-control" type="text" ref="searchInput"
           placeholder="Search Wikipedia" value={this.props.query} onChange={this.doSearch}/>
         );
  }
}

class DisplayTable extends React.Component {
  render() {
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
}

class DisplayTableRow extends React.Component {
  render() {
    const url = WIKIPEDIA_BASE_URL + encodeURIComponent(this.props.article.title);
    return (
      <tr>
        <td>
          <i className="fa fa-newspaper-o"></i>
          <a className="article-title" href={url} target="_blank">{this.props.article.title}</a>
        </td>
      </tr>
    );
  }
}



ReactDOM.render(
  <InstantBox/>,
  document.getElementById('content')
);

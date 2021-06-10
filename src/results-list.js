import React from 'react'
import ReactPaginate from 'react-paginate'
import PropTypes from 'prop-types'
import 'whatwg-fetch'
import Search from './search.js'
import Result from './result.js'
import ShowMore from './show-more.js'
import FilterRange from './filter-range.js'

// This component represents the Results List,
// but is the highest order component in the app.
// Parent to all other components in app.
const DEFAULT_START_YEAR = 1888
const DEFAULT_END_YEAR = new Date().getFullYear()

class ResultsList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      resultsURI: '',
      currentPage: 1,
      showMorePageIterator: 0, // page offset from initial after showing
      fulfilled: false, // more results
      status: null, // 'true' or 'false' for results of api fetch
      results: [],
      totalResults: 0,
      canLoadMore: false, // tracks if ShowMore should be visible
      filterStartYear: DEFAULT_START_YEAR,
      filterEndYear: DEFAULT_END_YEAR,
      totalVisibleResults: 0
    }
  }

  // This is called when user selects page from react-paginate component
  goToPage (data) {
    // change state so page doesn't have show more or paginate
    // components on page until after results are loaded

    const selected = data.selected + 1

    const baseURI = this.state.resultsURI.split('&page=')[0]
    const pageParam = `&page=${selected}`
    const pageURI = baseURI + pageParam

    this.setState({
      currentPage: selected,
      results: [], // result list (show as new page)
      status: 'loading',
      showMorePageIterator: 0,
      filterStartYear: DEFAULT_START_YEAR,
      filterEndYear: DEFAULT_END_YEAR
    })

    this.getResults(pageURI)
  }

  // For obtaining results for any reason, whether from
  // new page being selected in react-paginate, or using
  // the ShowMore component to load more on same page.
  // pass true to concatinate to this.state.results.
  getResults (URI, append = false) {
    fetch(URI)
      .then(res => res.json())
      .then(data => {
        if (data.Response === 'False') {
          this.setState({
            fulfilled: false,
            status: data.Error,
            totalResults: 0
          })
        } else {
          const currResultCount = 10 * (this.state.currentPage + this.state.showMorePageIterator)
          let canShowMore
          if (currResultCount < data.totalResults) {
            canShowMore = true
          } else {
            canShowMore = false
          }

          // handle how results are based on appending param
          let newResults
          let newShowMorePageIterator
          if (append === true) { // concat this.state.results
            newResults = this.state.results.concat(data.Search)
            newShowMorePageIterator = this.state.showMorePageIterator
          } else {
            newResults = data.Search
            newShowMorePageIterator = 0
          }

          // update state from results
          this.setState({
            fulfilled: true,
            status: 'Showing Results',
            results: newResults,
            totalResults: data.totalResults,
            resultsURI: URI,
            canLoadMore: canShowMore,
            showMorePageIterator: newShowMorePageIterator
          })
          this.getTotalVisibleCount(newResults)
        }
      },
      (error) => {
        console.error(error)
      }
      )
  }

  onResults () {
    if (this.state.fulfilled && this.props.onResults) {
      this.props.onResults(this.state.fulfilled)
    }
  }

  showMore () {
    this.setState({
      status: 'loading'
    })

    const pagesFromCurrent = this.state.showMorePageIterator + 1
    this.setState({
      showMorePageIterator: pagesFromCurrent
    })

    const baseURI = this.state.resultsURI.split('&page=')[0]
    const pageOffset = this.state.currentPage + this.state.showMorePageIterator + 1
    const pageParam = '&page=' + pageOffset
    const pageURI = baseURI + pageParam
    this.getResults(pageURI, true)

    // see if there is more to load and then pass sentinel for ShowMore comp.
    const pagesLeft = Math.ceil(this.state.totalResults / 10) -
        pageOffset

    if (pagesLeft <= 0) {
      this.setState({
        canLoadMore: false
      })
    }
  }

  filterByYear (startYear, endYear) {
    // make non matching results invisible
    this.setState({
      filterStartYear: startYear,
      filterEndYear: endYear
    }, function () { this.getTotalVisibleCount(this.state.results) })
  }

  // pass data from fetch and get how many would be visible
  getTotalVisibleCount (results) {
    let count = 0
    for (let i = 0; i < results.length; i++) {
      if (results[i].Year >= this.state.filterStartYear &&
        results[i].Year <= this.state.filterEndYear) {
        count++
      }
    }

    this.setState({
      totalVisibleResults: count
    })
    return count
  }

  // render HTML for results list
  render () {
    // reset fields upon rendering new page (if needed)
    let listHTML

    if (this.state.totalVisibleResults !== 0) {
      listHTML = (
      <div className="result-list-container">
      {this.state.fulfilled === true &&
        this.state.results.map((result) => (
          <div key={result.imdbID}>
            <Result
              img={result.Poster}
              title={result.Title}
              type={result.Type}
              year={parseInt(result.Year, 10)}
              imdbID={result.imdbID}
              isVisible={
                result.Year >= this.state.filterStartYear &&
                result.Year <= this.state.filterEndYear
              }
            />
          </div>
        ))}
      </div>
      )
    } else {
      listHTML = (
        <div className="result-list-container">
          <p className="no-results-visible">
            No results found after filtering. Try using a wider range of years!
          </p>
        </div>
      )
    }

    return (
      <div>
        <div className="search-header">
          <Search onSubmit={(queryURI) => this.getResults(queryURI)} />
        </div>
        {this.state.fulfilled === true && (
          <FilterRange
            onFilter={(startYear, endYear) => this.filterByYear(startYear, endYear)}
            startYear={this.state.filterStartYear}
            endYear={this.state.filterEndYear}
          />
        )}
        <div className="results-status-container">
          {this.state.fulfilled !== true && (
            <h3 className="results-status">{this.state.status}</h3>
          )}
        </div>
        {this.state.fulfilled === true && listHTML}
        {this.state.canLoadMore === true && (
          <ShowMore
            onClick={this.showMore.bind(this)}
            canLoadMore={this.state.canLoadMore}
            pagesRemaining={
              Math.ceil(this.state.totalResults / 10) - this.state.currentPage
            }
          />
        )}
        {this.state.fulfilled === true && (
          <div className="paginate-container">
            <ReactPaginate
              containerClassName="pagination"
              pageCount={Math.ceil(this.state.totalResults / 10)}
              pageRangeDisplayed={5}
              marginPagesDisplayed={2}
              onPageChange={this.goToPage.bind(this)}
            />
          </div>
        )}
        {this.state.fulfilled === true && (
          <p id="foot-note">{'"-" represents unavailable information.'}</p>
        )}
      </div>
    )
  }
}

// props type checking
ResultsList.propTypes = {
  onResults: PropTypes.string
}

export default ResultsList

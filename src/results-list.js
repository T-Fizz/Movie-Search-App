import React from 'react'
import ReactPaginate from 'react-paginate'
import PropTypes from 'prop-types'
import Search from './search.js'
import Result from './result.js'
import ShowMore from './show-more.js'

/* RESULTS LIST (meat of the app) */
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
      canLoadMore: false
    }
  }

  goToPage (data) {
    // change state so page doesn't have show more or paginate
    // components on page until after results are loaded

    console.log(data)
    const selected = data.selected + 1
    console.log('gotopage' + this.state.resultsURI)

    const baseURI = this.state.resultsURI.split('&page=')[0]
    const pageParam = `&page=${selected}`
    const pageURI = baseURI + pageParam
    console.log('pageURI' + pageURI)

    this.setState({
      currentPage: selected,
      results: [], // result list (show as new page)
      status: 'loading',
      showMorePageIterator: 0
    })

    console.log(pageURI)
    this.getResults(pageURI)
  }

  getResults (URI, append = false) {
    console.log('getting results for list')
    console.log(URI)
    fetch(URI)
      .then(res => res.json())
      .then(data => {
        console.log(data)

        if (data.Response === 'False') {
          this.setState({
            fulfilled: false,
            status: data.Error,
            totalResults: 0
          })
        } else {
          // see if can show more and update state accordingly
          console.log()

          const currResultCount = 10 * (this.state.currentPage + this.state.showMorePageIterator)
          let canShowMore
          if (currResultCount < data.totalResults) {
            canShowMore = true
          } else {
            canShowMore = false
          }
          console.log('Current page:' + this.state.currentPage)
          console.log('page iter:' + this.state.showMorePageIterator)
          console.log(data.totalResults)
          console.log(currResultCount)
          console.log(canShowMore)

          let newResults
          let newShowMorePageIterator
          if (append === true) {
            newResults = this.state.results.concat(data.Search)
            newShowMorePageIterator = this.state.showMorePageIterator
          } else {
            newResults = data.Search
            newShowMorePageIterator = 0
          }

          this.setState({
            fulfilled: true,
            status: 'Showing Results',
            results: newResults,
            totalResults: data.totalResults,
            resultsURI: URI,
            canLoadMore: canShowMore,
            showMorePageIterator: newShowMorePageIterator
          })
        }
      },
      (error) => {
        console.log(error)
      }
      )
  }

  onResults () {
    if (this.state.fulfilled && this.props.onResults) {
      this.props.onResults(this.state.fulfilled)
      console.log('Changed CSS file!')
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

    console.log(pagesFromCurrent + ':' + this.state.showMorePageIterator)

    const baseURI = this.state.resultsURI.split('&page=')[0]
    const pageOffset = this.state.currentPage + this.state.showMorePageIterator + 1
    const pageParam = '&page=' + pageOffset
    const pageURI = baseURI + pageParam
    console.log(pageURI)
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

  render () {
    return (
              <div>
                  <div className='search-header'>
                      <Search
                          onSubmit={queryURI => this.getResults(queryURI)}
                      />
                  </div>

                  <div className='results-status-container'>
                      {this.state.fulfilled !== true && <h3 className='results-status'>{this.state.status}</h3>}
                  </div>

                  {(this.state.fulfilled === true) && (
                    this.state.results.map((result) => (
                          <div key={result.imdbID}>
                              <Result
                                  img={result.Poster}
                                  title={result.Title}
                                  type={result.Type}
                                  year={result.Year}
                                  imdbID={result.imdbID}
                              />
                          </div>
                    ))
                  )}

                  {(this.state.canLoadMore === true) && (
                      <ShowMore
                          onClick={this.showMore.bind(this)}
                          canLoadMore={this.state.canLoadMore}
                          pagesRemaining={
                              Math.ceil(this.state.totalResults / 10) - this.state.currentPage
                          }
                      />
                  )}

                  {this.state.fulfilled === true &&
                      <div className='paginate-container'>
                          <ReactPaginate
                              containerClassName='pagination'
                              pageCount={Math.ceil(this.state.totalResults / 10)}
                              pageRangeDisplayed={5}
                              marginPagesDisplayed={2}
                              onPageChange={this.goToPage.bind(this)}
                          />
                      </div>}
                      {this.state.fulfilled === true &&
                      <p id="foot-note">
                        {'"-" represents unavailable information.'}
                      </p>}

              </div>
    )
  }
}

// props type checking
ResultsList.propTypes = {
  onResults: PropTypes.string
}

export default ResultsList

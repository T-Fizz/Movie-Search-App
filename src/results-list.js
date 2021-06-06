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
      totalResults: 0
    }
  }

  goToPage (data) {
    // change state so page doesn't have show more or paginate
    // components on page until after results are loaded
    this.setState({
      fulfilled: false,
      status: 'loading'
    })

    console.log(data)
    const selected = data.selected + 1
    console.log('gotopage' + this.state.resultsURI)

    const baseURI = this.state.resultsURI.split('&page=')[0]
    const pageParam = `&page=${selected}`
    const pageURI = baseURI + pageParam
    console.log('pageURI' + pageURI)

    this.setState({
      currentPage: selected,
      results: [] // result list (show as new page)
    })

    console.log(pageURI)
    this.getResults(pageURI)
  }

  getResults (URI) {
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
          this.setState({
            fulfilled: true,
            status: 'Showing Results:',
            results: this.state.results.concat(data.Search),
            totalResults: data.totalResults,
            resultsURI: URI
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
    console.log('Showing more')
    console.log(this.state)
    // will concatenate results list without resetting like this.goToPage()
    console.log(this.state.resultsURI)

    const pagesFromCurrent = this.state.showMorePageIterator + 1
    this.setState({
      showMorePageIterator: pagesFromCurrent
    })

    console.log(pagesFromCurrent + ':' + this.state.showMorePageIterator)

    const baseURI = this.state.resultsURI.split('&page=')[0]
    const pageParam = '&page=' + this.state.currentPage + this.state.showMorePageIterator
    const pageURI = baseURI + pageParam
    console.log(pageURI)
    this.getResults(pageURI)
  }

  render () {
    return (
              <div>
                  <div className='search-header'>
                      <Search
                          onSubmit={queryURI => this.getResults(queryURI)}
                      />
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

                  {(this.state.fulfilled === true) && (
                      <ShowMore
                          onClick={this.showMore.bind(this)}
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

              </div>
    )
  }
}

// props type checking
ResultsList.propTypes = {
  onResults: PropTypes.string
}

export default ResultsList

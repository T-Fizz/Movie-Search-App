import React from 'react'
import PropTypes from 'prop-types'
import ExampleMovies from './example-movies.json'
import BASE_API_URI from './base-api-uri'

const EXAMPLE_MOVIES = ExampleMovies.movies

/* SEARCH BAR */
class Search extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      searchBarContainerClassName: 'search-bar-container',
      isEmpty: true,
      queryURI: '',
      isSubmitted: false
    }

    const randomMovieIndex = Math.floor(Math.random() * EXAMPLE_MOVIES.length)

    this.exampleMovie = EXAMPLE_MOVIES[randomMovieIndex]

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  // user typing updates query params for api
  handleChange (event) {
    const quri = BASE_API_URI +
              '&s=' + event.target.value.trim().split(' ').join('+') +
              '&page=1'

    this.setState({
      isEmpty: event.target.value.trim().length === 0,
      queryURI: quri
    })
  }

  // request on submit
  handleSubmit (event) {
    event.preventDefault()
    const searchURI = this.state.queryURI

    // get JSON from api using searchURI, parse and fill
    if (!this.state.isEmpty && this.props.onSubmit) {
      this.props.onSubmit(searchURI)
      console.log('passed uri using props function')
      this.setState({
        searchBarContainerClassName: 'search-bar-container-with-results'
      })
    }
    console.log(searchURI)
  }

  render () {
    return (
              <div className={this.state.searchBarContainerClassName}>
                  <div className='search-bar'>
                      <form onSubmit={this.handleSubmit}>
                          <label htmlFor='search-query'>
                              Movie Search
                          </label>
                          <br />
                          <input
                              placeholder={this.exampleMovie}
                              onChange={this.handleChange}
                              value={this.state.query}
                          />
                          <button>
                              Search
                          </button>
                      </form>
                  </div>
              </div>
    )
  }
}

// props type checking
Search.propTypes = {
  onSubmit: PropTypes.func
}

export default Search

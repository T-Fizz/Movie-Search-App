import React from 'react'
import PropTypes from 'prop-types'
import ExampleMovies from './example-movies.json'
import BASE_API_URI from './base-api-uri'

const EXAMPLE_MOVIES = ExampleMovies.movies

// This component represents the searchbar
class Search extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      searchBarContainerClassName: 'search-bar-container', // changes on results
      isEmpty: true,
      queryURI: '',
      isSubmitted: false
    }

    const randomMovieIndex = Math.floor(Math.random() * EXAMPLE_MOVIES.length)

    this.exampleMovie = EXAMPLE_MOVIES[randomMovieIndex]

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  // as user types, queryURI is updated for api
  handleChange (event) {
    const quri = BASE_API_URI +
              '&s=' + event.target.value.trim().split(' ').join('+') +
              '&page=1'

    this.setState({
      isEmpty: event.target.value.trim().length === 0,
      queryURI: quri
    })
  }

  // handles user clicking "search" button
  handleSubmit (event) {
    if (!this.state.isEmpty) {
      event.preventDefault()
      const searchURI = this.state.queryURI

      // callsback the onSubmit from parent component ResultsList to get results
      if (this.props.onSubmit) {
        this.props.onSubmit(searchURI)
        this.setState({
          searchBarContainerClassName: 'search-bar-container-with-results'
        })
      }
    }
  }

  goToLandingPage () {
    // just refreshes so app reloads and landing page is displayed
    window.location.reload()
  }

  render () {
    return (
      <div className={this.state.searchBarContainerClassName}>
        <div className='search-bar'>
          <form onSubmit={this.handleSubmit}>
            <label htmlFor='search-query' onClick={this.goToLandingPage}>
              Movie Search
            </label>
            <br />
            <div className="search-input-container">
              <input
                placeholder={this.exampleMovie}
                onChange={this.handleChange}
                value={this.state.query}
              />
              <button>
                Search
              </button>
            </div>
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

import React from 'react'
import BASE_API_URI from './base-api-uri'
import PropTypes from 'prop-types'

// Details class handles user clicking the search result,
// and gathers more details and displays them to user.
class Details extends React.Component {
  constructor (props) {
    super(props)
    this.state = ({
      status: 'false', // 'false', 'loading', or 'true'
      data: {}
    })

    // get details upon construction (when parent is clicked)
    this.fetchAdditionalDetails()
  }

  // from api get details
  fetchAdditionalDetails () {
    console.log('getting details for ' + this.props.title)
    fetch(BASE_API_URI + '&i=' + this.props.imdbID)
      .then(res => res.json())
      .then(data => {
        console.log(data)

        if (data.Response === 'false') {
          this.setState({
            status: 'error',
            details: {}
          })
        } else {
          this.setState({
            status: 'loading',
            details: data
          })
          // format values to user friendly formats
          this.updateValuesToDisplay()
          console.log('Details Obtained ' + Date.now())
        }
      },
      (error) => {
        console.log(error)
      }
      )
  }

  updateValuesToDisplay () {
    // setup date fetched from api for locale of user
    const data = this.state.details

    console.log(this.state.details)
    if (this.state.details === undefined) {
      console.error('DETAILS IS UNDEFINED!')
    } else {
      // format premiere date if available
      let date
      if (this.state.details.Released !== 'N/A') {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const dateSplit = this.state.details.Released.split(' ')
        const day = dateSplit[0]
        console.log(dateSplit)
        const month = (months.indexOf(dateSplit[1]) + 1 >= 10) ? (months.indexOf(dateSplit[1])) : ('0' + months.indexOf(dateSplit[1]))
        const year = dateSplit[2]
        date = new Date(`${year}-${month}-${day}`)
      }

      // handle any missing info from api "N/A"
      console.log('r: ' + this.state.details.Released)

      // plot isn't part of bulleted list so will just omit if unavailable
      data.Plot = this.state.details.Plot !== 'N/A' ? this.state.details.Plot : ''
      data.Actors = this.state.details.Actors !== 'N/A' ? this.state.details.Actors : '-'
      data.Production = this.state.details.Production !== 'N/A' ? this.state.details.Production : '-'
      data.imdbRating = this.state.details.imdbRating !== 'N/A' ? this.state.details.imdbRating : '-'
      data.Genre = this.state.details.Genre !== 'N/A' ? this.state.details.Genre : '-'
      data.Rated = this.state.details.Rated !== 'N/A' ? this.state.details.Rated : '-'
      data.Runtime = this.state.details.Runtime !== 'N/A' ? this.state.details.Runtime : '-'
      data.Country = this.state.details.Country !== 'N/A' ? this.state.details.Country : '-'
      data.Language = this.state.details.Language !== 'N/A' ? this.state.details.Language : '-'
      data.Released = this.state.details.Released !== 'N/A' ? date.toLocaleDateString() : '-'

      this.setState({
        status: 'true',
        details: data
      })
    }
  }

  render () {
    console.log('details render')
    let detailHTML

    // successful fetch of details, show them
    if (this.state.status === 'true') {
      detailHTML = (
                  <div className='details-container'>
                      <div className='details-top'>
                          <p className='plot' id='plot'>
                              {this.state.details.Plot}
                          </p>
                      </div>
                      <div className='details-bottom'>
                          <ul className='details-list'>
                              <li><p className='detail-label'>Actors: </p><p>{this.state.details.Actors}</p></li>
                              <li><p className='detail-label'>Studios: </p><p>{this.state.details.Production}</p></li>
                              <li><p className='detail-label'>Premiered: </p><p>{this.state.details.Released}</p></li>
                              <li><p className='detail-label'>IMDB Rating: </p><p>{this.state.details.imdbRating}</p></li>
                              <li><p className='detail-label'>Genre: </p><p>{this.state.details.Genre}</p></li>
                              <li><p className='detail-label'>Rating: </p><p>{this.state.details.Rated}</p></li>
                              <li><p className='detail-label'>Length: </p><p>{this.state.details.Runtime}</p></li>
                              <li><p className='detail-label'>Country: </p><p>{this.state.details.Country}</p></li>
                              <li><p className='detail-label'>Language: </p><p>{this.state.details.Language}</p></li>
                          </ul>
                      </div>
                  </div>
      )
    } else if (this.state.status === 'loading') {
      detailHTML = (
                  <div className='details-container'>
                      <p className='details-loading'>
                          Fetching details...
                      </p>
                  </div>
      )
    } else { // error
      detailHTML = (
                  <div className='details-container'>
                      <p className='details-error'>
                          Something went wrong!
                      </p>
                  </div>
      )
    }

    return detailHTML
  }
}

// props type checking
Details.propTypes = {
  title: PropTypes.string,
  imdbID: PropTypes.string
}

export default Details

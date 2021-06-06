import React from 'react'
import PropTypes from 'prop-types'
// ShowMore class component allow users to expand current
// page results with just the click of a button.

// button that shows up at bottom of results
// used for showing more results on same page.
class ShowMore extends React.Component {
  constructor (props) {
    super(props)
    this.buttonStyles = ['show-more', 'show-more-hovering']

    this.state = {
      pagesRemaining: this.props.pagesRemaining,
      buttonStyle: 0
    }
    this.handleOnClick = this.handleOnClick.bind(this)
    this.handleOnMouseOver = this.handleOnMouseOver.bind(this)
    this.handleOnMouseOut = this.handleOnMouseOut.bind(this)
  }

  handleOnClick (event) {
    if (this.props.onClick) {
      this.props.onClick(event)
    }
  }

  handleOnMouseOver (event) {
    this.setState({
      buttonStyle: 1
    })
  }

  handleOnMouseOut (event) {
    this.setState({
      buttonStyle: 0
    })
  }

  render () {
    return (
              <div className='show-more-container'>
                  <button
                      className={this.buttonStyles[this.state.buttonStyle]} id='show-more'
                      onClick={this.handleOnClick}
                      onMouseOver={this.handleOnMouseOver}
                      onMouseOut={this.handleOnMouseOut}
                  >
                      🠗 Show More Results 🠗
                  </button>
              </div>
    )
  }
}

// props type checking
ShowMore.propTypes = {
  onClick: PropTypes.func,
  pagesRemaining: PropTypes.number
}

export default ShowMore

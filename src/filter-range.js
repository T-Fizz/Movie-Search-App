import React from 'react'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

// this class acts as the filter for year ranges of search results
class FilterRange extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      startYear: new Date('1888', 1), // first ever movie was made in 1888
      endYear: new Date(),
      status: 'valid'
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.setStartYear = this.setStartYear.bind(this)
    this.setEndYear = this.setEndYear.bind(this)
  }

  componentDidUpdate (prevProps) {
    if (this.props.startYear !== prevProps.startYear ||
      this.props.endYear !== prevProps.endYear) {
      this.updateYears()
    }
  }

  updateYears () {
    const start = new Date(this.props.startYear, 1, 0, 0, 0, 0, 0)
    const end = new Date(this.props.endYear, 1, 0, 0, 0, 0, 0)
    this.setState({
      startYear: start, // first ever movie was made in 1888
      endYear: end
    })
  }

  resetFilter () {
    this.setState({
      startYear: new Date('1888', 1), // first ever movie was made in 1888
      endYear: new Date(),
      status: 'valid'
    })
  }

  setStartYear (date) {
    const newStart = new Date(date)
    this.setState({
      startYear: newStart
    })
  }

  setEndYear (date) {
    const newEnd = new Date(date)
    this.setState({
      endYear: newEnd
    })
  }

  handleSubmit () {
    // use callback of function passed from props to handle passing filter years
    if (this.props.onFilter && this.state.status === 'valid') {
      const start = this.state.startYear.getFullYear()
      const end = this.state.endYear.getFullYear()
      this.props.onFilter(start, end)
    }
  }

  render () {
    return (
      <div className="filter-container">
        <div className="start-year-container">
          <label>Filter movies from Year:&nbsp;</label>
          <DatePicker
            selected={this.state.startYear}
            onChange={(date) => this.setStartYear(date)}
            maxDate={this.state.endYear}
            yearItemNumber={10}
            showYearPicker
            dateFormat="yyyy"
          />
        </div>
        <div className="end-year-container">
          <label>&nbsp;to year:&nbsp;</label>
          <DatePicker
            selected={this.state.endYear}
            onChange={(date) => this.setEndYear(date)}
            minDate={this.state.startYear}
            yearItemNumber={10}
            showYearPicker
            dateFormat="yyyy"
          />
        </div>
        <div className="filter-submit-container">
          {this.state.status === 'valid'
            ? (
            <button onClick={this.handleSubmit}>Filter</button>
              )
            : (
            <button onClick={this.handleSubmit} disabled>
              Filter
            </button>
              )}
        </div>
      </div>
    )
  }
}

// props type checking
FilterRange.propTypes = {
  onFilter: PropTypes.func,
  startYear: PropTypes.number,
  endYear: PropTypes.number
}

export default FilterRange

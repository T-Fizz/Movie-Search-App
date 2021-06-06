import React from 'react'
import ResultsList from './results-list.js'

// SearchApp acts as parent to all components in the movies search app
// Probably unnecessary but allows us to call "SearchApp"
// instead of "ResultsList" which is more intuitive.
function SearchApp () {
  return (
          <div>
              <ResultsList />
          </div>
  )
}

export default SearchApp

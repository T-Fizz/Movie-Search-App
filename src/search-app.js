import React from 'react'
import ResultsList from './results-list.js'

// SearchApp acts as parent to all components in the movies search app,
// including ResultsList which acts as highest layer component.

// Probably unnecessary but allows us to call "SearchApp"
// instead of "ResultsList" in index.js which is more intuitive.
function SearchApp () {
  return (
          <div>
              <ResultsList />
          </div>
  )
}

export default SearchApp

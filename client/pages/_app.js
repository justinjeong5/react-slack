import React from 'react'
import Proptypes from 'prop-types'
import '../css/index.css'

function App({ Component }) {
  return (
    <>
      <Component />
    </>
  )
}

App.propTypes = {
  Component: Proptypes.elementType.isRequired,
}

export default App
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
  Component: Proptypes.node.isRequired,
}

export default App
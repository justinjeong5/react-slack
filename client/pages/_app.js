import React from 'react'
import Proptypes from 'prop-types'
import withReduxSaga from 'next-redux-saga'
import wrapper from '../store/configureStore'

import '../css/index.css'
import 'antd/dist/antd.css';

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

export default wrapper.withRedux(withReduxSaga(App));
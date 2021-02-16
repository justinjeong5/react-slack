import React from 'react'
import Head from 'next/head'
import Proptypes from 'prop-types'
import withReduxSaga from 'next-redux-saga'
import wrapper from '../store/configureStore'

import '../css/index.css'
import 'antd/dist/antd.css';

function App({ Component }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>React Slack | by JustinJeong</title>
      </Head>
      <Component />
    </>
  )
}

App.propTypes = {
  Component: Proptypes.elementType.isRequired,
}

export default wrapper.withRedux(withReduxSaga(App));
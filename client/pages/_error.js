import React from 'react'
import Head from 'next/head'

function Error({ statusCode }) {
  return (
    <div>
      <Head>
        <title>깜짝이야! 에러가 생겼어요</title>
      </Head>
      <div style={{ height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ borderRight: '1px solid gray', padding: '20px 40px' }}>{statusCode}</div>
        <div style={{ padding: 40 }}>잠시후 다시 시도해주세요..</div>
      </div>
    </div>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res
    ? res.statusCode
    : err
      ? err.statusCode
      : 404
  return { statusCode }
}

export default Error

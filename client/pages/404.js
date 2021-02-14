import React from 'react'
import Head from 'next/head'

function Custom404() {
  return (
    <div>
      <Head>
        <title>깜짝이야! 에러가 생겼어요</title>
      </Head>
      <div style={{ height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ borderRight: '1px solid gray', padding: '20px 40px' }}>404</div>
        <div style={{ padding: 40 }}>요청하신 페이지를 찾을 수 없습니다.</div>
      </div>
    </div>
  )
}

export default Custom404

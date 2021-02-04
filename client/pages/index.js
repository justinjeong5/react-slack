import React from 'react'
import Menu from '../components/Menu'
import Main from '../components/Main'


function Home() {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ height: '100vh', width: '300px' }}><Menu /></div>
      <div style={{ height: '100vh', width: '100%' }}><Main /></div>
    </div>
  )
}

export default Home

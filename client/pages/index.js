import React from 'react'
import styled from 'styled-components'

import Menu from '../components/Menu'
import Main from '../components/Main'

const RootWrapper = styled.div`
  display: flex;
`

function Home() {
  return (
    <RootWrapper>
      <Menu />
      <Main />
    </RootWrapper>
  )
}

export default Home

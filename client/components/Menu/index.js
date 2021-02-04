import React from 'react'
import styled from 'styled-components'

import UserPanel from './UserPanel'
import Starred from './Starred'
import ChatRooms from './ChatRooms'
import DirectRooms from './DirectRooms'

const RootWrapper = styled.div`
  background-color: #415972;
  padding: 1em;
  min-height: 100vh;
  color: white;
  min-width: 300px;
`

const ComponentWrapper = styled.div`
  margin: 10px;
`

function Menu() {
  return (
    <RootWrapper>
      <ComponentWrapper>
        <UserPanel />
      </ComponentWrapper>
      <ComponentWrapper>
        <Starred />
      </ComponentWrapper>
      <ComponentWrapper>
        <ChatRooms />
      </ComponentWrapper>
      <ComponentWrapper>
        <DirectRooms />
      </ComponentWrapper>
    </RootWrapper>
  )
}

export default Menu

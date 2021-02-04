import React from 'react'
import styled from 'styled-components'

import RoomInfo from './RoomInfo'
import Messages from './Messages'
import Sender from './Sender'

const ComponentWrapper = styled.div`
  margin: 10px
`

function Main() {
  return (
    <div>
      <ComponentWrapper>
        <RoomInfo />
      </ComponentWrapper>
      <ComponentWrapper>
        <Messages />
      </ComponentWrapper>
      <ComponentWrapper>
        <Sender />
      </ComponentWrapper>
    </div>
  )
}

export default Main

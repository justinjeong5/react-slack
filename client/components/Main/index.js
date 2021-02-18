import React from 'react'

import RoomInfo from './RoomInfo'
import Messages from './Messages'
import Sender from './Sender'

function Main() {
  return (
    <div style={{ height: '100vh', marginTop: -10 }}>
      <div style={{ margin: '10px' }}>
        <RoomInfo />
      </div>
      <div style={{ margin: '10px' }}>
        <Messages />
      </div>
      <div style={{ margin: '10px' }}>
        <Sender />
      </div>
    </div>
  )
}

export default Main

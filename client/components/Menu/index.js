import React from 'react'

import UserPanel from './UserPanel'
import Starred from './Starred'
import ChatRooms from './ChatRooms'
import DirectRooms from './DirectRooms'

function Menu() {
  return (
    <div style={{
      backgroundColor: '#415972',
      padding: '1em',
      minHeight: '100vh',
      color: 'white',
      minWidth: '300px',
    }}>
      <div style={{ margin: '10px' }}>
        <UserPanel />
      </div>
      <div style={{ margin: '10px' }}>
        <Starred />
      </div>
      <div style={{ margin: '10px' }}>
        <ChatRooms />
      </div>
      <div style={{ margin: '10px' }}>
        <DirectRooms />
      </div>
    </div >
  )
}

export default Menu

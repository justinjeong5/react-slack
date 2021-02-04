import React from 'react'
import RegisterUser from './User/RegisterUser'
import LoginUser from './User/LoginUser'

function UserPanel() {

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      UserPanel
      <div style={{ display: 'flex' }}>
        <LoginUser />
        <RegisterUser />
      </div>
    </div>
  )
}

export default UserPanel

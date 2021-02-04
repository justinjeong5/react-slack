import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { message } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'
import { LOGOUT_USER_REQUEST } from '../../../reducers/types';

function LogoutUser() {

  const dispatch = useDispatch();
  const { logoutUserError } = useSelector(state => state.user)

  useEffect(() => {
    if (logoutUserError) {
      message.error(logoutUserError.message);
    }
  }, [logoutUserError])

  const handleLogout = useCallback(() => {
    dispatch({
      type: LOGOUT_USER_REQUEST
    })
  }, [])

  return (
    <div>
      <LogoutOutlined onClick={handleLogout} />
    </div>
  )
}

export default LogoutUser

import React, { useCallback, useState } from 'react'
import { Modal } from 'antd'
import { LoginOutlined } from '@ant-design/icons'

function LoginUser() {

  const [showModal, setShowModal] = useState(false)
  const handleModal = useCallback(() => {
    setShowModal(prev => !prev)
  }, [])

  const handleCancel = useCallback(() => {
    setShowModal(prev => !prev)
  }, [])

  return (
    <div>
      <LoginOutlined
        onClick={handleModal}
      />
      <Modal
        title='LoginUser'
        visible={showModal}
        onCancel={handleCancel}
        footer={[]}
      >
        <p>LoginUser</p>
      </Modal>
    </div>
  )
}

export default LoginUser

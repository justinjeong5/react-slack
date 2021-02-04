import React, { useCallback, useState } from 'react'
import { Modal } from 'antd'
import { UserAddOutlined } from '@ant-design/icons'

function RegisterUser() {

  const [showModal, setShowModal] = useState(false);

  const handleShow = useCallback(() => {
    setShowModal(prev => !prev)
  }, [])

  const handleCancel = useCallback(() => {
    setShowModal(prev => !prev)
  }, [])

  return (
    <div>
      <UserAddOutlined
        onClick={handleShow}
      />
      <Modal
        title='RegisterUser'
        visible={showModal}
        onCancel={handleCancel}
        footer={[]}
      >
        RegisterUser
      </Modal>
    </div>
  )
}

export default RegisterUser

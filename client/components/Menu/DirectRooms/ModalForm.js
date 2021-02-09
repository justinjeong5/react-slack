import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types'
import { Select, Modal, Button, Space } from 'antd'
import { FormOutlined, } from '@ant-design/icons'

import { ADD_DIRECT_REQUEST, LOAD_DIRECT_CANDIDATE_REQUEST } from '../../../reducers/types'

function ModalForm({ showModal, handleShow }) {

  const dispatch = useDispatch();
  const [newDirect, setNewDirect] = useState('')
  const { currentUser } = useSelector(state => state.user)
  const { directList, currentDirect, loadDirectCandidateDone, loadDirectCandiateLoading } = useSelector(state => state.direct)


  const handleChange = useCallback((value) => {
    setNewDirect(value);
  }, [])

  const handleSubmit = useCallback(() => {
    dispatch({
      type: ADD_DIRECT_REQUEST,
      data: { _id: newDirect }
    })
    handleShow();
  }, [newDirect])

  useEffect(() => {
    if (showModal && directList.length === 0)
      dispatch({
        type: LOAD_DIRECT_CANDIDATE_REQUEST
      })
  }, [showModal, directList])

  const renderList = useCallback(() => (
    directList
      .filter(v1 => v1._id !== currentUser._id)
      .filter(v2 => (currentDirect.findIndex(v3 => v3.writer._id === v2._id) === -1))
      .map(v4 => <Select.Option key={v4._id}>{v4.nickname}</Select.Option>)
  ), [directList, currentDirect])

  return (
    <Modal
      title={<span><FormOutlined /> Direct Message 시작하기</span>}
      visible={showModal}
      onCancel={handleShow}
      width={400}
      footer={[<Button onClick={handleShow} >취소</Button>,
      <Button type='primary' onClick={handleSubmit} >MD 시작하기</Button>]}
    >
      <Select
        allowClear
        style={{ width: '100%' }}
        placeholder="Direct Message를 시작하세요"
        defaultValue={[]}
        onChange={handleChange}
      >
        {renderList()}
      </Select>
    </Modal >
  )
}

ModalForm.propTypes = {
  showModal: PropTypes.bool.isRequired,
  handleShow: PropTypes.func.isRequired,
}

export default ModalForm

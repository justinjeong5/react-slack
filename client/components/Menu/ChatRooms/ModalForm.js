import React, { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types'
import { Form, Modal, Button, Space, Input } from 'antd'
import { FormOutlined, FileTextOutlined } from '@ant-design/icons'

import { CREATE_ROOM_REQUEST } from '../../../reducers/types'

function ModalForm({ showModal, handleShow }) {

  const dispatch = useDispatch();

  const onFinish = useCallback((values) => {
    dispatch({
      type: CREATE_ROOM_REQUEST,
      data: {
        title: values.title,
        description: values.description,
      }
    })
  }, []);

  const formTitleRules = useMemo(() => ([
    { required: true, message: '방 제목을 입력해주세요.' },
    { minLen: 3, message: '방 제목은 3글자 이상으로 입력해주세요.' }
  ]), [])
  const formDescriptionRules = useMemo(() => ([
    { required: true, message: '방 소개를 입력해주세요.' },
  ]), [])


  return (
    <Modal
      title={<span><FormOutlined /> 방 만들기</span>}
      visible={showModal}
      onCancel={handleShow}
      width={800}
      footer={[]}
    >
      <Form
        name="basic"
        onFinish={onFinish}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ width: '700px' }}
      >
        <Form.Item
          label="제목"
          name="title"
          rules={formTitleRules}
        >
          <Input prefix={<FormOutlined />} placeholder="제목" />
        </Form.Item>
        <Form.Item
          label="소개"
          name="description"
          rules={formDescriptionRules}
        >
          <Input prefix={<FileTextOutlined />} placeholder="소개" />
        </Form.Item>
        <Form.Item
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Space style={{ float: 'right' }}>
            <Button onClick={handleShow}>
              취소
          </Button>
            <Button type="primary" htmlType="submit" >
              방만들기
          </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}

ModalForm.propTypes = {
  showModal: PropTypes.bool.isRequired,
  handleShow: PropTypes.func.isRequired,
}

export default ModalForm

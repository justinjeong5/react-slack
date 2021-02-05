import React, { useCallback, useMemo } from 'react'
import { Form, Input, Button, Space } from 'antd'
import { useDispatch } from 'react-redux'

import Uploader from './Sender/Uploader'

function Sender() {

  const dispatch = useDispatch();

  const onFinish = useCallback((values) => {
    console.log(values)
  }, [])

  return (
    <div>
      <Form
        name="basic"
        onFinish={onFinish}
      >
        <Form.Item name="content">
          <Input.TextArea placeholder="메세지" />
        </Form.Item>
        <Form.Item>
          <Space style={{ float: 'right' }}>
            <Button type="primary" htmlType="submit" >
              전송
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Sender

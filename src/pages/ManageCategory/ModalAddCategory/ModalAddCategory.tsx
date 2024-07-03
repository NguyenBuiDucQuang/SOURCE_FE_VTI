import React from 'react'
import { Modal, Cascader, DatePicker, Form, Input, InputNumber, Mentions, Select, TreeSelect, Button } from 'antd'

interface ModalAddCategoryProps {
  isModalOpen: boolean
  handleOk: () => void
  handleCancel: () => void
}
const { RangePicker } = DatePicker

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 }
  }
}

export default function ModalAddCategory({ isModalOpen, handleOk, handleCancel }: ModalAddCategoryProps) {
  return (
    <Modal title='Add New Category' open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={1000}>
      <Form {...formItemLayout} variant='filled' style={{ width: '100%' }}>
        <Form.Item label='Name' name='Input' rules={[{ required: true, message: 'Please input!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label='Description' name='TextArea' rules={[{ required: true, message: 'Please input!' }]}>
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  )
}

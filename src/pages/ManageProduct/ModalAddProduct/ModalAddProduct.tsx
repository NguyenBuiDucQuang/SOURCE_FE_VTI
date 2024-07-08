import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Form, Input, Modal, Select } from 'antd'
import { toast } from 'react-toastify'
import productApi from 'src/apis/product.api'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { Product } from 'src/types/product.type'

interface ModalAddProductProps {
  isModalOpen: boolean
  handleOk: () => void
  handleCancel: () => void
}

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

export default function ModalAddProduct({ isModalOpen, handleOk, handleCancel }: ModalAddProductProps) {
  const [form] = Form.useForm()
  const queryConfig = useQueryConfig()
  const queryClient = useQueryClient()
  const addProductMutation = useMutation({
    mutationFn: (body: Product) => productApi.addProduct(body)
  })
  const onFinish = async (values: Product) => {
    const fixValue = {
      ...values,
      products: []
    }
    addProductMutation.mutate(fixValue as Product, {
      onSuccess: (data) => {
        toast.success('Sản phẩm được thêm mới thành công')
        handleOk()
        queryClient.invalidateQueries(['products', queryConfig])
      },
      onError: (error) => {
        toast.error('Thêm mới sản phẩm thất bại')
      }
    })
  }
  return (
    <Modal title='Thêm mới sản phẩm' visible={isModalOpen} onOk={form.submit} onCancel={handleCancel} width={1000}>
      <Form
        {...formItemLayout}
        form={form}
        onFinish={onFinish}
        initialValues={{ name: '', description: '' }}
        validateTrigger='onSubmit'
      >
        <Form.Item label='Tên sản phẩm' name='name' rules={[{ required: true, message: 'Name is require!!!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label='Giá tiền' name='price' rules={[{ required: true, message: 'Please input!' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label='Số sản phẩm'
          name='number_of_products'
          rules={[{ required: true, message: 'Name is require!!!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label='Nhãn hàng' name='category_id' rules={[{ required: true, message: 'Please input!' }]}>
          <Select
            options={[
              { value: '1', label: 'Nike' },
              { value: '2', label: 'ADIDAS' },
              { value: '3', label: 'FILA' }
            ]}
          />
        </Form.Item>
        <Form.Item label='Ảnh sản phẩm' name='thumbnailUrl' rules={[{ required: true, message: 'Please input!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label='Mô tả' name='description' rules={[{ required: true, message: 'Please input!' }]}>
          <Input.TextArea autoSize={{ minRows: 5, maxRows: 10 }} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

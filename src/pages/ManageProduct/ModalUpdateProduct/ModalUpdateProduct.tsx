import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DatePicker, Form, Input, Modal, Select } from 'antd'
// eslint-disable-next-line import/named
import { BaseOptionType } from 'antd/es/select'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import productApi from 'src/apis/product.api'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { Product } from 'src/types/product.type'

interface ModalAddProductProps {
  isModalOpen: boolean
  handleOk: () => void
  handleCancel: () => void
  detail?: Product
  categoriesData: BaseOptionType[]
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

export default function ModalUpdateProduct({
  isModalOpen,
  handleOk,
  handleCancel,
  detail,
  categoriesData
}: ModalAddProductProps) {
  const [form] = Form.useForm()
  const queryConfig = useQueryConfig()
  const queryClient = useQueryClient()
  const updateProductMutation = useMutation({
    mutationFn: (body: Product) => productApi.updateProduct(detail?.id as number, body)
  })
  const onFinish = async (values: Product) => {
    const fixValue = {
      ...values,
      id: detail?.id
    }
    updateProductMutation.mutate(fixValue as Product, {
      onSuccess: () => {
        toast.success('Cập nhật sản phẩm thành công')
        handleOk()
        queryClient.invalidateQueries(['products', queryConfig])
      },
      onError: () => {
        toast.error('Cập nhật sản phẩm thất bại')
      }
    })
  }

  useEffect(() => {
    console.log(categoriesData)

    if (detail) {
      form.setFieldsValue(detail)
    }
  }, [detail, form])

  return (
    <Modal title='Chỉnh sửa sản phẩm' visible={isModalOpen} onOk={form.submit} onCancel={handleCancel} width={1000}>
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
          <Select options={categoriesData} />
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

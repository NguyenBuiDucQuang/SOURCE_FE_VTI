import React, { useContext, useState } from 'react'
import { Button, Popconfirm, Select, Space, Table, message } from 'antd'
import classNames from 'classnames/bind'
import type { TableColumnsType, TableProps } from 'antd'
import Search from 'antd/es/input/Search'
import styles from './Cart.module.css'
import { EditOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import categoryApi from 'src/apis/category.api'
import { Category } from 'src/types/category.type'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { ParamsConfig } from 'src/types/product.type'
import { createSearchParams, useNavigate } from 'react-router-dom'
import path from 'src/constants/path'
import { toast } from 'react-toastify'
import { AppContext } from 'src/contexts/app.context'
import cartApi from 'src/apis/cart.api'
import { CartItemData } from 'src/types/cart.type'
import { formatCurrency } from 'src/utils/utils'
import value from 'src/constants/value'
const cx = classNames.bind(styles)

type TableRowSelection<T> = TableProps<T>['rowSelection']

interface DataType {
  key?: React.Key
  name?: string
  quantity?: number
  price?: number
}

export default function CategoryList() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const { setIsAuthenticated, isAuthenticated, setProfile, profile } = useContext(AppContext)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const queryConfig = useQueryConfig()
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalOpen2, setIsModalOpen2] = useState(false)
  const [detail, setDetail] = useState<Category>()
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')

  //////////////////////////////////////////////////////NAME COLUMN, CONFIG COLUMN///////////////////////////////////////////

  const columns: TableColumnsType<DataType> = [
    {
      title: 'ID',
      dataIndex: 'key',
      width: '10%'
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      width: '25%'
    },
    {
      title: 'Giá tiền',
      dataIndex: 'price',
      width: '25%',
      render: (_, action) => (
        <Space size='small' key={action.key}>
          <p> ₫{formatCurrency(action.price ?? 0)}</p>
        </Space>
      )
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      width: '20%'
    },
    {
      title: 'Tổng tiền',
      width: '20%',
      render: (_, action) => (
        <Space size='small' key={action.key}>
          <p> ₫{formatCurrency((action.price ?? 0) * (action.quantity ?? 0))}</p>
        </Space>
      )
    }
  ]
  //////////////////////////////////////////////////////////// PUSH DATA ///////////////////////////////////////////////////////
  const { data: cartsData } = useQuery({
    queryKey: ['carts', queryConfig],
    queryFn: () => {
      return cartApi.getCartByUserId({ size: value.MAX_INT })
    }
  })

  const data: DataType[] =
    cartsData?.data.content
      .filter((cart: CartItemData) => cart.user_id === profile?.id)
      .map((cart: CartItemData) => ({
        key: cart.id,
        name: cart.productname,
        quantity: cart.quantity,
        price: cart.price
      }))
      .reverse() || []

  console.log(data)

  //////////////////////////////////////////////////////////// PAGINATE ///////////////////////////////////////////////////////
  const pagination = {
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '20', '50', '100']
  }

  //////////////////////////////////////////////////////////// SEARCH AND FILTER ///////////////////////////////////////////////////////
  const handleChange = (value: string) => {
    navigate({
      pathname: path.category,
      search: createSearchParams({
        ...queryConfig,
        sort: `id,${value}`
      }).toString()
    })
  }

  const handleSearch = (value: string) => {
    console.log('Search input:', value)
    setSearchText(value)
    navigate({
      pathname: path.category,
      search: createSearchParams({
        ...queryConfig,
        search: value
      }).toString()
    })
  }

  return (
    <div className='container'>
      <h1 className='my-4 text-2xl'>Danh sách đơn hàng của bạn</h1>
      {/* <Search
        placeholder='input search text'
        allowClear
        enterButton='Search'
        size='large'
        className={cx('group__search')}
        onSearch={handleSearch}
      />
      <div className={cx('group__select', 'mt-4 mb-4 flex items-center justify-between gap-4')}>
        <Select
          placeholder='--Sắp xếp theo ngày--'
          onChange={handleChange}
          size='large'
          options={[
            { value: 'asc', label: 'Sắp xếp mới nhất' },
            { value: 'desc', label: 'Sắp xếp cũ nhất' }
          ]}
          className='w-1/2'
        />
      </div> */}
      <Table columns={columns} dataSource={data} pagination={pagination} />
    </div>
  )
}

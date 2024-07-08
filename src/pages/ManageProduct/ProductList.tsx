import React, { useState } from 'react'
import { Button, Image, Popconfirm, Select, Space, Table } from 'antd'
import classNames from 'classnames/bind'
import type { TableColumnsType, TableProps } from 'antd'
import Search from 'antd/es/input/Search'
import styles from './ProductList.module.css'
import { EditOutlined } from '@ant-design/icons'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import productApi from 'src/apis/product.api'
import { Product, ProductListConfig } from 'src/types/product.type'
import { createSearchParams, useNavigate } from 'react-router-dom'
import path from 'src/constants/path'
import { toast } from 'react-toastify'
import ModalAddProduct from './ModalAddProduct'
import ModalUpdateProduct from './ModalUpdateProduct'
const cx = classNames.bind(styles)

type TableRowSelection<T> = TableProps<T>['rowSelection']

interface DataType {
  key: React.Key
  thumbnailURL: string
  name: string
  category_name: string
  price: number
  description: string
}

export default function ProductList() {
  const queryConfig = useQueryConfig()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalOpen2, setIsModalOpen2] = useState(false)
  const [detail, setDetail] = useState<Product>()
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  //////////////////////////////////////////////////////NAME COLUMN, CONFIG COLUMN///////////////////////////////////////////
  const columns: TableColumnsType<DataType> = [
    {
      title: 'ID',
      dataIndex: 'key',
      width: '10%'
    },
    {
      title: 'Ảnh sản phẩm',
      dataIndex: 'thumbnailUrl',
      width: '15%',
      render: (url) => (
        // action.thumbnail?.filename ? (
        <img
          // key={action.key}
          width={100}
          height={100}
          style={{ objectFit: 'cover' }}
          src={url}
          alt=''
        />
      )
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      width: '30%'
    },
    {
      title: 'Nhãn hàng',
      dataIndex: 'category_name',
      width: '30%'
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      width: '30%'
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      render: (_, action) => (
        <Space size='small' key={action.key}>
          <Button type='text' onClick={() => handleModalOpen2(action.key as number)}>
            <EditOutlined style={{ fontSize: '16px', color: '#4f80af' }} />
          </Button>
        </Space>
      )
    }
  ]

  // const data: DataType[] = []
  // for (let i = 0; i < 460; i++) {
  //   data.push({
  //     key: i,
  //     image: 'https://www.vietnamfineart.com.vn/wp-content/uploads/2023/07/anh-gai-xinh-cuc-dep-4.jpg',
  //     name: `Edward King ${i}`,
  //     category: `Category. ${i}`
  //   })
  // }

  /////////////////////////////////////////////////////////CHECKBOX INDEX////////////////////////////////////////////
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys)
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const handleChange = (value: string) => {
    console.log(`selected ${value}`)
  }

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: 'odd',
        text: 'Select Odd Row',
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = []
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false
            }
            return true
          })
          setSelectedRowKeys(newSelectedRowKeys)
        }
      },
      {
        key: 'even',
        text: 'Select Even Row',
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = []
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true
            }
            return false
          })
          setSelectedRowKeys(newSelectedRowKeys)
        }
      }
    ]
  }

  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    }
  })

  const data: DataType[] =
    //  @ts-ignore
    productsData?.data.content.map((product: Product) => ({
      key: product.id,
      name: product.name,
      thumbnailUrl: product.thumbnailUrl,
      category_name: product.category_name,
      price: product.price,
      description: product.description
    })) || []

  //////////////////////////////////////////////////////////// PAGINATE ///////////////////////////////////////////////////////
  const pagination = {
    current: currentPage,
    pageSize: pageSize,
    total: productsData?.data.totalElements || 0,
    onChange: (page: number, pageSize?: number) => {
      setCurrentPage(page)
      if (pageSize) {
        setPageSize(pageSize)
      }
      navigate(`${path.product}?page=${page}&size=${pageSize}`)
    },
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100']
  }

  //////////////////////////////////////////////////////////// SEARCH AND FILTER ///////////////////////////////////////////////////////
  const handleChangehandleChange = (value: string) => {
    navigate({
      pathname: path.product,
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
      pathname: path.product,
      search: createSearchParams({
        ...queryConfig,
        search: value
      }).toString()
    })
  }

  //////////////////////////////////////////////////////////// DELETE ///////////////////////////////////////////////////////
  const deleteCategoriesMutation = useMutation({
    mutationFn: (params: string) => productApi.deleteProducts(params),
    onSuccess: () => {
      toast.success('Xóa thành công')
      queryClient.invalidateQueries(['products', queryConfig])
      setSelectedRowKeys([])
    },
    onError: () => {
      toast.error('Xóa thất bại')
    }
  })

  const handleDelete = () => {
    const params = selectedRowKeys.join(',')
    deleteCategoriesMutation.mutate(params)
  }
  //////////////////////////////////////////////POPUP ADD/////////////////////////////////////
  const handleModalOpen = () => {
    setIsModalOpen(true)
  }

  const handleModalOk = () => {
    setIsModalOpen(false)
  }

  const handleModalCancel = () => {
    setIsModalOpen(false)
  }
  //////////////////////////////////////////////POPUP UPDATE/////////////////////////////////////
  const handleModalOpen2 = async (id: number) => {
    const data = await queryClient.fetchQuery(['productDetail', id], () => productApi.detailProduct(id))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setDetail(data.data as any)
    setIsModalOpen2(true)
  }

  const handleModalOk2 = () => {
    setIsModalOpen2(false)
  }

  const handleModalCancel2 = () => {
    setIsModalOpen2(false)
  }

  return (
    <>
      <Search
        placeholder='input search text'
        allowClear
        enterButton='Search'
        size='large'
        className={cx('group__search')}
        onSearch={handleSearch}
      />
      <div className={cx('group__select', 'mt-4 mb-4 flex items-center justify-between gap-4')}>
        {/* <Select
          placeholder='--Danh mục--'
          onChange={handleChangehandleChange}
          size='large'
          options={[
            { value: 'category_name: Nike', label: 'NIKE' },
            { value: 'category_name: ADIDAS', label: 'ADIDAS' },
            { value: 'category_name: FILA', label: 'FILA' }
          ]}
          className='w-1/2'
        /> */}
        <Select
          placeholder='--Sắp xếp theo ngày--'
          onChange={handleChangehandleChange}
          size='large'
          options={[
            { value: 'asc', label: 'Sắp xếp mới nhất' },
            { value: 'desc', label: 'Sắp xếp cũ nhất' }
          ]}
          className='w-1/2'
        />
        <Space>
          <Popconfirm
            title='Xóa danh mục'
            description='Bạn có muốn xóa sản phẩm này không?'
            okText='Yes'
            cancelText='No'
            onConfirm={handleDelete}
          >
            <Button size='large' danger className='w-32'>
              Xóa
            </Button>
          </Popconfirm>
          <Button size='large' className='w-32' onClick={handleModalOpen}>
            Thêm mới
          </Button>
        </Space>
      </div>
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} pagination={pagination} />
      <ModalAddProduct isModalOpen={isModalOpen} handleOk={handleModalOk} handleCancel={handleModalCancel} />
      <ModalUpdateProduct
        isModalOpen={isModalOpen2}
        handleOk={handleModalOk2}
        handleCancel={handleModalCancel2}
        detail={detail}
      />
    </>
  )
}
function handleModalOpen2(arg0: number): void {
  throw new Error('Function not implemented.')
}

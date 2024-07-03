import React, { useState } from 'react'
import { Button, Popconfirm, Select, Space, Table, message } from 'antd'
import classNames from 'classnames/bind'
import type { TableColumnsType, TableProps } from 'antd'
import Search from 'antd/es/input/Search'
import styles from './CategoryList.module.css'
import { EditOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import categoryApi from 'src/apis/category.api'
import { Category } from 'src/types/category.type'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { ProductListConfig } from 'src/types/product.type'
import { createSearchParams, useNavigate } from 'react-router-dom'
import path from 'src/constants/path'
import { toast } from 'react-toastify'
import ModalAddCategory from './ModalAddCategory'
const cx = classNames.bind(styles)

type TableRowSelection<T> = TableProps<T>['rowSelection']

interface DataType {
  key: React.Key
  name: string
  description: string
}

//////////////////////////////////////////////////////NAME COLUMN, CONFIG COLUMN///////////////////////////////////////////
const columns: TableColumnsType<DataType> = [
  {
    title: 'ID',
    dataIndex: 'key',
    width: '10%'
  },
  {
    title: 'Name',
    dataIndex: 'name',
    width: '25%'
  },
  {
    title: 'Description',
    dataIndex: 'description',
    width: '50%'
  },
  {
    title: 'Action',
    key: 'action',
    fixed: 'right',
    render: (_, action) => (
      <Space size='small' key={action.key}>
        <Button type='text'>
          <EditOutlined style={{ fontSize: '16px', color: '#4f80af' }} />
        </Button>
      </Space>
    )
  }
]

export default function CategoryList() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const queryConfig = useQueryConfig()
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')

  /////////////////////////////////////////////////////////CHECKBOX INDEX////////////////////////////////////////////
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys)
    setSelectedRowKeys(newSelectedRowKeys)
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

  //////////////////////////////////////////////////////////// PUSH DATA ///////////////////////////////////////////////////////
  const { data: categoriesData } = useQuery({
    queryKey: ['categories', queryConfig],
    queryFn: () => {
      return categoryApi.getCategories(queryConfig as ProductListConfig)
    }
  })

  const data: DataType[] =
    categoriesData?.data.content.map((category: Category) => ({
      key: category.id,
      name: category.name,
      description: category.description
    })) || []

  //////////////////////////////////////////////////////////// PAGINATE ///////////////////////////////////////////////////////
  const pagination = {
    current: currentPage,
    pageSize: pageSize,
    total: categoriesData?.data.totalElements || 0,
    onChange: (page: number, pageSize?: number) => {
      setCurrentPage(page)
      if (pageSize) {
        setPageSize(pageSize)
      }
      navigate(`${path.category}?page=${page}&size=${pageSize}`)
    },
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100']
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

  //////////////////////////////////////////////////////////// DELETE ///////////////////////////////////////////////////////
  const deleteCategoriesMutation = useMutation({
    mutationFn: (params: string) => categoryApi.deleteCategories(params),
    onSuccess: () => {
      toast.success('Deleted successfully')
      queryClient.invalidateQueries(['categories', queryConfig])
      setSelectedRowKeys([])
    },
    onError: () => {
      toast.error('Failed to delete')
    }
  })

  const handleDelete = () => {
    const params = selectedRowKeys.join(',')
    deleteCategoriesMutation.mutate(params)
  }

  const handleModalOpen = () => {
    setIsModalOpen(true)
  }

  const handleModalOk = () => {
    setIsModalOpen(false)
  }

  const handleModalCancel = () => {
    setIsModalOpen(false)
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
        <Space>
          <Popconfirm
            title='Xóa danh mục'
            description='Bạn có muốn xóa các danh mục này?'
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
      <ModalAddCategory isModalOpen={isModalOpen} handleOk={handleModalOk} handleCancel={handleModalCancel} />
    </>
  )
}

import React, { useState } from 'react'
import { Button, Image, Popconfirm, Select, Space, Table } from 'antd'
import classNames from 'classnames/bind'
import type { TableColumnsType, TableProps } from 'antd'
import Search from 'antd/es/input/Search'
import styles from './ProductList.module.css'
import { EditOutlined } from '@ant-design/icons'
const cx = classNames.bind(styles)

type TableRowSelection<T> = TableProps<T>['rowSelection']

interface DataType {
  key: React.Key
  image: string
  name: string
  category: string
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'ID',
    dataIndex: 'key',
    width: '10%'
  },
  {
    title: 'Image',
    dataIndex: 'image',
    width: '15%',
    render: (_, action) => (
      // action.thumbnail?.filename ? (
      <Image key={action.key} width={100} height={100} style={{ objectFit: 'cover' }} src={`${action.image}`} />
    )
  },
  {
    title: 'Name',
    dataIndex: 'name',
    width: '30%'
  },
  {
    title: 'Category',
    dataIndex: 'category',
    width: '30%'
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

const data: DataType[] = []
for (let i = 0; i < 460; i++) {
  data.push({
    key: i,
    image: 'https://www.vietnamfineart.com.vn/wp-content/uploads/2023/07/anh-gai-xinh-cuc-dep-4.jpg',
    name: `Edward King ${i}`,
    category: `Category. ${i}`
  })
}

export default function ProductList() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

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

  return (
    <>
      <Search
        placeholder='input search text'
        allowClear
        enterButton='Search'
        size='large'
        className={cx('group__search')}
      />
      <div className={cx('group__select', 'mt-4 mb-4 flex items-center justify-between gap-4')}>
        <Select
          placeholder='--Danh mục--'
          onChange={handleChange}
          size='large'
          options={[
            { value: 'jack', label: 'Jack' },
            { value: 'lucy', label: 'Lucy' },
            { value: 'Yiminghe', label: 'yiminghe' }
          ]}
          className='w-1/2'
        />
        <Select
          placeholder='--Sắp xếp theo ngày--'
          onChange={handleChange}
          size='large'
          options={[
            { value: 'jack', label: 'Jack' },
            { value: 'lucy', label: 'Lucy' },
            { value: 'Yiminghe', label: 'yiminghe' }
          ]}
          className='w-1/2'
        />
        <Space>
          <Popconfirm title='Xóa danh mục' description='Bạn có muốn xóa các danh mục này?' okText='Yes' cancelText='No'>
            <Button size='large' danger className='w-32'>
              Xóa
            </Button>
          </Popconfirm>
          <Button size='large' className='w-32'>
            Thêm mới
          </Button>
        </Space>
      </div>
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
    </>
  )
}

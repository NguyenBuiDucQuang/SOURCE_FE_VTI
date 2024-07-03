import React, { ReactNode, useState } from 'react'
import { UserOutlined, ProductOutlined, AppstoreOutlined, SolutionOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Breadcrumb, Layout, Menu, theme } from 'antd'
import { NavLink } from 'react-router-dom'
import path from 'src/constants/path'
import styles from './Slider.module.css'
import './Slider.css'
import classNames from 'classnames/bind'
const cx = classNames.bind(styles)

const { Content, Footer, Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  onClick?: () => void
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    onClick
  } as MenuItem
}

export default function Slider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [breadcrumbText, setBreadcrumbText] = useState('Quản lý tài khoản')
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()

  const items: MenuItem[] = [
    getItem(<NavLink to={path.account}>Quản lý tài khoản</NavLink>, '1', <UserOutlined />, undefined, () =>
      setBreadcrumbText('Quản lý tài khoản')
    ),
    getItem(<NavLink to={path.product}>Quản lý sản phẩm</NavLink>, '2', <ProductOutlined />, undefined, () =>
      setBreadcrumbText('Quản lý sản phẩm')
    ),
    getItem(<NavLink to={path.category}>Quản lý danh mục</NavLink>, '3', <AppstoreOutlined />, undefined, () =>
      setBreadcrumbText('Quản lý danh mục')
    ),
    getItem(<NavLink to={path.category}>Quản lý đơn hàng</NavLink>, '4', <SolutionOutlined />, undefined, () =>
      setBreadcrumbText('Quản lý đơn hàng')
    )
  ]

  return (
    <Layout className='h-screen w-full'>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} className={cx('menu')}>
        <div className='demo-logo-vertical' />
        <Menu defaultSelectedKeys={['1']} mode='inline' items={items} />
      </Sider>
      <Layout className='overflow-x-auto'>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }} className='text-2xl'>
            <Breadcrumb.Item>Admin</Breadcrumb.Item>
            <Breadcrumb.Item>{breadcrumbText}</Breadcrumb.Item>
          </Breadcrumb>
          {children}
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©{new Date().getFullYear()} Created by Ant UED</Footer>
      </Layout>
    </Layout>
  )
}

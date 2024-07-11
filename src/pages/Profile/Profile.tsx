import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Form, Image, Upload } from 'antd'
import React, { useEffect, useState } from 'react'
import authApi from 'src/apis/auth.api'
import { User } from 'src/types/user.type'
import { UploadOutlined } from '@ant-design/icons'
import fileApi from 'src/apis/file.api'
import { toast } from 'react-toastify'
import { useLocation } from 'react-router-dom'

export default function Profile() {
  const [profileData, setDataProfileData] = useState<User>()
  const queryClient = useQueryClient()
  const location = useLocation()
  const { data: profileDataApi } = useQuery({
    queryKey: ['profile'],
    queryFn: () => {
      return authApi.getProfile()
    }
  })
  useEffect(() => {
    if (profileDataApi) {
      setDataProfileData(profileDataApi.data)
    }
  }, [profileDataApi])

  const [file, setFile] = useState()
  ////////////////////////////////////////////////// image //////////////////////////////////////////////
  // Cập nhật hàm normFile
  const normFile = (e: any) => {
    console.log('Upload event:', e)
    if (Array.isArray(e)) {
      return e
    }
    const fileList = e && e.fileList
    if (fileList && fileList.length > 0) {
      setFile(fileList[0].originFileObj)
      return fileList
    }
    setFile(null || undefined)
    return []
  }
  const chooseImageMutation = useMutation({
    mutationFn: (body) => fileApi.uploadFile(body as any)
  })
  ////////////////////////////////////////////////// update ///////////////////////////////////////////
  const updateProfileMutation = useMutation({
    mutationFn: (body: User) => authApi.updateProfile(body)
  })
  // Cập nhật hàm onFinish
  const onFinish = async (values: User) => {
    const config = {
      image: file
    }
    try {
      const uploadedImage = await chooseImageMutation.mutateAsync(config as any)
      console.log(uploadedImage.data)
      const fixData = {
        ...values,
        avatarUrl: uploadedImage.data
      }

      await updateProfileMutation.mutateAsync(fixData)
      queryClient.invalidateQueries(['profile'])
      toast.success('Cập nhật avatar thành công')
    } catch (error) {
      toast.error('Cập nhật avatar thất bại')
    }
  }

  const handleCustomRequest = (options: any) => {
    setFile(options.file)
    options.onSuccess(null, options.file)
  }
  return (
    <div className={location.pathname === '/profile' ? '' : 'container'}>
      <h2 className='mb-8 text-3xl'>Thông tin người dùng</h2>
      <Form onFinish={onFinish} validateTrigger='onSubmit' className='w-1/2'>
        <Form.Item
          name='upload'
          label='Chọn ảnh sản phẩm'
          valuePropName='fileList'
          getValueFromEvent={normFile}
          extra={!file ? 'Vui lòng chọn ảnh cài avatar' : 'Đã chọn ảnh '}
        >
          <Upload name='logo' listType='picture' customRequest={handleCustomRequest}>
            {!file && <Button icon={<UploadOutlined />}>Chọn ảnh để cập nhật avatar</Button>}
          </Upload>
        </Form.Item>
        <Button htmlType='submit' className='mb-4'>
          Thay đổi ảnh
        </Button>
      </Form>
      {profileData?.avatarUrl !== '' ? (
        <Image
          width={200}
          height={200}
          className='mx-auto block object-cover'
          wrapperClassName='mx-auto'
          src={`/src/assets/${profileData?.avatarUrl}`}
        />
      ) : (
        <Image
          width={200}
          height={200}
          className='mx-auto block object-cover'
          wrapperClassName='mx-auto'
          src={`https://static-00.iconduck.com/assets.00/profile-user-icon-2048x2048-m41rxkoe.png`}
        />
      )}

      <div className='flex items-center gap-8'>
        <div className=''>
          <p className='my-4 text-xl'>Tài khoản: </p>
          <p className='my-4 text-xl'>Email: </p>
          <p className='my-4 text-xl'>Họ: </p>
          <p className='my-4 text-xl'>Tên: </p>
          <p className='my-4 text-xl'>Vai trò: </p>
        </div>
        <div>
          <p className='my-4 text-xl'>{profileData?.userName}</p>
          <p className='my-4 text-xl'> {profileData?.email}</p>
          <p className='my-4 text-xl'> {profileData?.firstName}</p>
          <p className='my-4 text-xl'> {profileData?.lastName}</p>
          <p className='my-4 text-xl'>{profileData?.role}</p>
        </div>
      </div>
    </div>
  )
}

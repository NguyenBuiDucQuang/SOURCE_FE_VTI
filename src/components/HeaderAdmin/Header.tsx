import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import path from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import Popover from '../Popover'
import { purchasesStatus } from 'src/constants/purchase'
import purchaseApi from 'src/apis/purchase.api'
import noproduct from 'src/assets/images/no-product.png'
import { formatCurrency, getAvatarUrl } from 'src/utils/utils'
import icon from '../../assets/images/header/academy-02-01-01-01.png'
import useSearchProducts from 'src/hooks/useSearchProducts'
import authApi from 'src/apis/auth.api'
import { useTranslation } from 'react-i18next'
import { locales } from 'src/i18n/i18n'
import { clearLS } from 'src/utils/auth'

export default function Header() {
  const { setIsAuthenticated, isAuthenticated, profile, setProfile } = useContext(AppContext)
  const { onSubmitSearch, register } = useSearchProducts()

  const { i18n } = useTranslation()
  const currentLanguage = locales[i18n.language as keyof typeof locales]

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const handleLogout = () => {
    setIsAuthenticated(false)
    clearLS()
    navigate(path.login)
  }

  const changeLanguage = (lng: 'en' | 'vi') => {
    i18n.changeLanguage(lng)
  }

  return (
    <div className=' px-5 pb-5 pt-2 font-semibold text-white'>
      <div className='mt-4 flex items-center justify-between'>
        <Link to='/' className='w-48'>
          <img src={icon} alt='icon' className='w-full' />
        </Link>
        <div className=''>
          <div className='flex gap-2'>
            <Popover
              className='flex cursor-pointer items-center py-1 hover:text-primaryColor'
              renderPopover={
                <div className='relative rounded-sm border border-gray-200 bg-white shadow-md'>
                  <div className='flex flex-col py-2 pr-28 pl-3'>
                    <button
                      className='py-2 px-3 text-left hover:text-primaryColor'
                      onClick={() => changeLanguage('vi')}
                    >
                      Tiếng Việt
                    </button>
                    <button
                      className='mt-2 py-2 px-3 text-left hover:text-primaryColor'
                      onClick={() => changeLanguage('en')}
                    >
                      English
                    </button>
                  </div>
                </div>
              }
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='h-5 w-5'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418'
                />
              </svg>
              <span className='mx-1'>{currentLanguage}</span>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='h-5 w-5'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
              </svg>
            </Popover>
            {isAuthenticated && (
              <Popover
                className=' flex cursor-pointer items-center py-1 hover:text-primaryColor'
                renderPopover={
                  <div className='relative rounded-sm border border-gray-200 bg-white shadow-md'>
                    <Link
                      to={path.profile}
                      className='block w-full bg-white py-3 px-4 text-left hover:bg-slate-100 hover:text-cyan-500'
                    >
                      Tài khoản của tôi
                    </Link>
                    <button
                      onClick={handleLogout}
                      className='block w-full bg-white py-3 px-4 text-left hover:bg-slate-100 hover:text-cyan-500'
                    >
                      Đăng xuất
                    </button>
                  </div>
                }
              >
                <div>{profile?.userName}</div>
              </Popover>
            )}
            {!isAuthenticated && (
              <div className='flex items-center'>
                <Link to={path.register} className='mx-3 capitalize hover:text-primaryColor'>
                  Đăng ký
                </Link>
                <div className='h-4 border-r-[1px] border-r-white/40' />
                <Link to={path.login} className='mx-3 capitalize hover:text-primaryColor'>
                  Đăng nhập
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
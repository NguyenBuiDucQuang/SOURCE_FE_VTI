const path = {
  home: '/',
  user: '/user',
  profile: '/user/profile',
  changePassword: '/user/password',
  historyPurchase: '/user/purchase',
  login: '/login',
  register: '/register',
  forget: '/forget',
  logout: '/logout',
  productDetail: ':nameId',
  cart: '/cart',
  category: '/category',
  product: '/product',
  account: '/account',
  active: '/active',
  reset: '/auth/new-password'
} as const

export default path

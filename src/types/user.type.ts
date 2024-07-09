type Role = 'Customer' | 'Admin'

export interface User {
  role?: Role[]
  email?: string
  userName?: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  password?: string
  avatarUrl?: string
}

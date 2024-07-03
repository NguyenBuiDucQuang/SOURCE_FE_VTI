import { AuthResponse } from 'src/types/auth.type'
import { User } from 'src/types/user.type'
import http from 'src/utils/http'

export const URL_LOGIN = 'login'
export const URL_REGISTER = 'users'
export const URL_FORGET = 'users/resetPasswordRequest'
export const URL_LOGOUT = 'logout'
export const URL_EMAIL_EXIST = 'users/email'
export const URL_USERNAME_EXIST = 'users/userName'
export const URL_ACTIVE_AUTOMATIC = 'users/activeUser'
export const URL_RESET_PASSWORD = 'users/resetPassword'

const authApi = {
  registerAccount(body: User) {
    return http.post<AuthResponse>(URL_REGISTER, body)
  },
  login({ username, password }: { username: string; password: string }) {
    return http.get<AuthResponse>(`${URL_LOGIN}?username=${username}&password=${password}`)
  },
  forget(email: string) {
    return http.get<AuthResponse>(`${URL_FORGET}?email=${email}`)
  },
  checkEmailExist(email: string) {
    return http.get<AuthResponse>(`${URL_EMAIL_EXIST}/${email}`)
  },
  checkUserNameExist(userName: string) {
    return http.get<AuthResponse>(`${URL_USERNAME_EXIST}/${userName}`)
  },
  activeAutomatically(token: string) {
    return http.get<AuthResponse>(`${URL_ACTIVE_AUTOMATIC}?token=${token}`)
  },
  resetPassword({ token, newPassword }: { token: string; newPassword: string }) {
    return http.get<AuthResponse>(`${URL_RESET_PASSWORD}?token=${token}&newPassword=${newPassword}`)
  },
  logout() {
    return http.post(URL_LOGOUT)
  }
}

export default authApi

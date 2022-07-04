import request from '@/utils/request.js'

export const sendCode = (params) => {
  return request({
    url: '/captcha/sent',
    method: 'GET',
    params
  })
} 

export const verifyCode = (params) => {
  return request({
    url: '/captcha/verify',
    method: 'GET',
    params
  })
}

export const registerUser = (params) => {
  return request({
    url: '/register/cellphone',
    method: 'GET',
    params
  })
}

export const loginUser = (params) => {
  return request({
    url: '/login/cellphone',
    method: 'GET',
    params
  })
}
export const logoutUser = () => {
  return request({
    url: '/logout',
    method: 'GET'
  })
}

export const getUserInfo = (params) => {
  return request({
    url: '/user/detail',
    method: 'GET',
    params
  })
}
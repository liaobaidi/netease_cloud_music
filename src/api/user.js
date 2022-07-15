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

export const followUser = (params) => {
  return request({
    url: '/follow',
    method: 'GET',
    params
  })
} 

export const getLoginStatus = () => {
  return request({
    url: '/login/status',
    method: 'GET'
  })
}

export const getUserPlaylist = (params) => {
  return request({
    url: '/user/playlist',
    method: 'GET',
    params
  })
}

export const getFollows = (params) => {
  return request({
    url: '/user/follows',
    method: 'GET',
    params
  })
}

export const getFolloweds = (params) => {
  return request({
    url: '/user/followeds',
    method: 'GET',
    params
  })
}

export const getLevelInfo = () => {
  return request({
    url: '/user/level',
    method: 'GET'
  })
}
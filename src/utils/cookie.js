import Cookie from 'js-cookie'

export const setToken = (token) => {
  let secure = false
  if(window.location.protocol === 'https') {
    secure = true
  }
  return Cookie.set('token', token, { secure })
}

export const getToken = () => {
  return Cookie.get('token')
}

export const removeToken = () => {
  return Cookie.remove('token')
}
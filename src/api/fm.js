import request from '@/utils/request.js'

export const getRecommendFM = () => {
  return request({
    url: `/personalized/djprogram`,
    method: 'GET'
  })
}

export const getFMInfo = (params) => {
  return request({
    url: '/dj/detail',
    method: 'GET',
    params
  })
}
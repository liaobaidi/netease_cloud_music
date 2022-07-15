import request from '@/utils/request.js'

export const getSearchDefault = () => {
  return request({
    url: '/search/default',
    method: 'GET'
  })
}

export const getHotSearchList = () => {
  return request({
    url: '/search/hot',
    method: 'GET'
  })
}

export const getHotSearchListDetail = () => {
  return request({
    url: '/search/hot/detail',
    method: 'GET'
  })
}

export const getTopicList = (params) => {
  return request({
    url: '/hot/topic',
    method: 'GET',
    params
  })
}

export const search = (params) => {
  return request({
    url: '/cloudsearch',
    method: 'GET',
    params
  })
}
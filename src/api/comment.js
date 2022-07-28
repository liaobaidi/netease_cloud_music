import request from '@/utils/request.js'

export const likeComment = (params) => {
  return request({
    url: '/comment/like',
    method: 'GET',
    params
  })
}

export const getComments = (params) => {
  return request({
    url: '/comment/playlist',
    method: 'GET',
    params
  })
}

export const getAlbumComments = (params) => {
  return request({
    url: '/comment/album',
    method: 'GET',
    params
  })
}
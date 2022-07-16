import request from '@/utils/request.js'

export const check = (params) => {
  return request({
    url: '/check/music',
    method: 'GET',
    params
  })
}

export const getMusicDetail = (params) => {
  return request({
    url: '/song/detail',
    method: 'GET',
    params
  })
}

export const getLyric = (params) => {
  return request({
    url: '/lyric',
    method: 'GET',
    params
  })
}

export const getMusicUrl = (params) => {
  return request({
    url: '/song/url',
    method: 'GET',
    params
  })
}

export const likeMusic = (params) => {
  return request({
    url: '/like',
    method: 'GET',
    params
  })
}

export const getLikeList = (params) => {
  return request({
    url: '/likelist',
    method: 'GET',
    params
  })
}

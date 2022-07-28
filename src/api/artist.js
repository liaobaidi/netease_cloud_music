import request from '@/utils/request.js'

export const getArtistInfo = (params) => {
  return request({
    url: '/artist/detail',
    method: 'GET',
    params
  })
}

export const getArtistDec = (params) => {
  return request({
    url: '/artist/desc',
    method: 'GET',
    params
  })
}

export const getFollowCount = (params) => {
  return request({
    url: '/artist/follow/count',
    method: 'GET',
    params
  })
}

export const followArtist = (params) => {
  return request({
    url: '/artist/sub',
    method: 'GET',
    params
  })
}

export const getTopSong = (params) => {
  return request({
    url: '/artist/top/song',
    method: 'GET',
    params
  })
}

export const getArtistFolloweds = (params) => {
  return request({
    url: '/artist/fans',
    method: 'GET',
    params
  })
}
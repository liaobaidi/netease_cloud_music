import request from '@/utils/request.js'
import qs from 'qs'
export const getRecommendList = (params) => {
  return request({
    url: '/personalized',
    method: 'GET',
    params
  })
}

export const getSpecialListTags = () => {
  return request({
    url: '/playlist/highquality/tags',
    method: 'GET'
  })
}

export const getSpecialList = (params) => {
  return request({
    url: '/top/playlist/highquality',
    method: 'GET',
    params
  })
}

export const getAlbumList = (params) => {
  return request({
    url: '/album/list',
    method: 'GET',
    params
  })
}

export const getTopLists = () => {
  return request({
    url: '/toplist',
    method: 'GET'
  })
}

export const getPlayListDetail = (params) => {
  return request({
    url: '/playlist/detail',
    method: 'GET',
    params
  })
}

export const getPlayListAll = (params) => {
  return request({
    url: '/playlist/track/all',
    method: 'GET',
    params
  })
}

export const getPlayListDynamic = (params) => {
  return request({
    url: '/playlist/detail/dynamic',
    method: 'GET',
    params
  })
}

export const triggleLike = (params) => {
  return request({
    url: '/playlist/subscribe',
    method: 'POST',
    data: qs.stringify(params)
  })
}

export const deletePlaylist = (params) => {
  return request({
    url: '/playlist/delete',
    method: 'GET',
    params
  })
}

export const getAlbums = (params) => {
  return request({
    url: '/album',
    method: 'GET',
    params
  })
}

export const getAlbumDetail = (params) => {
  return request({
    url: '/album/detail/dynamic',
    method: 'GET',
    params
  })
}

export const subAlbum = (params) => {
  return request({
    url: '/album/sub',
    method: 'GET',
    params
  })
}

export const getRecommedSong = () => {
  return request({
    url: '/recommend/songs',
    method: 'GET'
  })
}

export const getSongSquare = (params) => {
  return request({
    url: '/top/playlist',
    method: 'GET',
    params
  })
}

export const getPlayListCats = () => {
  return request({
    url: '/playlist/catlist',
    method: 'GET'
  })
}

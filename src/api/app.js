import request from '@/utils/request.js'

export const getFindData = (refresh = false) => {
  return request({
    url: '/homepage/block/page',
    method: 'GET',
    params: {
      refresh
    }
  })
}

export const getBanners = () => {
  return request({
    url: '/banner',
    method: 'GET',
    params: {
      type: 1
    }
  })
}

export const getBallList = () => {
  return request({
    url: '/homepage/dragon/ball',
    method: 'GET'
  })
}
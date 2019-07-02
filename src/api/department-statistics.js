import request from '@/utils/request'

export function getClassification(data) {
  return request({
    url: '/statistics/getFeeName',
    method: 'post',
    data
  })
}

export function getTotal(data) {
  return request({
    url: '/statistics/getTotal',
    method: 'post',
    data
  })
}

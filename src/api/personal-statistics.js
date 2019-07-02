import request from '@/utils/request'

export function getClassification(data) {
  return request({
    url: '/statistics/statisticsByUser',
    method: 'post',
    data
  })
}

export function getTotal(data) {
  return request({
    url: '/statistics/getTotalUser',
    method: 'post',
    data
  })
}

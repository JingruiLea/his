import request from '@/utils/request'

export function getClassification(data) {
  return request({
    url: '/statistics/getByPrescribe',
    method: 'post',
    data
  })
}

export function getTotal(data) {
  return request({
    url: '/statistics/getTotalPrescribe',
    method: 'post',
    data
  })
}

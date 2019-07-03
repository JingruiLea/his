import request from '@/utils/request'

export function getClassification(data) {
  return request({
    url: '/statistics/statisticsByRegister',
    method: 'post',
    data
  })
}

export function getTotal(data) {
  return request({
    url: '/statistics/getTotalRegister',
    method: 'post',
    data
  })
}

export function getPatientName(data) {
  return request({
    url: '/statistics/getPatientName',
    method: 'post',
    data
  })
}

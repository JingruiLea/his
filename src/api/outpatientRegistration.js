import request from '@/utils/request'

export function init(data) {
  return request({
    url: '/outpatientRegistration/init',
    method: 'post',
    data
  })
}

export function confirm(data) {
  return request({
    url: '/outpatientRegistration/confirm',
    method: 'post',
    data
  })
}
export function _delete(data) {
  return request({
    url: '/outpatientRegistration/delete',
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: '/outpatientRegistration/update',
    method: 'post',
    data
  })
}
export function withdrawNumber(data) {
  return request({
    url: '/outpatientRegistration/withdrawNumber',
    method: 'post',
    data
  })
}
export function syncDoctorList(data) {
  return request({
    url: '/outpatientRegistration/syncDoctorList',
    method: 'post',
    data
  })
}

export function calculateFee(data) {
  return request({
    url: '/outpatientRegistration/calculateFee',
    method: 'post',
    data
  })
}

export function selectById(data) {
  return request({
    url: '/outpatientRegistration/selectById',
    method: 'post',
    data
  })
}

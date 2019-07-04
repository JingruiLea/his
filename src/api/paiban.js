import request from '@/utils/request'

export function all(data) {
  return request({
    url: '/doctorSchedulingManagement/all',
    method: 'post',
    data
  })
}

export function _delete(data) {
  return request({
    url: '/doctorSchedulingManagement/delete',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: '/doctorSchedulingManagement/add',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/doctorSchedulingManagement/delete',
    method: 'post',
    data
  })
}

export function withdraw(data) {
  return request({
    url: '/outpatientCharge/withdraw',
    method: 'post',
    data
  })
}

import request from '@/utils/request'

export function getAll(data) {
  return request({
    url: '/registrationLevelManagement/all',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: '/registrationLevelManagement/add',
    method: 'post',
    data
  })
}
export function _delete(data) {
  return request({
    url: '/registrationLevelManagement/delete',
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: '/registrationLevelManagement/update',
    method: 'post',
    data
  })
}
export function _import(data) {
  return request({
    url: '/registrationLevelManagement/import',
    method: 'post',
    data
  })
}

import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/userManagement/add',
    method: 'post',
    data
  })
}

export function all(data) {
  return request({
    url: '/userManagement/all',
    method: 'post',
    data
  })
}
export function _delete(data) {
  return request({
    url: '/userManagement/delete',
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: '/userManagement/update',
    method: 'post',
    data
  })
}
export function _import(data) {
  return request({
    url: '/userManagement/import',
    method: 'post',
    data
  })
}

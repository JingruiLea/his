import request from '@/utils/request'

export function init(data) {
  return request({
    url: '/outpatientRegistration/init',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: '/outpatientRegistration/add',
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
export function _import(data) {
  return request({
    url: '/userManagement/import',
    method: 'post',
    data
  })
}

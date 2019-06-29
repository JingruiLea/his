import request from '@/utils/request'

export function getAll(data) {
  return request({
    url: '/diagnoseDirectoryManagement/allClassification',
    method: 'post',
    data
  })
}
export function getDisease(data) {
  return request({
    url: '/diagnoseDirectoryManagement/searchAllByClassificationId',
    method: 'post',
    data
  })
}
export function add(data) {
  return request({
    url: '/diagnoseDirectoryManagement/add',
    method: 'post',
    data
  })
}
export function _delete(data) {
  return request({
    url: '/diagnoseDirectoryManagement/delete',
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: '/diagnoseDirectoryManagement/update',
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

import request from '@/utils/request'

export function getAll(data) {
  return request({
    url: '/drugInfoManagement/all',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: '/drugInfoManagement/add',
    method: 'post',
    data
  })
}
export function _delete(data) {
  return request({
    url: '/drugInfoManagement/delete',
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: '/drugInfoManagement/update',
    method: 'post',
    data
  })
}
export function getDrugByPage(data) {
  return request({
    url: '/drugInfoManagement/getDrugByPage',
    method: 'post',
    data
  })
}
export function getDrugSize(data) {
  return request({
    url: '/drugInfoManagement/getDrugSize',
    method: 'post',
    data
  })
}
export function _import(data) {
  return request({
    url: '/drugInfoManagement/import',
    method: 'post',
    data
  })
}
export function search(data) {
  return request({
    url: '/drugInfoManagement/search',
    method: 'post',
    data
  })
}

import request from '@/utils/request'

export function getAll(data) {
  return request({
    url: '/departmentManage/getAll',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: '/departmentManage/add',
    method: 'post',
    data
  })
}
export function _delete(data) {
  return request({
    url: '/departmentManage/delete',
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

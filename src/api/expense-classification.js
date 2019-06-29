import request from '@/utils/request'

export function getAll(data) {
  return request({
    url: '/expenseClassificationManage/all',
    method: 'post',
    data
  })
}
export function add(data) {
  return request({
    url: '/expenseClassificationManage/add',
    method: 'post',
    data
  })
}
export function _delete(data) {
  return request({
    url: '/expenseClassificationManage/delete',
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: '/expenseClassificationManage/update',
    method: 'post',
    data
  })
}

import request from '@/utils/request'

export function getAll(data) {
  return request({
    url: '/settlementCategoryManagement/all',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: '/settlementCategoryManagement/add',
    method: 'post',
    data
  })
}
export function _delete(data) {
  return request({
    url: '/settlementCategoryManagement/delete',
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: '/settlementCategoryManagement/update',
    method: 'post',
    data
  })
}


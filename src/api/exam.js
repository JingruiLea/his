import request from '@/utils/request'

export function all(data) {
  return request({
    url: '/exam/allItems',
    method: 'post',
    data
  })
}

export function create(data) {
  return request({
    url: '/exam/create',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/exam/update',
    method: 'post',
    data
  })
}

export function _delete(data) {
  return request({
    url: '/exam/delete',
    method: 'post',
    data
  })
}



export function list(data) {
  return request({
    url: '/exam/list',
    method: 'post',
    data
  })
}

import request from '@/utils/request'

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
    url: '/drugWithdrawal/list',
    method: 'post',
    data
  })
}

export function all(data) {
  return request({
    url: '/prescription/all',
    method: 'post',
    data
  })
}

export function detail(data) {
  return request({
    url: '/examTemplate/detail',
    method: 'post',
    data
  })
}

export function send(data) {
  return request({
    url: '/exam/send',
    method: 'post',
    data
  })
}

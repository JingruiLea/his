import request from '@/utils/request'

export function all(data) {
  return request({
    url: '/exam/allItems',
    method: 'post',
    data
  })
}

export function getResult(data) {
  return request({
    url: '/exam/getResult',
    method: 'post',
    data
  })
}

export function allExam(data) {
  return request({
    url: '/examExcute/allExam',
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

export function listPaid(data) {
  return request({
    url: '/exam/listPaid',
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

export function register(data) {
  return request({
    url: '/exam/register',
    method: 'post',
    data
  })
}

export function cancel(data) {
  return request({
    url: '/exam/cancel',
    method: 'post',
    data
  })
}

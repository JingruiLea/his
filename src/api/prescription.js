import request from '@/utils/request'

export function all(data) {
  return request({
    url: '/prescription/allPrescription',
    method: 'post',
    data
  })
}

export function create(data) {
  return request({
    url: '/prescription/create',
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


export function detail(data) {
  return request({
    url: '/prescription/detail',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/prescription/update',
    method: 'post',
    data
  })
}

export function submit(data) {
  return request({
    url: '/prescription/submit',
    method: 'post',
    data
  })
}

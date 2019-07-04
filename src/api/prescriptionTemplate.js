import request from '@/utils/request'

export function list(data) {
  return request({
    url: 'prescriptionTemplate/list',
    method: 'post',
    data
  })
}

export function create(data) {
  return request({
    url: 'prescriptionTemplate/create',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/prescriptionTemplate/update',
    method: 'post',
    data
  })
}

export function _delete(data) {
  return request({
    url: '/prescriptionTemplate/delete',
    method: 'post',
    data
  })
}

export function detail(data) {
  return request({
    url: '/prescriptionTemplate/detail',
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

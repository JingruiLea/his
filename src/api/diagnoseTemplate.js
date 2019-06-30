import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/diagnoseTemplate/list',
    method: 'post',
    data
  })
}

export function create(data) {
  return request({
    url: '/diagnoseTemplate/create',
    method: 'post',
    data
  })
}

export function _delete(data) {
  return request({
    url: '/diagnoseTemplate/delete',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/outpatientCharge/update',
    method: 'post',
    data
  })
}

export function withdraw(data) {
  return request({
    url: '/outpatientCharge/withdraw',
    method: 'post',
    data
  })
}

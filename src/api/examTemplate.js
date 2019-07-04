import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/examTemplate/all',
    method: 'post',
    data
  })
}

export function create(data) {
  return request({
    url: '/examTemplate/create',
    method: 'post',
    data
  })
}

export function getHistoryChargeItems(data) {
  return request({
    url: '/outpatientCharge/getHistoryChargeItems',
    method: 'post',
    data
  })
}

export function charge(data) {
  return request({
    url: '/outpatientCharge/charge',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/examTemplate/update',
    method: 'post',
    data
  })
}
export function _delete(data) {
  return request({
    url: '/examTemplate/delete',
    method: 'post',
    data
  })
}

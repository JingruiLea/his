import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/diagnoseTemplate/list',
    method: 'post',
    data
  })
}

export function getChargeItems(data) {
  return request({
    url: '/diagnoseTemplate/list',
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

export function withdraw(data) {
  return request({
    url: '/outpatientCharge/withdraw',
    method: 'post',
    data
  })
}

import request from '@/utils/request'

export function getAll(data) {
  return request({
    url: '/nonDrugChargeItemManagement/all',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: '/nonDrugChargeItemManagement/add',
    method: 'post',
    data
  })
}
export function _delete(data) {
  return request({
    url: '/nonDrugChargeItemManagement/delete',
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: '/nonDrugChargeItemManagement/update',
    method: 'post',
    data
  })
}
export function _import(data) {
  return request({
    url: '/nonDrugChargeItemManagement/import',
    method: 'post',
    data
  })
}

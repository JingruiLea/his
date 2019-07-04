import request from '@/utils/request'

export function registrationByRecordId(data) {
  return request({
    url: '/diagnoseTemplate/list',
    method: 'post',
    data
  })
}

export function submitEnd(data) {
  return request({
    url: '/diagnose/submitEnd',
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

export function update(data) {
  return request({
    url: '/medicalRecord/updateDiagnose',
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



export function withdraw(data) {
  return request({
    url: '/outpatientCharge/withdraw',
    method: 'post',
    data
  })
}

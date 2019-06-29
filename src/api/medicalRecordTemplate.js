
import request from '@/utils/request'

export function getMedicalRecordTemplateList(data) {
  return request({
    url: '/medicalRecordTemplate/list',
    method: 'post',
    data
  })
}

export function create(data) {
  return request({
    url: '/medicalRecordTemplate/create',
    method: 'post',
    data
  })
}
export function allHistoryMedicalRecord(data) {
  return request({
    url: '/medicalRecord/allHistoryMedicalRecord',
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: '/medicalRecordTemplate/update',
    method: 'post',
    data
  })
}
export function _delete(data) {
  return request({
    url: '/medicalRecordTemplate/delete',
    method: 'post',
    data
  })
}

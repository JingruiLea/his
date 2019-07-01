import request from '@/utils/request'

export function getPatientList(data) {
  return request({
    url: '/medicalRecord/getPatientList',
    method: 'post',
    data
  })
}

export function getMedicalRecord(data) {
  return request({
    url: '/medicalRecord/getMedicalRecord',
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
export function updateMedicalRecord(data) {
  return request({
    url: '/medicalRecord/updateMedicalRecord',
    method: 'post',
    data
  })
}
export function saveMedicalRecord(data) {
  return request({
    url: '/medicalRecord/saveMedicalRecord',
    method: 'post',
    data
  })
}
export function confirmMedicalRecord(data) {
  return request({
    url: '/medicalRecord/confirmMedicalRecord',
    method: 'post',
    data
  })
}
export function registrationInfo(data) {
  return request({
    url: '/medicalRecord/confirmMedicalRecord',
    method: 'post',
    data
  })
}

import request from '@/utils/request'

export function getDepartments(data) {
  return request({
    url: '/departmentManage/getAll',
    method: 'post',
    data
  })
}

export function getSettlementCategorys(data) {
  return request({
    url: '/settlementCategoryManagement/all',
    method: 'post',
    data
  })
}

export function getRegistrationLevel(data) {
  return request({
    url: '/registrationLevelManagement/all',
    method: 'post',
    data
  })
}

export function getUsers(data) {
  return request({
    url: '/userManagement/all',
    method: 'post',
    data
  })
}

export function getDiseaseClassifications(data) {
  return request({
    url: '/diagnoseDirectoryManagement/allClassification',
    method: 'post',
    data
  })
}


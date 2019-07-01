import request from '@/utils/request'

export function getClassification(data) {
  return request({
    url: '/statistics/getFeeName',
    method: 'post',
    data
  })
}
export function getAll(data) {
  return request({
    url: '/departmentManage/getAll',
    method: 'post',
    data
  })
}

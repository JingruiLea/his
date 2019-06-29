import request from '@/utils/request'

export function getReporter(data) {
  return request({
    url: ' /outpatientDailyReportCheck/getReport',
    method: 'post',
    data
  })
}
export function confirmCheck(data) {
  return request({
    url: '/outpatientDailyReportCheck/confirmCheck',
    method: 'post',
    data
  })
}
export function init(data) {
  return request({
    url: '/outpatientDailyReportCheck/init',
    method: 'post',
    data
  })
}
export function history(data) {
  return request({
    url: '/outpatientDailyReportCheck/history',
    method: 'post',
    data
  })
}

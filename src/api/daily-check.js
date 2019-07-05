import request from '@/utils/request'

export function getAll(data) {
  return request({
    url: '/dailyCheck/list',
    method: 'post',
    data
  })
}

export function detail(data) {
  return request({
    url: '/dailyCollect/detail',
    method: 'post',
    data
  })
}
export function collect(data) {
  return request({
    url: '/dailyCollect/collect',
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: '/dailyCollect/update',
    method: 'post',
    data
  })
}
export function init(data) {
  return request({
    url: '/dailyCheck/init',
    method: 'post',
    data
  })
}
export function check(data) {
  return request({
    url: '/dailyCheck/check',
    method: 'post',
    data
  })
}

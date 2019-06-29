import request from '@/utils/request'

export function getAll(data) {
  return request({
    url: '/dailyCollect/list',
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

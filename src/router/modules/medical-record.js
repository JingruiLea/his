/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const medicalRecordRouter = {
  path: '/medicalRecord',
  component: Layout,
  redirect: '/index',
  name: 'medicalRecord',
  meta: {
    title: '门诊医生工作站',
    icon: 'form'
  },
  children: [
    {
      path: '/index1',
      component: () => import('@/views/example/medical-record-index'),
      name: 'index1',
      meta: { title: '门诊病历首页', noCache: true }
    },
    {
      path: 'personalStatistics',
      component: () => import('@/views/charts/personalStatistics'),
      name: 'personalStatistics',
      meta: { title: '个人工作量统计', noCache: true }
    },
  ]
}

export default medicalRecordRouter

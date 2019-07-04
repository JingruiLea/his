/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const chartsRouter = {
  path: '/charts',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Charts',
  meta: {
    title: 'Charts',
    icon: 'chart'
  },
  children: [
    {
      path: 'departmentStatistics',
      component: () => import('@/views/charts/departmentStatistics'),
      name: 'departmentStatistics',
      meta: { title: '执行科室工作量统计', noCache: true }
    },
    {
      path: 'prescribeStatistics',
      component: () => import('@/views/charts/prescribeStatistics'),
      name: 'prescribeStatistics',
      meta: { title: '开单科室工作量统计', noCache: true }
    },
    {
      path: 'personalStatistics',
      component: () => import('@/views/charts/personalStatistics'),
      name: 'personalStatistics',
      meta: { title: '个人工作量统计', noCache: true }
    },
    {
      path: 'doctorStatistics',
      component: () => import('@/views/charts/doctorStatistics'),
      name: 'doctorStatistics',
      meta: { title: '门诊医生个人工作量统计', noCache: true }
    },
    {
      path: 'techStatistics',
      component: () => import('@/views/charts/techStatistics'),
      name: 'techStatistics',
      meta: { title: '医技医生个人工作量统计', noCache: true }
    }
  ]
}

export default chartsRouter

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
      path: 'keyboard',
      component: () => import('@/views/charts/keyboard'),
      name: 'KeyboardChart',
      meta: { title: 'Keyboard Chart', noCache: true }
    },
    {
      path: 'line',
      component: () => import('@/views/charts/line'),
      name: 'LineChart',
      meta: { title: 'Line Chart', noCache: true }
    },
    {
      path: 'mix-chart',
      component: () => import('@/views/charts/mix-chart'),
      name: 'MixChart',
      meta: { title: 'Mix Chart', noCache: true }
    },
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
    }
  ]
}

export default chartsRouter

/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const chartsRouter = {
  path: '/charts',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Charts',
  meta: {
    title: '门诊财务管理',
    icon: 'money'
  },
  children: [
    {
      path: 'expense-classification',
      component: () => import('@/views/table/expense-classification'),
      name: 'expense-classification',
      meta: { title: '收费目录管理' }
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
      path: 'doctorStatistics',
      component: () => import('@/views/charts/doctorStatistics'),
      name: 'doctorStatistics',
      meta: { title: '门诊医生个人工作量统计', noCache: true }
    },
    {
      path: 'daily-check',
      component: () => import('@/views/table/daily-check'),
      name: 'daily-check',
      meta: { title: '日结核对' }
    }
  ]
}

export default chartsRouter

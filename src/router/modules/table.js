/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/table',
  component: Layout,
  redirect: '/table/complex-table',
  name: '基本信息管理',
  meta: {
    title: '基本信息管理',
    icon: 'table'
  },
  children: [
    {
      path: 'copy-complex-table',
      component: () => import('@/views/table/copy-comp-table'),
      name: 'ComplexTable2',
      meta: { title: '用户信息管理' }
    },
    {
      path: 'departments',
      component: () => import('@/views/table/departments'),
      name: 'departments',
      meta: { title: '科室管理' }
    },
    {
      path: 'registration-levels',
      component: () => import('@/views/table/registration-levels'),
      name: 'registration-levels',
      meta: { title: '挂号等级管理' }
    },
    {
      path: 'settlement-categorys',
      component: () => import('@/views/table/settlement-categorys'),
      name: 'settlement-categorys',
      meta: { title: '支付方式管理' }
    },
    {
      path: 'disease-directorys',
      component: () => import('@/views/table/disease-directorys'),
      name: 'disease-directorys',
      meta: { title: '诊断目录管理' }
    },
    {
      path: 'nondrugs',
      component: () => import('@/views/table/nondrugs'),
      name: 'nondrugs',
      meta: { title: '非药品目录管理' }
    },
    {
      path: 'drugs',
      component: () => import('@/views/table/drugs'),
      name: 'drugs',
      meta: { title: '药品目录管理' }
    },
    {
      path: 'expense-classification',
      component: () => import('@/views/table/expense-classification'),
      name: 'expense-classification',
      meta: { title: '收费目录管理' }
    },
    {
      path: 'daily-collect',
      component: () => import('@/views/table/daily-collect'),
      name: 'daily-collect',
      meta: { title: '收费员日结' }
    },
    {
      path: 'daily-check',
      component: () => import('@/views/table/daily-check'),
      name: 'daily-check',
      meta: { title: '日结核对' }
    }
  ]
}
export default tableRouter

/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const examRouter = {
  path: '/exam',
  component: Layout,
  redirect: 'noRedirect',
  name: 'exam',
  meta: {
    title: '门诊医技工作站',
    icon: 'example'
  },
  children: [
    {
      path: '/examRegistration',
      component: () => import('@/views/example/examRegistration'),
      name: 'examRegistration',
      meta: { title: '检查检验登记', noCache: true }
    },
    {
      path: '/examResult',
      component: () => import('@/views/example/examResult'),
      name: 'examResult',
      meta: { title: '检查检验结果录入', noCache: true }
    },
    {
      path: 'techStatistics',
      component: () => import('@/views/charts/techStatistics'),
      name: 'techStatistics',
      meta: { title: '医技医生个人工作量统计', noCache: true }
    },
  ]
}

export default examRouter

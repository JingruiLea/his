/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const medicineRouter = {
  path: '/medicine',
  component: Layout,
  redirect: 'noRedirect',
  name: 'medicine',
  meta: {
    title: '门诊药房工作站',
    icon: 'component'
  },
  children: [
    {
      path: '/index',
      component: () => import('@/views/example/sendDrug'),
      name: 'index',
      meta: { title: '门诊药房', noCache: true }
    }
  ]
}

export default medicineRouter

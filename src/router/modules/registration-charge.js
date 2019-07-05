/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const chargeRouter = {
  path: '/registrationCharge',
  component: Layout,
  redirect: 'noRedirect',
  name: 'registrationCharge',
  meta: {
    title: '挂号缴费',
    icon: 'people'
  },
  children: [
    {
      path: '/registration',
      component: () => import('@/views/guide/index'),
      name: 'registration',
      meta: { title: '挂号退号', noCache: true }
    },
    {
      path: '/charge',
      component: () => import('@/views/example/charge'),
      name: 'charge',
      meta: { title: '收费/退费', noCache: true }
    },
    {
      path: 'daily-collect',
      component: () => import('@/views/table/daily-collect'),
      name: 'daily-collect',
      meta: { title: '收费员日结' }
    }
  ]
}

export default chargeRouter

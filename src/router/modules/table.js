/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/table',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'Table',
  meta: {
    title: 'Table',
    icon: 'table'
  },
  children: [
    {
      path: 'dynamic-table',
      component: () => import('@/views/table/dynamic-table/index'),
      name: 'DynamicTable',
      meta: { title: 'Dynamic Table' }
    },
    {
      path: 'drag-table',
      component: () => import('@/views/table/drag-table'),
      name: 'DragTable',
      meta: { title: 'Drag Table' }
    },
    {
      path: 'inline-edit-table',
      component: () => import('@/views/table/inline-edit-table'),
      name: 'InlineEditTable',
      meta: { title: '基本信息管理' }
    },
    {
      path: 'complex-table',
      component: () => import('@/views/table/complex-table'),
      name: 'ComplexTable',
      meta: { title: 'Complex Table' }
    },
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
      path: 'departments2',
      component: () => import('@/views/table/a'),
      name: 'departments2',
      meta: { title: 'test' }
    }
  ]
}
export default tableRouter

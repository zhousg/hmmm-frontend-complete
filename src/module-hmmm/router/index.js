import Layout from '@/module-dashboard/pages/layout'
const _import = require('@/router/import_' + process.env.NODE_ENV)

export default [
  {
    path: '/companys',
    component: Layout,
    redirect: 'noredirect',
    name: 'companys',
    meta: {
      title: '企业管理',
      icon: 'component'
    },
    children: [
      {
        path: 'list',
        component: _import('hmmm/pages/companys'),
        name: 'companys-list',
        meta: { title: '企业管理', noCache: true, icon: 'peoples' }
      }
    ]
  },
  {
    path: '/questions',
    component: Layout,
    redirect: 'noredirect',
    name: 'questions',
    meta: {
      title: '题库管理',
      icon: 'documentation'
    },
    children: [
      {
        path: 'list',
        component: _import('hmmm/pages/questions'),
        name: 'questions-list',
        meta: { title: '基础题库', noCache: true, icon: 'component' }
      },
      {
        path: 'choice',
        component: _import('hmmm/pages/questions-choice'),
        name: 'questions-choice',
        meta: { title: '精选题库', noCache: true, icon: 'component' }
      },
      {
        path: 'new',
        component: _import('hmmm/pages/questions-new'),
        name: 'questions-new',
        meta: { title: '试题录入', noCache: true, icon: 'component' }
      },
      {
        path: 'randoms',
        component: _import('hmmm/pages/questions-randoms'),
        name: 'questions-randoms',
        meta: { title: '组题列表', noCache: true, icon: 'component' }
      }
    ]
  },
  {
    path: '/subjects',
    component: Layout,
    redirect: 'noredirect',
    name: 'subjects',
    meta: {
      title: '学科管理',
      icon: 'table'
    },
    children: [
      {
        path: 'list',
        component: _import('hmmm/pages/subjects'),
        name: 'subjects-list',
        meta: { title: '学科', noCache: true, icon: 'component' }
      },
      {
        path: 'directorys',
        component: _import('hmmm/pages/directorys'),
        name: 'subjects-directorys',
        meta: { title: '目录', noCache: true, icon: 'component' }
      },
      {
        path: 'tags',
        component: _import('hmmm/pages/tags'),
        name: 'subjects-tags',
        meta: { title: '标签', noCache: true, icon: 'component' }
      }
    ]
  },
  {
    path: '/articles',
    component: Layout,
    redirect: 'noredirect',
    name: 'articles',
    meta: {
      title: '面试技巧',
      icon: 'form'
    },
    children: [
      {
        path: 'list',
        component: _import('hmmm/pages/articles'),
        name: 'articles-list',
        meta: { title: '面试技巧', noCache: true, icon: 'component' }
      }
    ]
  }
]

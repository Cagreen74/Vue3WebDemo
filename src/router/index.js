/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
import { createRouter, createWebHistory } from 'vue-router'

/*import store from '../plugins/store.js'*/
/*import axios  from 'axios'*/
import { vueStore } from './../plugins/store';


const routes = [ 
  {
    path: '/AdminDashboard',
    name: 'AdminHome',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Dashboards/AdminDashboard.vue'),
    meta: {
      allowAnonymous: false,
      ShowNavbar: true,
      NavbarIndex: 0,
      viewname: 'Admin Dashboard Home'
    }
  },
  {
    path: '/ManageRangeHistory',
    name: 'RangeHistory',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Dashboards/ManageRangeHistory.vue'),
    meta: {
      allowAnonymous: false,
      ShowNavbar: true,
      NavbarIndex: 0,
      viewname: 'Manage Range Search History'
    }
  },
    {
        path: '/Login',
        name: 'LoginHome',
        props:true,
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/LoginHome.vue'),
        meta: {
          allowAnonymous: true,
          ShowNavbar: false,
          NavbarIndex: 0,
          viewname: null
        }
    }
]

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(process.env.BASE_URL),
  routes, // short for `routes: routes`
   scrollBehavior() {
    return { left: 0, top: 0 };
  }
})

router.beforeEach((to, from, next) => {
    const store = vueStore();
    var isauthenticated = store.user.isAuthenticated;
    if (!to.meta.allowAnonymous && (!isauthenticated)) {
        next({
            path: '/Login',
            query: { redirect: to.fullPath }
        })
    }
    else {
      if (to.fullPath == '/') {
        next({
          path: store.user.homepage,
        })
      }
      else {
        next();
      }
    }
})

export default router

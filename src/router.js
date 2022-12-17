import Vue from 'vue'
import Router from 'vue-router'
import firebase from './firebase.config'

import login from './components/login/login'
import signup from './components/login/signup'
import tmp_signup from './components/login/tmp_signup'
import error from './components/login/error'

import home from './components/main/home'
import search from './components/main/search'
import comment from './components/main/comment'
import like from './components/main/like'
import profile from './components/main/profile'
import profiles from './components/main/profiles'
import setting from './components/main/setting'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: login,
      name: 'login'
    },
    {
      path: '/tmp_signup',
      component: tmp_signup,
      name: 'tmp_signup'
    },
    {
      path: '/signup',
      component: signup,
      name: 'signup'
    },
    {
      path: '/error',
      component: error,
      name: 'error'
    },
    {
      path: '/home',
      component: home,
      name: 'home',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/search',
      component: search,
      name: 'search',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/comment',
      component: comment,
      name: 'comment',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/like',
      component: like,
      name: 'like',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/profile',
      component: profile,
      name: 'profile',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/profiles',
      component: profiles,
      name: 'profiles',
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/setting',
      component: setting,
      name: 'setting',
      meta: {
        requiresAuth: true
      }
    },
  ]
})


router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        next({
          path: '/',
          query: { redirect: to.fullPath }
        })
      } else {
        next()
      }
    });
  } else {
    next()
  }
})
export default router
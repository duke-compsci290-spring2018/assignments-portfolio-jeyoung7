import Vue from 'vue'
import Router from 'vue-router'
import Landing from '@/pages/Landing'
import Home from '@/pages/Home'
import firebase from 'firebase'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'Landing',
      component: Landing
    },
    {
      path: '/Home',
      name: 'Home',
      component: Home,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

/*
router.beforeEach((to ,from, next) => {
  let currentUser = firebase.auth().currentUser;
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (!requiresAuth && currentUser) next('Home')
  else next()
})
*/
export default router

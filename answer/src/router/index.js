import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index.vue'
import mine from '@/components/mine.vue'
import answer from '@/components/answer.vue'
import ranking from '@/components/ranking.vue'
import userCanvas from '@/components/userCanvas.vue'
import preheat from '@/components/preheat.vue'
import results from '@/components/results.vue'
import invite from '@/components/invite.vue'
// import fail from '@/components/fail.vue'
// import divide from '@/components/divide.vue'
// import share from '@/components/share.vue'

Vue.use(Router)

export default new Router({
  
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/mine',
      name: 'mine',
      component: mine
    },
    {
      path: '/answer',
      name: 'answer',
      component: answer
    },
    {
      path: '/ranking',
      name: 'ranking',
      component: ranking
    },
    {
      path: '/userCanvas',
      name: 'userCanvas',
      component: userCanvas
    },
    {
      path: '/preheat',
      name: 'preheat',
      component: preheat
    },
    {
      path: '/results',
      name: 'results',
      component: results
    },
    {
      path: '/invite',
      name: 'invite',
      component: invite
    },
    {
      path: '*',
      redirect: '/'}
  ]
})

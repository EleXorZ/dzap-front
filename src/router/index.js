import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Newsletter from '../pages/Newsletter.vue'
import ProfilInvestisseur from '../pages/ProfilInvestisseur.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/newsletter',
    name: 'Newsletter',
    component: Newsletter
  },
  {
    path: '/profil-investisseur',
    name: 'ProfilInvestisseur',
    component: ProfilInvestisseur
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router


import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MBView from '../views/MBView.vue'
import CPUView from '../views/CPUView.vue'
import RamView from '../views/RamView.vue'
import GPUView from '../views/GPUView.vue'
import PSUView from '../views/PSUView.vue'
import StorageView from '../views/StorageView.vue'
import EditorView from '../views/EditorView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/motherboards',
      name: 'mb',
      component: MBView
    },
    {
      path: '/processors',
      name: 'cpu',
      component: CPUView
    },
    {
      path: '/ram-memories',
      name: 'ram',
      component: RamView
    },
    {
      path: '/storage-devices',
      name: 'storage',
      component: StorageView
    },
    {
      path: '/graphic-cards',
      name: 'gpu',
      component: GPUView
    },
    {
      path: '/power-supplies',
      name: 'psu',
      component: PSUView
    },
    {
      path: '/editor',
      name: 'editor',
      component: EditorView
    }
  ]
})

export default router

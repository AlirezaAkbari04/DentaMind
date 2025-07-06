/**
 * Vue Router Configuration - Simplified
 * 
 * Basic router setup with only existing components.
 * We'll add more routes as we create the components.
 */

import { createRouter, createWebHistory } from 'vue-router'
import { authGuard, roleGuard, titleGuard } from './guards'

// ==========================================
// EXISTING COMPONENTS ONLY
// ==========================================

// Authentication Views
const Login = () => import('@/views/Auth/Login.vue')

// Shared Views - Error pages
const NotFound = () => import('@/views/Shared/NotFound.vue')
const Unauthorized = () => import('@/views/Shared/Unauthorized.vue')

// ==========================================
// BASIC ROUTES - ONLY EXISTING COMPONENTS
// ==========================================

const routes = [
  /**
   * Root Route - Redirect to login
   */
  {
    path: '/',
    redirect: '/auth/login'
  },

  /**
   * Authentication Routes
   */
  {
    path: '/auth/login',
    name: 'Login',
    component: Login,
    meta: { 
      requiresGuest: true,
      title: 'Login - Dental Clinic Management'
    }
  },

  /**
   * Error Routes
   */
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: Unauthorized,
    meta: { title: 'Unauthorized Access' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { title: 'Page Not Found' }
  }
]

// ==========================================
// ROUTER INSTANCE
// ==========================================

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  
  // Scroll behavior for better UX
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// ==========================================
// APPLY ROUTER GUARDS
// ==========================================

// Apply guards in order of importance
router.beforeEach(authGuard)
router.beforeEach(roleGuard)
router.beforeEach(titleGuard)

// Global error handling
router.onError((error) => {
  console.error('Router error:', error)
})

export default router
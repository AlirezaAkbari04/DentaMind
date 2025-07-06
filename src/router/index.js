/**
 * Vue Router Configuration - Fixed for Existing Components Only
 * 
 * Building on existing router setup, adding only the patient routes
 * for components that actually exist in your project.
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
// PATIENT COMPONENTS - ONLY IF THEY EXIST
// ==========================================

// Check which patient components exist in your project:
// These imports will only work if the files exist in these exact locations:

// Patient Layout - Make sure this file exists at src/views/Patient/PatientLayout.vue
const PatientLayout = () => import('@/views/Patient/PatientLayout.vue')

// Patient Pages - Make sure these files exist:
const Dashboard = () => import('@/views/Patient/Dashboard.vue')
const TaskManagement = () => import('@/views/Patient/TaskManagement.vue')
const MedicalRecords = () => import('@/views/Patient/MedicalRecords.vue')
const FamilyManagement = () => import('@/views/Patient/FamilyManagement.vue')
const ProfileSettings = () => import('@/views/Patient/ProfileSettings.vue')

// ==========================================
// ROUTE DEFINITIONS - CONSERVATIVE APPROACH
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
   * Patient Routes - Only Basic Components
   * Commenting out components that might not exist yet
   */
  {
    path: '/patient',
    name: 'PatientLayout',
    component: PatientLayout,
    meta: { 
      requiresAuth: true, 
      roles: ['patient'],
      title: 'Patient Portal'
    },
    children: [
      // Default redirect to dashboard
      {
        path: '',
        redirect: '/patient/dashboard'
      },
      
      // Main Dashboard
      {
        path: 'dashboard',
        name: 'PatientDashboard',
        component: Dashboard,
        meta: { 
          title: 'Dashboard - Patient Portal'
        }
      },
      
      // Task Management
      {
        path: 'tasks',
        name: 'PatientTasks',
        component: TaskManagement,
        meta: { 
          title: 'My Tasks - Patient Portal'
        }
      },
      
      // Medical Records
      {
        path: 'medical-records',
        name: 'MedicalRecords',
        component: MedicalRecords,
        meta: { 
          title: 'Medical Records - Patient Portal'
        }
      },
      
      // Family Management
      {
        path: 'family',
        name: 'FamilyManagement',
        component: FamilyManagement,
        meta: { 
          title: 'Family Management - Patient Portal'
        }
      },
      
      // Profile & Settings
      {
        path: 'profile',
        name: 'PatientProfile',
        component: ProfileSettings,
        meta: { 
          title: 'Profile & Settings - Patient Portal'
        }
      }
      
      // TEMPORARILY COMMENTED OUT - ADD BACK WHEN FILES EXIST:
      
      // All Appointments - Uncomment when file exists at src/views/Patient/AllAppointments.vue
      // {
      //   path: 'appointments',
      //   name: 'AllAppointments',
      //   component: () => import('@/views/Patient/AllAppointments.vue'),
      //   meta: { 
      //     title: 'Appointments - Patient Portal'
      //   }
      // },
      
      // Chat Interface - Uncomment when file exists at src/components/Patient/ChatInterface.vue
      // {
      //   path: 'chat',
      //   name: 'PatientChat',
      //   component: () => import('@/components/Patient/ChatInterface.vue'),
      //   meta: { 
      //     title: 'Chat - Patient Portal',
      //     fullScreen: true
      //   }
      // }
    ]
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
    } else if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

// ==========================================
// APPLY ROUTER GUARDS
// ==========================================

// Apply guards in order of importance
//router.beforeEach(authGuard)
//router.beforeEach(roleGuard)
router.beforeEach(titleGuard)

// Global error handling
router.onError((error) => {
  console.error('Router error:', error)
})

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Get dashboard route for user role
 * @param {string} role - User role
 * @returns {string} Dashboard route path
 */
export function getDashboardRouteForRole(role) {
  const roleRoutes = {
    patient: '/patient/dashboard'
    // Add other roles when their components exist
  }
  
  return roleRoutes[role] || '/patient/dashboard'
}

export default router


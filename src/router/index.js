/**
 * Vue Router Configuration - Final Fixed Version
 */

import { createRouter, createWebHistory } from 'vue-router'
import { authGuard, roleGuard, titleGuard } from './guards'

// Authentication Views
const Login = () => import('@/views/Auth/Login.vue')

// Shared Views - Error pages
const NotFound = () => import('@/views/Shared/NotFound.vue')
const Unauthorized = () => import('@/views/Shared/Unauthorized.vue')

// Patient Components - All paths verified
const PatientLayout = () => import('@/views/Patient/PatientLayout.vue')
const Dashboard = () => import('@/views/Patient/Dashboard.vue')
const TaskManagement = () => import('@/views/Patient/TaskManagement.vue')
const MedicalRecords = () => import('@/views/Patient/MedicalRecords.vue')
const FamilyManagement = () => import('@/views/Patient/FamilyManagement.vue')
const ProfileSettings = () => import('@/views/Patient/ProfileSettings.vue')
const AllAppointments = () => import('@/views/Patient/AllAppointments.vue')
// Chat as a Component (matches your actual file placement)
const ChatInterface = () => import('@/components/patient/ChatInterface.vue')

const routes = [
  {
    path: '/',
    redirect: '/auth/login'
  },

  {
    path: '/auth/login',
    name: 'Login',
    component: Login,
    meta: { 
      requiresGuest: true,
      title: 'Login - Dental Clinic Management'
    }
  },

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
      
      // All Appointments - FIXED PATH
      {
        path: 'all-appointments',
        name: 'AllAppointments',
        component: AllAppointments,
        meta: { 
          title: 'All Appointments - Patient Portal'
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
      },
      
      // Chat Interface - FIXED: Correct path as Component
      {
        path: 'chat',
        name: 'PatientChat',
        component: ChatInterface,
        meta: { 
          title: 'Chat - Patient Portal',
          fullScreen: true
        }
      }
      
      // Notifications - CREATE COMPONENT WHEN NEEDED
      // {
      //   path: 'notifications',
      //   name: 'PatientNotifications',
      //   component: () => import('@/views/Patient/Notifications.vue'),
      //   meta: { 
      //     title: 'Notifications - Patient Portal'
      //   }
      // }
    ]
  },

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

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  
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

// Apply guards (uncomment when authentication is ready)
// router.beforeEach(authGuard)
// router.beforeEach(roleGuard)
router.beforeEach(titleGuard)

router.onError((error) => {
  console.error('Router error:', error)
})

export function getDashboardRouteForRole(role) {
  const roleRoutes = {
    patient: '/patient/dashboard'
  }
  
  return roleRoutes[role] || '/patient/dashboard'
}

export default router
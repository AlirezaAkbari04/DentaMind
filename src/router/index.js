/**
 * Vue Router Configuration
 * 
 * Fixed Issues:
 * 1. Changed patient default route from /dashboard to /tasks
 * 2. Updated getDashboardRouteForRole function to reflect change
 * 3. Maintained all existing routing functionality
 */

import { createRouter, createWebHistory } from 'vue-router'
import { authGuard, roleGuard, titleGuard } from './guards'

// Lazy-loaded components for better performance
const Login = () => import('@/views/auth/Login.vue')
const NotFound = () => import('@/views/shared/NotFound.vue')

// Patient Components
const PatientLayout = () => import('@/views/Patient/PatientLayout.vue')
const Dashboard = () => import('@/views/Patient/Dashboard.vue')
const TaskManagement = () => import('@/views/Patient/TaskManagement.vue')
const MedicalRecords = () => import('@/views/Patient/MedicalRecords.vue')
const FamilyManagement = () => import('@/views/Patient/FamilyManagement.vue')
const AllAppointments = () => import('@/views/Patient/AllAppointments.vue')
const ProfileSettings = () => import('@/views/Patient/ProfileSettings.vue')
const ChatInterface = () => import('@/components/Patient/ChatInterface.vue')

// Doctor Secretary Components
const DoctorSecretaryLayout = () => import('@/views/DoctorSecretary/DoctorSecretaryLayout.vue')
const DoctorSecretaryDashboard = () => import('@/views/DoctorSecretary/DoctorSecretaryDashboard.vue')
const PatientManagement = () => import('@/views/DoctorSecretary/PatientManagement.vue')
const CommunicationHub = () => import('@/views/DoctorSecretary/CommunicationHub.vue')
const PatientProfile = () => import('@/views/DoctorSecretary/PatientProfile.vue')
const AppointmentManagement = () => import('@/views/DoctorSecretary/AppointmentManagement.vue')
const AppointmentApproval = () => import('@/views/DoctorSecretary/AppointmentApproval.vue')
const SchedulingDashboard = () => import('@/views/DoctorSecretary/SchedulingDashboard.vue')
const ClinicalNotes = () => import('@/views/DoctorSecretary/ClinicalNotes.vue')
const TaskTemplates = () => import('@/views/DoctorSecretary/TaskTemplates.vue')
const ComplianceReports = () => import('@/views/DoctorSecretary/ComplianceReports.vue')
const ReminderSystem = () => import('@/views/DoctorSecretary/ReminderSystem.vue')
const PatientRecordsOverview = () => import('@/views/DoctorSecretary/PatientRecordsOverview.vue')
const ClinicFlowManagement = () => import('@/views/DoctorSecretary/ClinicFlowManagement.vue')
const DoctorSecretaryProfile = () => import('@/views/DoctorSecretary/DoctorSecretaryProfile.vue')

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

  // PATIENT ROUTES
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
        redirect: '/patient/tasks'  // CHANGED: Now defaults to tasks instead of dashboard
      },
      {
        path: 'tasks',
        name: 'PatientTasks',
        component: TaskManagement,
        meta: { title: 'My Tasks - Patient Portal' }
      },
      {
        path: 'dashboard',
        name: 'PatientDashboard',
        component: Dashboard,
        meta: { title: 'Dashboard - Patient Portal' }
      },
      {
        path: 'medical-records',
        name: 'MedicalRecords',
        component: MedicalRecords,
        meta: { title: 'Medical Records - Patient Portal' }
      },
      {
        path: 'family',
        name: 'FamilyManagement',
        component: FamilyManagement,
        meta: { title: 'Family Management - Patient Portal' }
      },
      {
        path: 'all-appointments',
        name: 'AllAppointments',
        component: AllAppointments,
        meta: { title: 'All Appointments - Patient Portal' }
      },
      {
        path: 'profile',
        name: 'PatientProfileSettings',
        component: ProfileSettings,
        meta: { title: 'Profile & Settings - Patient Portal' }
      },
      {
        path: 'chat',
        name: 'PatientChat',
        component: ChatInterface,
        meta: { title: 'Chat - Patient Portal', fullScreen: true }
      }
    ]
  },

  // DOCTOR SECRETARY ROUTES
  {
    path: '/doctor-secretary',
    name: 'DoctorSecretaryLayout',
    component: DoctorSecretaryLayout,
    meta: { 
      requiresAuth: true, 
      roles: ['doctor', 'secretary'],
      title: 'Doctor & Secretary Portal'
    },
    children: [
      {
        path: '',
        redirect: '/doctor-secretary/dashboard'
      },
      
      // Main Dashboard
      {
        path: 'dashboard',
        name: 'DoctorSecretaryDashboard',
        component: DoctorSecretaryDashboard,
        meta: { title: 'Dashboard - Doctor & Secretary Portal' }
      },
      
      // Core Features (Both Roles)
      {
        path: 'patients',
        name: 'PatientManagement',
        component: PatientManagement,
        meta: { title: 'Patient Management' }
      },
      
      {
        path: 'communication',
        name: 'CommunicationHub',
        component: CommunicationHub,
        meta: { title: 'Communication Hub' }
      },
      
      {
        path: 'patient/:id',
        name: 'PatientProfileView',
        component: PatientProfile,
        meta: { title: 'Patient Profile' }
      },
      
      // Appointment Center
      {
        path: 'appointments',
        name: 'AppointmentManagement',
        component: AppointmentManagement,
        meta: { 
          title: 'Appointment Management',
          roles: ['doctor']
        }
      },
      
      {
        path: 'appointment-approval',
        name: 'AppointmentApproval',
        component: AppointmentApproval,
        meta: { 
          title: 'Appointment Approval - Secretary Portal',
          roles: ['secretary']
        }
      },
      
      {
        path: 'scheduling-dashboard',
        name: 'SchedulingDashboard',
        component: SchedulingDashboard,
        meta: { 
          title: 'Scheduling Dashboard',
          roles: ['secretary']
        }
      },
      
      // Clinical Tools (Doctor Only)
      {
        path: 'clinical-notes',
        name: 'ClinicalNotes',
        component: ClinicalNotes,
        meta: { 
          title: 'Clinical Notes',
          roles: ['doctor']
        }
      },
      
      {
        path: 'task-templates',
        name: 'TaskTemplates',
        component: TaskTemplates,
        meta: { 
          title: 'Task Templates',
          roles: ['doctor']
        }
      },
      
      {
        path: 'compliance-reports',
        name: 'ComplianceReports',
        component: ComplianceReports,
        meta: { 
          title: 'Compliance Reports',
          roles: ['doctor']
        }
      },
      
      // Secretary Specific
      {
        path: 'reminder-system',
        name: 'ReminderSystem',
        component: ReminderSystem,
        meta: { 
          title: 'Reminder System',
          roles: ['secretary']
        }
      },
      
      {
        path: 'patient-records-overview',
        name: 'PatientRecordsOverview',
        component: PatientRecordsOverview,
        meta: { 
          title: 'Patient Records Overview',
          roles: ['secretary']
        }
      },
      
      {
        path: 'clinic-flow-management',
        name: 'ClinicFlowManagement',
        component: ClinicFlowManagement,
        meta: { 
          title: 'Clinic Flow Management',
          roles: ['secretary']
        }
      },
      
      // Profile
      {
        path: 'profile',
        name: 'DoctorSecretaryProfile',
        component: DoctorSecretaryProfile,
        meta: { title: 'Profile - Doctor & Secretary Portal' }
      }
    ]
  },

  // Catch-all route for 404 pages
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

/**
 * Get the default dashboard route for a given user role
 * UPDATED: Patient role now defaults to tasks instead of dashboard
 * 
 * @param {string} role - User role
 * @returns {string} Default route path
 */
export function getDashboardRouteForRole(role) {
  const roleRoutes = {
    patient: '/patient/tasks',        // CHANGED: Was '/patient/dashboard'
    doctor: '/doctor-secretary/dashboard',
    secretary: '/doctor-secretary/dashboard',
    admin: '/admin/dashboard',
    moderator: '/moderator/dashboard'
  }
  
  return roleRoutes[role] || '/patient/tasks'  // CHANGED: Default fallback also updated
}

export default router
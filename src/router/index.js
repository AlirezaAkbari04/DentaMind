/**
 * Vue Router Configuration
 * 
 * Fixed Issues:
 * 1. Changed patient default route from /dashboard to /tasks
 * 2. Updated getDashboardRouteForRole function to reflect change
 * 3. Added moderator routes and components
 * 4. Maintained all existing routing functionality
 */

import { createRouter, createWebHistory } from 'vue-router'
import { authGuard, roleGuard, titleGuard } from './guards'

const Login = () => import('@/views/Auth/Login.vue')

// Shared Views - Error pages
const NotFound = () => import('@/views/Shared/NotFound.vue')
const Unauthorized = () => import('@/views/Shared/Unauthorized.vue')

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

// Moderator Components
const ModeratorLayout = () => import('@/views/Moderator/ModeratorLayout.vue')
const ModeratorDashboard = () => import('@/views/Moderator/ModeratorDashboard.vue')
const TreatmentPlanGenerator = () => import('@/views/Moderator/TreatmentPlanGenerator.vue')
const TaskTemplateManagement = () => import('@/views/Moderator/TaskTemplateManagement.vue')
const AIConfiguration = () => import('@/views/Moderator/AIConfiguration.vue')
const SystemAdmin = () => import('@/views/Moderator/SystemAdmin.vue')
const ClinicManagement = () => import('@/views/Moderator/ClinicManagement.vue')
const SubscriptionManagement = () => import('@/views/Moderator/SubscriptionManagement.vue')
const SystemAnalytics = () => import('@/views/Moderator/SystemAnalytics.vue')
const DatabaseTools = () => import('@/views/Moderator/DatabaseTools.vue')
const SecuritySettings = () => import('@/views/Moderator/SecuritySettings.vue')
const ModeratorProfile = () => import('@/views/Moderator/ModeratorProfile.vue')

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

  // MODERATOR ROUTES
  {
    path: '/moderator',
    name: 'ModeratorLayout',
    component: ModeratorLayout,
    meta: { 
      requiresAuth: true, 
      roles: ['moderator'],
      title: 'Moderator Portal'
    },
    children: [
      {
        path: '',
        redirect: '/moderator/dashboard'
      },
      
      // Main Dashboard
      {
        path: 'dashboard',
        name: 'ModeratorDashboard',
        component: ModeratorDashboard,
        meta: { title: 'Dashboard - Moderator Portal' }
      },
      
      // Core Features
      {
        path: 'treatment-plans',
        name: 'TreatmentPlanGenerator',
        component: TreatmentPlanGenerator,
        meta: { title: 'Treatment Plan Generator' }
      },
      
      {
        path: 'treatment-plans/new',
        name: 'NewTreatmentPlan',
        component: TreatmentPlanGenerator,
        meta: { title: 'New Treatment Plan' }
      },
      
      {
        path: 'treatment-plans/:id',
        name: 'ViewTreatmentPlan',
        component: TreatmentPlanGenerator,
        meta: { title: 'View Treatment Plan' }
      },
      
      {
        path: 'task-templates',
        name: 'TaskTemplateManagement',
        component: TaskTemplateManagement,
        meta: { title: 'Task Template Management' }
      },
      
      {
        path: 'task-templates/new',
        name: 'NewTaskTemplate',
        component: TaskTemplateManagement,
        meta: { title: 'New Task Template' }
      },
      
      // AI Configuration
      {
        path: 'ai-configuration',
        name: 'AIConfiguration',
        component: AIConfiguration,
        meta: { title: 'AI Model Configuration' }
      },
      
      // System Administration Overview
      {
        path: 'system-admin',
        name: 'SystemAdmin',
        component: SystemAdmin,
        meta: { title: 'System Administration' }
      },
      
      // Clinic Management
      {
        path: 'clinic-management',
        name: 'ClinicManagement',
        component: ClinicManagement,
        meta: { title: 'Clinic Management' }
      },
      
      {
        path: 'clinic-management/register',
        name: 'ClinicRegistration',
        component: ClinicManagement,
        meta: { title: 'Register New Clinic' }
      },
      
      {
        path: 'clinic-management/settings',
        name: 'ClinicSettings',
        component: ClinicManagement,
        meta: { title: 'Clinic Settings' }
      },
      
      // Subscription Management
      {
        path: 'subscription-management',
        name: 'SubscriptionManagement',
        component: SubscriptionManagement,
        meta: { title: 'Subscription Management' }
      },
      
      {
        path: 'subscription-management/billing',
        name: 'BillingOverview',
        component: SubscriptionManagement,
        meta: { title: 'Billing Overview' }
      },
      
      {
        path: 'subscription-management/settings',
        name: 'SubscriptionSettings',
        component: SubscriptionManagement,
        meta: { title: 'Subscription Settings' }
      },
      
      // System Analytics
      {
        path: 'system-analytics',
        name: 'SystemAnalytics',
        component: SystemAnalytics,
        meta: { title: 'System Analytics' }
      },
      
      {
        path: 'system-analytics/usage',
        name: 'UsageAnalytics',
        component: SystemAnalytics,
        meta: { title: 'Usage Analytics' }
      },
      
      {
        path: 'system-analytics/performance',
        name: 'PerformanceReports',
        component: SystemAnalytics,
        meta: { title: 'Performance Reports' }
      },
      
      {
        path: 'system-analytics/metrics',
        name: 'SystemMetrics',
        component: SystemAnalytics,
        meta: { title: 'System Metrics' }
      },
      
      // Database Tools
      {
        path: 'database-tools',
        name: 'DatabaseTools',
        component: DatabaseTools,
        meta: { title: 'Database Tools' }
      },
      
      {
        path: 'database-tools/backup',
        name: 'DatabaseBackup',
        component: DatabaseTools,
        meta: { title: 'Database Backup' }
      },
      
      {
        path: 'database-tools/maintenance',
        name: 'DatabaseMaintenance',
        component: DatabaseTools,
        meta: { title: 'Database Maintenance' }
      },
      
      {
        path: 'database-tools/analytics',
        name: 'DatabaseAnalytics',
        component: DatabaseTools,
        meta: { title: 'Database Analytics' }
      },
      
      // Security Settings
      {
        path: 'security-settings',
        name: 'SecuritySettings',
        component: SecuritySettings,
        meta: { title: 'Security Settings' }
      },
      
      {
        path: 'security-settings/access-control',
        name: 'AccessControl',
        component: SecuritySettings,
        meta: { title: 'Access Control' }
      },
      
      {
        path: 'security-settings/audit-logs',
        name: 'AuditLogs',
        component: SecuritySettings,
        meta: { title: 'Audit Logs' }
      },
      
      {
        path: 'security-settings/policies',
        name: 'SecurityPolicies',
        component: SecuritySettings,
        meta: { title: 'Security Policies' }
      },
      
      // Profile
      {
        path: 'profile',
        name: 'ModeratorProfile',
        component: ModeratorProfile,
        meta: { title: 'Profile - Moderator Portal' }
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
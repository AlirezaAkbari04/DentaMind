<!--
  Doctor/Secretary Dashboard Component
  
  FIXED: Chat routing now correctly points to CommunicationHub
  - All chat quick actions route to /doctor-secretary/communication
  - Updated openChat and openPatientCommunication methods
-->
<template>
  <div class="p-4 space-y-6">
    <!-- Header Section -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">
            Good {{ getTimeOfDay() }}, {{ currentUser?.username }}
          </h1>
          <p class="text-slate-600">{{ getCurrentDate() }}</p>
        </div>
        <div class="flex items-center space-x-3">
          <!-- Quick Actions -->
          <button 
            v-if="userRole === 'doctor'"
            @click="openNewPatient"
            class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            New Patient
          </button>
          <button 
            v-if="userRole === 'secretary'"
            @click="openAppointmentBooking"
            class="bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Book Appointment
          </button>
        </div>
      </div>

      <!-- Key Metrics -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-blue-600 font-medium">Today's Patients</p>
              <p class="text-2xl font-bold text-blue-800">{{ todayStats.patients }}</p>
            </div>
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-green-50 rounded-lg p-4 border border-green-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-green-600 font-medium">Appointments</p>
              <p class="text-2xl font-bold text-green-800">{{ todayStats.appointments }}</p>
            </div>
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a1 1 0 001 1h6a1 1 0 001-1V11a1 1 0 00-1-1H9a1 1 0 00-1 1z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-yellow-600 font-medium">Pending Tasks</p>
              <p class="text-2xl font-bold text-yellow-800">{{ todayStats.pendingTasks }}</p>
            </div>
            <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-red-50 rounded-lg p-4 border border-red-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-red-600 font-medium">Urgent Alerts</p>
              <p class="text-2xl font-bold text-red-800">{{ todayStats.urgentAlerts }}</p>
            </div>
            <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Alerts Section -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-slate-800">Recent Alerts</h2>
        <span class="text-sm text-slate-500">{{ alerts.length }} active</span>
      </div>

      <div class="space-y-3">
        <div
          v-for="alert in alerts"
          :key="alert.id"
          class="flex items-start space-x-3 p-3 rounded-lg border"
          :class="getAlertClasses(alert.priority)"
        >
          <div 
            class="w-2 h-2 rounded-full mt-2"
            :class="getAlertDotColor(alert.priority)"
          ></div>
          <div class="flex-1">
            <p class="text-sm font-medium text-slate-800">{{ alert.message }}</p>
            <p class="text-xs text-slate-600">Patient: {{ alert.patient }} • {{ formatTimeAgo(alert.time) }}</p>
          </div>
          <button 
            @click="dismissAlert(alert.id)"
            class="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Today's Schedule -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-slate-800">Today's Schedule</h2>
        <button class="text-sm text-primary-600 hover:text-primary-700 font-medium">
          View All
        </button>
      </div>

      <div class="space-y-3">
        <div
          v-for="appointment in todayAppointments"
          :key="appointment.id"
          class="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <span class="text-sm font-medium text-slate-600">{{ appointment.patient.split(' ').map(n => n[0]).join('') }}</span>
            </div>
            <div>
              <p class="font-medium text-slate-800">{{ appointment.patient }}</p>
              <p class="text-sm text-slate-600">{{ appointment.procedure }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm font-medium text-slate-800">{{ appointment.time }}</p>
            <span 
              class="text-xs px-2 py-1 rounded-full"
              :class="getAppointmentStatusClasses(appointment.status)"
            >
              {{ appointment.status }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Patients -->
    <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-slate-800">Recent Patients</h2>
        <div class="flex items-center space-x-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search patients..."
            class="px-3 py-1 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
        </div>
      </div>

      <div class="space-y-3">
        <div
          v-for="patient in filteredPatients"
          :key="patient.id"
          class="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          @click="viewPatient(patient.id)"
        >
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <span class="text-sm font-medium text-slate-600">{{ patient.name.split(' ').map(n => n[0]).join('') }}</span>
            </div>
            <div>
              <p class="font-medium text-slate-800">{{ patient.name }}</p>
              <p class="text-sm text-slate-600">Last visit: {{ formatDate(patient.lastVisit) }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <span 
              class="text-xs px-2 py-1 rounded-full"
              :class="getHealthStatusClasses(patient.healthStatus)"
            >
              {{ patient.healthStatus }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 class="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
      
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Doctor Specific Actions -->
        <template v-if="userRole === 'doctor'">
          <button 
            @click="openClinicalNotes"
            class="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-slate-700">Clinical Notes</span>
          </button>

          <button 
            @click="openAIDiagnostics"
            class="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-slate-700">AI Diagnostics</span>
          </button>

          <button 
            @click="openTaskTemplates"
            class="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span class="text-sm font-medium text-slate-700">Task Templates</span>
          </button>
        </template>

        <!-- Secretary Specific Actions -->
        <template v-if="userRole === 'secretary'">
          <button 
            @click="openAppointmentApproval"
            class="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-slate-700">Approve Appointments</span>
          </button>

          <button 
            @click="openReminderSystem"
            class="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-2">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5V9a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-slate-700">Send Reminders</span>
          </button>
        </template>

        <!-- FIXED: Chat Quick Action - Now routes to CommunicationHub -->
        <button 
          @click="openChat"
          class="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <span class="text-sm font-medium text-slate-700">Patient Chat</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'DoctorSecretaryDashboard',
  emits: ['show-toast', 'show-error', 'show-success'],
  setup(props, { emit }) {
    const router = useRouter()
    const authStore = useAuthStore()
    
    // ==========================================
    // REACTIVE STATE
    // ==========================================
    
    const searchQuery = ref('')
    const isLoading = ref(false)
    
    // Mock data - replace with API calls
    const todayStats = ref({
      patients: 12,
      appointments: 8,
      pendingTasks: 5,
      urgentAlerts: 2
    })
    
    const alerts = ref([
      {
        id: 1,
        message: 'High blood pressure detected during screening',
        patient: 'John Smith',
        priority: 'high',
        time: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
      },
      {
        id: 2,
        message: 'Follow-up appointment overdue',
        patient: 'Sarah Johnson',
        priority: 'medium',
        time: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        id: 3,
        message: 'Lab results ready for review',
        patient: 'Mike Davis',
        priority: 'low',
        time: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
      }
    ])
    
    const todayAppointments = ref([
      {
        id: 1,
        patient: 'Emma Wilson',
        procedure: 'Routine Cleaning',
        time: '09:00 AM',
        status: 'Confirmed'
      },
      {
        id: 2,
        patient: 'David Brown',
        procedure: 'Root Canal',
        time: '10:30 AM',
        status: 'Scheduled'
      },
      {
        id: 3,
        patient: 'Lisa Chen',
        procedure: 'Consultation',
        time: '02:00 PM',
        status: 'Confirmed'
      }
    ])
    
    const recentPatients = ref([
      {
        id: 1,
        name: 'Alex Thompson',
        lastVisit: '2024-01-15',
        healthStatus: 'Good'
      },
      {
        id: 2,
        name: 'Maria Garcia',
        lastVisit: '2024-01-14',
        healthStatus: 'Needs Attention'
      },
      {
        id: 3,
        name: 'Robert Taylor',
        lastVisit: '2024-01-13',
        healthStatus: 'Excellent'
      }
    ])
    
    // ==========================================
    // COMPUTED PROPERTIES
    // ==========================================
    
    const currentUser = computed(() => authStore.user)
    const userRole = computed(() => authStore.user?.role)
    
    const filteredPatients = computed(() => {
      if (!searchQuery.value) return recentPatients.value
      
      return recentPatients.value.filter(patient =>
        patient.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    })
    
    // ==========================================
    // UTILITY METHODS
    // ==========================================
    
    const getTimeOfDay = () => {
      const hour = new Date().getHours()
      if (hour < 12) return 'Morning'
      if (hour < 17) return 'Afternoon'
      return 'Evening'
    }
    
    const getCurrentDate = () => {
      return new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
    
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    }
    
    const formatTimeAgo = (date) => {
      const now = new Date()
      const diffMs = now - new Date(date)
      const diffMins = Math.floor(diffMs / (1000 * 60))
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      
      if (diffMins < 60) {
        return `${diffMins} min ago`
      } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
      } else {
        return formatDate(date)
      }
    }
    
    const getAlertClasses = (priority) => {
      switch (priority) {
        case 'high':
          return 'border-red-200 bg-red-50'
        case 'medium':
          return 'border-yellow-200 bg-yellow-50'
        case 'low':
          return 'border-blue-200 bg-blue-50'
        default:
          return 'border-gray-200 bg-gray-50'
      }
    }
    
    const getAlertDotColor = (priority) => {
      switch (priority) {
        case 'high':
          return 'bg-red-500'
        case 'medium':
          return 'bg-yellow-500'
        case 'low':
          return 'bg-blue-500'
        default:
          return 'bg-gray-500'
      }
    }
    
    const getAppointmentStatusClasses = (status) => {
      switch (status) {
        case 'Confirmed':
          return 'bg-green-100 text-green-800'
        case 'Scheduled':
          return 'bg-blue-100 text-blue-800'
        case 'Completed':
          return 'bg-gray-100 text-gray-800'
        case 'Cancelled':
          return 'bg-red-100 text-red-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }
    
    const getHealthStatusClasses = (status) => {
      switch (status) {
        case 'Excellent':
          return 'bg-green-100 text-green-800'
        case 'Good':
          return 'bg-blue-100 text-blue-800'
        case 'Needs Attention':
          return 'bg-yellow-100 text-yellow-800'
        case 'Poor':
          return 'bg-red-100 text-red-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }
    
    // ==========================================
    // ACTION METHODS
    // ==========================================
    
    const dismissAlert = (alertId) => {
      alerts.value = alerts.value.filter(alert => alert.id !== alertId)
      emit('show-success', 'Alert dismissed')
    }
    
    const viewPatient = (patientId) => {
      router.push(`/doctor-secretary/patients/${patientId}`)
    }
    
    // Quick action methods - FIXED ROUTING
    const openNewPatient = () => {
      router.push('/doctor-secretary/patients/new')
    }
    
    const openAppointmentBooking = () => {
      router.push('/doctor-secretary/appointments/new')
    }
    
    const openClinicalNotes = () => {
      router.push('/doctor-secretary/clinical-notes')
    }
    
    const openAIDiagnostics = () => {
      router.push('/doctor-secretary/ai-diagnostics')
    }
    
    const openTaskTemplates = () => {
      router.push('/doctor-secretary/task-templates')
    }
    
    const openAppointmentApproval = () => {
      router.push('/doctor-secretary/appointment-approval')
    }
    
    const openReminderSystem = () => {
      router.push('/doctor-secretary/reminder-system')
    }
    
    // FIXED: All chat-related methods now route to CommunicationHub
    const openChat = () => {
      router.push('/doctor-secretary/communication')
    }
    
    const openPatientCommunication = () => {
      router.push('/doctor-secretary/communication')
    }
    
    // Data loading method
    const loadDashboardData = async () => {
      isLoading.value = true
      try {
        // TODO: Replace with actual API calls
        emit('show-success', 'Dashboard data loaded successfully')
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        emit('show-error', 'Failed to load dashboard data')
      } finally {
        isLoading.value = false
      }
    }
    
    // ==========================================
    // LIFECYCLE
    // ==========================================
    
    onMounted(() => {
      loadDashboardData()
    })
    
    // ==========================================
    // RETURN FOR TEMPLATE
    // ==========================================
    
    return {
      // State
      searchQuery,
      isLoading,
      todayStats,
      alerts,
      todayAppointments,
      recentPatients,
      
      // Computed
      currentUser,
      userRole,
      filteredPatients,
      
      // Methods
      getTimeOfDay,
      getCurrentDate,
      formatDate,
      formatTimeAgo,
      getAlertClasses,
      getAlertDotColor,
      getAppointmentStatusClasses,
      getHealthStatusClasses,
      dismissAlert,
      viewPatient,
      openNewPatient,
      openAppointmentBooking,
      openClinicalNotes,
      openAIDiagnostics,
      openTaskTemplates,
      openAppointmentApproval,
      openPatientCommunication,
      openReminderSystem,
      openChat,
      loadDashboardData
    }
  }
}
</script>

<style scoped>
/* Custom styles for better visual hierarchy */
.grid {
  display: grid;
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.grid-cols-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

@media (min-width: 768px) {
  .md\\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .lg\\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  
  .lg\\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

/* Hover effects for interactive elements */
.hover\\:bg-gray-50:hover {
  background-color: #f9fafb;
}

.hover\\:bg-primary-700:hover {
  background-color: #0052a3;
}

.hover\\:bg-secondary-700:hover {
  background-color: #047857;
}

.hover\\:text-primary-700:hover {
  color: #0052a3;
}

.hover\\:text-slate-600:hover {
  color: #475569;
}

/* Transition effects */
.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Custom color classes */
.bg-primary-600 { background-color: #0066CC; }
.bg-primary-700 { background-color: #0052a3; }
.bg-secondary-600 { background-color: #00A86B; }
.bg-secondary-700 { background-color: #047857; }
.text-primary-600 { color: #0066CC; }
.text-primary-700 { color: #0052a3; }

/* Loading states */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

/* Scrollbar styling */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
<!--
  Doctor/Secretary Dashboard Component
  
  Central hub showing:
  - Patient list with quick actions
  - Alerts and notifications
  - Quick action buttons
  - Daily schedule overview
  - Key metrics and statistics
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
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Alerts Section -->
    <div v-if="alerts.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 class="text-xl font-semibold text-slate-800 mb-4 flex items-center">
        <svg class="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        Priority Alerts
      </h2>
      
      <div class="space-y-3">
        <div
          v-for="alert in alerts"
          :key="alert.id"
          class="flex items-center justify-between p-4 rounded-lg border"
          :class="getAlertClasses(alert.priority)"
        >
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <div 
                class="w-3 h-3 rounded-full"
                :class="getAlertDotColor(alert.priority)"
              ></div>
            </div>
            <div>
              <p class="font-medium text-slate-800">{{ alert.message }}</p>
              <p class="text-sm text-slate-600">{{ alert.patient }} • {{ formatTimeAgo(alert.time) }}</p>
            </div>
          </div>
          <button 
            @click="dismissAlert(alert.id)"
            class="text-slate-400 hover:text-slate-600 p-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Today's Schedule & Patient List -->
    <div class="grid lg:grid-cols-2 gap-6">
      <!-- Today's Schedule -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-slate-800">Today's Schedule</h2>
          <router-link 
            :to="userRole === 'secretary' ? '/doctor-secretary/scheduling-dashboard' : '/doctor-secretary/appointments'"
            class="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View All
          </router-link>
        </div>
        
        <div class="space-y-3 max-h-80 overflow-y-auto">
          <div
            v-for="appointment in todayAppointments"
            :key="appointment.id"
            class="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center space-x-3">
              <div class="text-center">
                <div class="text-sm font-medium text-slate-800">{{ appointment.time }}</div>
                <div class="text-xs text-slate-500">{{ appointment.duration }}</div>
              </div>
              <div class="flex-1">
                <p class="font-medium text-slate-800">{{ appointment.patientName }}</p>
                <p class="text-sm text-slate-600">{{ appointment.treatment }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span 
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                :class="getAppointmentStatusClasses(appointment.status)"
              >
                {{ appointment.status }}
              </span>
              <button 
                @click="viewPatient(appointment.patientId)"
                class="text-primary-600 hover:text-primary-700 p-1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>
          
          <div v-if="todayAppointments.length === 0" class="text-center py-8">
            <svg class="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a1 1 0 001 1h6a1 1 0 001-1V11a1 1 0 00-1-1H9a1 1 0 00-1 1z" />
            </svg>
            <p class="text-slate-500">No appointments scheduled for today</p>
          </div>
        </div>
      </div>

      <!-- Patient List -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-slate-800">Recent Patients</h2>
          <router-link 
            to="/doctor-secretary/patients"
            class="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View All
          </router-link>
        </div>
        
        <!-- Search Bar -->
        <div class="relative mb-4">
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="Search patients..."
            class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
          <svg class="w-5 h-5 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <div class="space-y-3 max-h-80 overflow-y-auto">
          <div
            v-for="patient in filteredPatients"
            :key="patient.id"
            class="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
            @click="viewPatient(patient.id)"
          >
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                <span class="text-sm font-medium text-slate-600">
                  {{ patient.name.split(' ').map(n => n[0]).join('') }}
                </span>
              </div>
              <div>
                <p class="font-medium text-slate-800">{{ patient.name }}</p>
                <p class="text-sm text-slate-600">Last visit: {{ formatDate(patient.lastVisit) }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span 
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                :class="getHealthStatusClasses(patient.healthStatus)"
              >
                {{ patient.healthStatus }}
              </span>
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          
          <div v-if="filteredPatients.length === 0" class="text-center py-8">
            <svg class="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p class="text-slate-500">No patients found</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 class="text-xl font-semibold text-slate-800 mb-4">Quick Actions</h2>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <!-- Doctor Quick Actions -->
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

        <!-- Secretary Quick Actions -->
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
            @click="openPatientCommunication"
            class="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-slate-700">Patient Communication</span>
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

        <!-- Common Quick Action -->
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
        message: 'Patient requested appointment rescheduling',
        patient: 'Mike Davis',
        priority: 'low',
        time: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
      }
    ])
    
    const todayAppointments = ref([
      {
        id: 1,
        time: '9:00 AM',
        duration: '30 min',
        patientName: 'John Smith',
        patientId: 'P001',
        treatment: 'Routine Cleaning',
        status: 'confirmed'
      },
      {
        id: 2,
        time: '10:30 AM',
        duration: '45 min',
        patientName: 'Sarah Johnson',
        patientId: 'P002',
        treatment: 'Cavity Filling',
        status: 'in-progress'
      },
      {
        id: 3,
        time: '2:00 PM',
        duration: '60 min',
        patientName: 'Mike Davis',
        patientId: 'P003',
        treatment: 'Root Canal',
        status: 'scheduled'
      },
      {
        id: 4,
        time: '3:30 PM',
        duration: '30 min',
        patientName: 'Emily Wilson',
        patientId: 'P004',
        treatment: 'Consultation',
        status: 'pending'
      }
    ])
    
    const recentPatients = ref([
      {
        id: 'P001',
        name: 'John Smith',
        lastVisit: new Date('2024-01-05'),
        healthStatus: 'Good'
      },
      {
        id: 'P002',
        name: 'Sarah Johnson',
        lastVisit: new Date('2024-01-03'),
        healthStatus: 'Needs Attention'
      },
      {
        id: 'P003',
        name: 'Mike Davis',
        lastVisit: new Date('2024-01-02'),
        healthStatus: 'Excellent'
      },
      {
        id: 'P004',
        name: 'Emily Wilson',
        lastVisit: new Date('2023-12-28'),
        healthStatus: 'Poor'
      },
      {
        id: 'P005',
        name: 'Robert Brown',
        lastVisit: new Date('2023-12-25'),
        healthStatus: 'Good'
      }
    ])
    
    // ==========================================
    // COMPUTED PROPERTIES
    // ==========================================
    
    const currentUser = computed(() => authStore.user)
    const userRole = computed(() => authStore.user?.role)
    
    const filteredPatients = computed(() => {
      if (!searchQuery.value) return recentPatients.value.slice(0, 5)
      
      return recentPatients.value.filter(patient =>
        patient.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      ).slice(0, 5)
    })
    
    // ==========================================
    // METHODS
    // ==========================================
    
    const getTimeOfDay = () => {
      const hour = new Date().getHours()
      if (hour < 12) return 'Morning'
      if (hour < 18) return 'Afternoon'
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
      const diffInMinutes = Math.floor((now - new Date(date)) / (1000 * 60))
      
      if (diffInMinutes < 60) {
        return `${diffInMinutes}m ago`
      } else if (diffInMinutes < 1440) {
        return `${Math.floor(diffInMinutes / 60)}h ago`
      } else {
        return `${Math.floor(diffInMinutes / 1440)}d ago`
      }
    }
    
    // Alert styling methods
    const getAlertClasses = (priority) => {
      switch (priority) {
        case 'high':
          return 'border-red-200 bg-red-50'
        case 'medium':
          return 'border-yellow-200 bg-yellow-50'
        default:
          return 'border-blue-200 bg-blue-50'
      }
    }
    
    const getAlertDotColor = (priority) => {
      switch (priority) {
        case 'high':
          return 'bg-red-500'
        case 'medium':
          return 'bg-yellow-500'
        default:
          return 'bg-blue-500'
      }
    }
    
    const getAppointmentStatusClasses = (status) => {
      switch (status) {
        case 'confirmed':
          return 'bg-green-100 text-green-800'
        case 'in-progress':
          return 'bg-blue-100 text-blue-800'
        case 'scheduled':
          return 'bg-gray-100 text-gray-800'
        case 'pending':
          return 'bg-yellow-100 text-yellow-800'
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
    
    // Action methods
    const dismissAlert = (alertId) => {
      alerts.value = alerts.value.filter(alert => alert.id !== alertId)
      emit('show-success', 'Alert dismissed')
    }
    
    const viewPatient = (patientId) => {
      router.push(`/doctor-secretary/patients/${patientId}`)
    }
    
    // Quick action methods
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
    
    const openPatientCommunication = () => {
      router.push('/doctor-secretary/patient-communication')
    }
    
    const openReminderSystem = () => {
      router.push('/doctor-secretary/reminder-system')
    }
    
    const openChat = () => {
      router.push('/doctor-secretary/chat')
    }
    
    // Data loading method
    const loadDashboardData = async () => {
      isLoading.value = true
      try {
        // TODO: Replace with actual API calls
        // const [statsResponse, alertsResponse, appointmentsResponse, patientsResponse] = await Promise.all([
        //   api.get('/dashboard/stats'),
        //   api.get('/dashboard/alerts'),
        //   api.get('/dashboard/appointments/today'),
        //   api.get('/dashboard/patients/recent')
        // ])
        
        // todayStats.value = statsResponse.data
        // alerts.value = alertsResponse.data
        // todayAppointments.value = appointmentsResponse.data
        // recentPatients.value = patientsResponse.data
        
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
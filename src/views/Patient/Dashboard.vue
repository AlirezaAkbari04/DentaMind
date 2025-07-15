<!-- Patient Dashboard - Main Content Only -->
<template>
  <div class="px-4 py-6 space-y-6">
    <!-- Health Summary Card -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-slate-800">Health Summary</h2>
        <div class="flex items-center space-x-2">
          <div class="w-3 h-3 bg-green-500 rounded-full"></div>
          <span class="text-sm text-slate-600">Good</span>
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-blue-50 rounded-lg p-4">
          <div class="text-2xl font-bold text-primary-600">{{ healthMetrics.oralHealth }}%</div>
          <div class="text-sm text-slate-600">Oral Health Score</div>
        </div>
        <div class="bg-green-50 rounded-lg p-4">
          <div class="text-2xl font-bold text-secondary-600">{{ healthMetrics.compliance }}%</div>
          <div class="text-sm text-slate-600">Task Compliance</div>
        </div>
      </div>

      <div class="mt-4 space-y-2">
        <div v-for="alert in healthAlerts" :key="alert.id" 
             class="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
          <svg class="w-5 h-5 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
          <span class="text-sm text-slate-700">{{ alert.message }}</span>
        </div>
      </div>
    </div>

    <!-- Appointments Section -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-slate-800">Upcoming Appointments</h2>
        <button 
          @click="requestAppointment"
          class="text-primary-600 text-sm font-medium hover:text-primary-700"
        >
          Request New
        </button>
      </div>

      <div v-if="appointments.length === 0" class="text-center py-8">
        <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <p class="text-gray-500">No upcoming appointments</p>
      </div>

      <div v-else class="space-y-3">
        <div v-for="appointment in appointments" :key="appointment.id"
             class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <div>
              <div class="font-medium text-slate-800">{{ appointment.doctorName }}</div>
              <div class="text-sm text-slate-600">{{ appointment.type }}</div>
            </div>
          </div>
          <div class="text-right">
            <div class="font-medium text-slate-800">{{ formatDate(appointment.date) }}</div>
            <div class="text-sm text-slate-600">{{ appointment.time }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Care Timeline -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 class="text-xl font-semibold text-slate-800 mb-4">Care Timeline</h2>
      
      <div class="max-h-64 overflow-y-auto space-y-4">
        <div
          v-for="item in careTimeline"
          :key="item.id"
          class="flex items-start space-x-3"
        >
          <div
            class="flex-shrink-0 w-3 h-3 rounded-full mt-2"
            :class="getTimelineColor(item.type)"
          ></div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-slate-800">{{ item.title }}</p>
              <span class="text-xs text-slate-500">{{ formatTimeAgo(item.date) }}</span>
            </div>
            <p class="text-sm text-slate-600 mt-1">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'PatientDashboard',
  setup() {
    const router = useRouter()
    
    // Sample data - will be replaced with API calls
    const healthMetrics = ref({
      oralHealth: 87,
      compliance: 92
    })
    
    const healthAlerts = ref([
      { id: 1, message: 'Checkup due in 3 days' },
      { id: 2, message: 'Upload oral photo for weekly review' }
    ])
    
    const appointments = ref([
      {
        id: 1,
        doctorName: 'Dr. Smith',
        type: 'Regular Checkup',
        date: new Date('2024-07-10'),
        time: '10:00 AM'
      }
    ])
    
    const careTimeline = ref([
      {
        id: 1,
        title: 'Photo Analysis Completed',
        description: 'AI analysis shows improvement in gum health',
        date: new Date('2024-07-05'),
        type: 'analysis'
      },
      {
        id: 2,
        title: 'Task Completed',
        description: 'Completed daily fluoride rinse',
        date: new Date('2024-07-04'),
        type: 'task'
      },
      {
        id: 3,
        title: 'Appointment Scheduled',
        description: 'Cleaning appointment with Dr. Smith',
        date: new Date('2024-07-03'),
        type: 'appointment'
      }
    ])

    const requestAppointment = () => {
      router.push('/patient/all-appointments')
    }

    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    const formatTimeAgo = (date) => {
      const now = new Date()
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
      
      if (diffInHours < 24) {
        return `${diffInHours}h ago`
      } else {
        const diffInDays = Math.floor(diffInHours / 24)
        return `${diffInDays}d ago`
      }
    }

    const getTimelineColor = (type) => {
      switch (type) {
        case 'analysis': return 'bg-blue-500'
        case 'task': return 'bg-green-500'
        case 'appointment': return 'bg-orange-500'
        default: return 'bg-gray-500'
      }
    }

    return {
      healthMetrics,
      healthAlerts,
      appointments,
      careTimeline,
      requestAppointment,
      formatDate,
      formatTimeAgo,
      getTimelineColor
    }
  }
}
</script>

<style scoped>
/* Custom scrollbar for care timeline */
.max-h-64::-webkit-scrollbar {
  width: 4px;
}

.max-h-64::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 2px;
}

.max-h-64::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.max-h-64::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Ensure proper color classes are available */
.bg-primary-600 { background-color: #0066CC; }
.bg-primary-100 { background-color: #e6f3ff; }
.text-primary-600 { color: #0066CC; }
.text-primary-700 { color: #0052a3; }
.bg-secondary-600 { background-color: #00A86B; }
.bg-secondary-50 { background-color: #f0fdf4; }
.text-secondary-600 { color: #00A86B; }
.bg-accent-500 { background-color: #FF6B35; }
.bg-accent-600 { background-color: #e55a2b; }
.bg-neutral-50 { background-color: #F8FAFC; }
</style>
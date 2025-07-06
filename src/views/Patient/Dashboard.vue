<!-- Patient Dashboard - Main Layout Component -->
<template>
  <div class="min-h-screen bg-neutral-50 pb-20">
    <!-- Top Header -->
    <header class="bg-white shadow-sm border-b border-gray-100 px-4 py-3 flex justify-between items-center">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
          <span class="text-white text-sm font-semibold">{{ userInitials }}</span>
        </div>
        <div>
          <h1 class="text-lg font-semibold text-slate-800">Welcome, {{ userName }}</h1>
          <p class="text-sm text-slate-500">{{ currentDate }}</p>
        </div>
      </div>
      
      <!-- Hamburger Menu Button -->
      <button 
        @click="toggleHamburgerMenu"
        class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <svg class="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
    </header>

    <!-- Main Content -->
    <main class="px-4 py-6 space-y-6">
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
    </main>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div class="flex justify-around items-center">
        <!-- Task Management -->
        <router-link to="/patient/tasks" 
                     class="flex flex-col items-center space-y-1 p-3 rounded-lg transition-colors"
                     :class="$route.path === '/patient/tasks' ? 'text-secondary-600 bg-secondary-50' : 'text-slate-600 hover:text-slate-800'">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
          </svg>
          <span class="text-xs font-medium">Tasks</span>
        </router-link>

        <!-- Dashboard -->
        <router-link to="/patient/dashboard" 
                     class="flex flex-col items-center space-y-1 p-3 rounded-lg transition-colors"
                     :class="$route.path === '/patient/dashboard' ? 'text-secondary-600 bg-secondary-50' : 'text-slate-600 hover:text-slate-800'">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z M3 7l9 6 9-6"></path>
          </svg>
          <span class="text-xs font-medium">Dashboard</span>
        </router-link>

        <!-- Medical Records -->
        <router-link to="/patient/medical-records" 
                     class="flex flex-col items-center space-y-1 p-3 rounded-lg transition-colors"
                     :class="$route.path === '/patient/medical-records' ? 'text-secondary-600 bg-secondary-50' : 'text-slate-600 hover:text-slate-800'">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <span class="text-xs font-medium">Records</span>
        </router-link>
      </div>
    </nav>

    <!-- Floating Chat Button -->
    <button 
      @click="openChat"
      class="fixed bottom-24 right-4 w-14 h-14 bg-accent-500 hover:bg-accent-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
      </svg>
    </button>

    <!-- Hamburger Menu Overlay -->
    <div v-if="showHamburgerMenu" 
         class="fixed inset-0 bg-black bg-opacity-50 z-50"
         @click="toggleHamburgerMenu">
      <div class="absolute right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform"
           :class="showHamburgerMenu ? 'translate-x-0' : 'translate-x-full'"
           @click.stop>
        
        <!-- Menu Header -->
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-slate-800">Menu</h3>
            <button @click="toggleHamburgerMenu" class="p-2 rounded-lg hover:bg-gray-100">
              <svg class="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Menu Items -->
        <nav class="p-4 space-y-2">
          <router-link to="/patient/family" 
                       class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                       @click="toggleHamburgerMenu">
            <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <span class="text-slate-800">Family Management</span>
          </router-link>

          <router-link to="/patient/all-appointments" 
                       class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                       @click="toggleHamburgerMenu">
            <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span class="text-slate-800">All Appointments</span>
          </router-link>

          <router-link to="/patient/profile" 
                       class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                       @click="toggleHamburgerMenu">
            <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            <span class="text-slate-800">Profile & Settings</span>
          </router-link>

          <router-link to="/patient/notifications" 
                       class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                       @click="toggleHamburgerMenu">
            <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM12 17.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z M6 2v6l-3-3M6 2l3 3-3-3"></path>
            </svg>
            <span class="text-slate-800">Notifications</span>
          </router-link>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
/* eslint-disable vue/no-unused-vars */
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'PatientDashboard',
  setup() {
    const router = useRouter()
    const showHamburgerMenu = ref(false)
    
    // Sample data - will be replaced with API calls
    const userName = ref('Sarah Johnson')
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

    const userInitials = computed(() => {
      return userName.value.split(' ').map(n => n[0]).join('')
    })

    const currentDate = computed(() => {
      return new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    })

    const toggleHamburgerMenu = () => {
      showHamburgerMenu.value = !showHamburgerMenu.value
    }

    const openChat = () => {
      router.push('/patient/chat')
    }

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
      showHamburgerMenu,
      userName,
      userInitials,
      currentDate,
      healthMetrics,
      healthAlerts,
      appointments,
      careTimeline,
      toggleHamburgerMenu,
      openChat,
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
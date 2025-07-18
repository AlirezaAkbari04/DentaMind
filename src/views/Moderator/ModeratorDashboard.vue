<!--
  Moderator Dashboard Component
  
  Main dashboard for moderator interface with:
  - System overview and key metrics
  - Quick actions for treatment plans and task templates
  - System health monitoring
  - Recent activity feed
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
            @click="openTreatmentPlanGenerator"
            class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            New Treatment Plan
          </button>
          <button 
            @click="openTaskTemplateCreator"
            class="bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            New Task Template
          </button>
        </div>
      </div>

      <!-- Key Metrics -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-blue-600 font-medium">Treatment Plans</p>
              <p class="text-2xl font-bold text-blue-800">{{ systemStats.treatmentPlans }}</p>
            </div>
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-green-50 rounded-lg p-4 border border-green-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-green-600 font-medium">Task Templates</p>
              <p class="text-2xl font-bold text-green-800">{{ systemStats.taskTemplates }}</p>
            </div>
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-purple-50 rounded-lg p-4 border border-purple-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-purple-600 font-medium">System Health</p>
              <p class="text-2xl font-bold text-purple-800">{{ systemStats.healthScore }}%</p>
            </div>
            <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-orange-50 rounded-lg p-4 border border-orange-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-orange-600 font-medium">Active Clinics</p>
              <p class="text-2xl font-bold text-orange-800">{{ systemStats.activeClinics }}</p>
            </div>
            <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- System Alerts -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-slate-800">System Alerts</h2>
        <span class="text-sm text-slate-500">{{ systemAlerts.length }} active</span>
      </div>

      <div class="space-y-3">
        <div
          v-for="alert in systemAlerts"
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
            <p class="text-xs text-slate-600">{{ alert.component }} • {{ formatTimeAgo(alert.time) }}</p>
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

    <!-- Recent Treatment Plans -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-slate-800">Recent Treatment Plans</h2>
        <button 
          @click="openTreatmentPlans"
          class="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View All
        </button>
      </div>

      <div class="space-y-3">
        <div
          v-for="plan in recentTreatmentPlans"
          :key="plan.id"
          class="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          @click="viewTreatmentPlan(plan.id)"
        >
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p class="font-medium text-slate-800">{{ plan.patient }}</p>
              <p class="text-sm text-slate-600">{{ plan.type }} • {{ plan.procedures.length }} procedures</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm font-medium text-slate-800">{{ formatDate(plan.createdAt) }}</p>
            <span 
              class="text-xs px-2 py-1 rounded-full"
              :class="getPlanStatusClasses(plan.status)"
            >
              {{ plan.status }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions Grid -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 class="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
      
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <button 
          @click="openTreatmentPlanRequests"
          class="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-2">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 8h6m-6 4h6" />
            </svg>
          </div>
          <span class="text-sm font-medium text-slate-700">Plan Requests</span>
        </button>

        <!-- Treatment Plan Generator -->
        <button 
          @click="openTreatmentPlanGenerator"
          class="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </div>
          <span class="text-sm font-medium text-slate-700">Treatment Plans</span>
        </button>

        <!-- Task Template Management -->
        <button 
          @click="openTaskTemplates"
          class="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <span class="text-sm font-medium text-slate-700">Task Templates</span>
        </button>

        <!-- System Analytics -->
        <button 
          @click="openSystemAnalytics"
          class="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span class="text-sm font-medium text-slate-700">System Analytics</span>
        </button>

        <!-- AI Configuration -->
        <button 
          @click="openAIConfiguration"
          class="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <span class="text-sm font-medium text-slate-700">AI Configuration</span>
        </button>
      </div>
    </div>

    <!-- System Overview -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 class="text-lg font-semibold text-slate-800 mb-4">System Overview</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Recent Activity -->
        <div>
          <h3 class="text-sm font-medium text-slate-600 mb-3">Recent Activity</h3>
          <div class="space-y-3">
            <div
              v-for="activity in recentActivity"
              :key="activity.id"
              class="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-sm text-slate-800">{{ activity.description }}</p>
                <p class="text-xs text-slate-500">{{ formatTimeAgo(activity.timestamp) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- System Status -->
        <div>
          <h3 class="text-sm font-medium text-slate-600 mb-3">System Status</h3>
          <div class="space-y-3">
            <div
              v-for="service in systemStatus"
              :key="service.name"
              class="flex items-center justify-between p-2 rounded-lg"
            >
              <span class="text-sm text-slate-700">{{ service.name }}</span>
              <div class="flex items-center space-x-2">
                <div 
                  class="w-2 h-2 rounded-full"
                  :class="service.status === 'healthy' ? 'bg-green-500' : service.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'"
                ></div>
                <span class="text-xs text-slate-500">{{ service.uptime }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'ModeratorDashboard',
  emits: ['show-toast', 'show-error', 'show-success'],
  setup(props, { emit }) {
    const router = useRouter()
    const authStore = useAuthStore()
    
    // ==========================================
    // REACTIVE STATE
    // ==========================================
    
    const isLoading = ref(false)
    
    // Mock data - replace with API calls
    const systemStats = ref({
      treatmentPlans: 47,
      taskTemplates: 23,
      healthScore: 98,
      activeClinics: 12
    })
    
    const systemAlerts = ref([
      {
        id: 1,
        message: 'AI model performance below threshold for treatment plan generation',
        component: 'AI Service',
        priority: 'high',
        time: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
      },
      {
        id: 2,
        message: 'Database backup completed successfully',
        component: 'Database',
        priority: 'low',
        time: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        id: 3,
        message: 'High task template usage detected',
        component: 'Task Management',
        priority: 'medium',
        time: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
      }
    ])
    
    const recentTreatmentPlans = ref([
      {
        id: 1,
        patient: 'Sarah Johnson',
        type: 'Comprehensive',
        procedures: ['Cleaning', 'Filling', 'Crown'],
        status: 'Active',
        createdAt: '2024-01-15'
      },
      {
        id: 2,
        patient: 'Mike Chen',
        type: 'Orthodontic',
        procedures: ['Braces', 'Regular Checkups'],
        status: 'Draft',
        createdAt: '2024-01-14'
      },
      {
        id: 3,
        patient: 'Emma Wilson',
        type: 'Preventive',
        procedures: ['Cleaning', 'Fluoride Treatment'],
        status: 'Completed',
        createdAt: '2024-01-13'
      }
    ])
    
    const recentActivity = ref([
      {
        id: 1,
        description: 'New treatment plan created for patient Sarah Johnson',
        timestamp: new Date(Date.now() - 30 * 60 * 1000)
      },
      {
        id: 2,
        description: 'Task template "Post-Surgery Care" was updated',
        timestamp: new Date(Date.now() - 60 * 60 * 1000)
      },
      {
        id: 3,
        description: 'AI model configuration updated',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 4,
        description: 'System backup completed',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
      }
    ])
    
    const systemStatus = ref([
      { name: 'Database', status: 'healthy', uptime: '99.9%' },
      { name: 'AI Service', status: 'warning', uptime: '97.2%' },
      { name: 'Web Server', status: 'healthy', uptime: '99.8%' },
      { name: 'Authentication', status: 'healthy', uptime: '100%' }
    ])
    
    // ==========================================
    // COMPUTED PROPERTIES
    // ==========================================
    
    const currentUser = computed(() => authStore.user)
    
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
    
    const getPlanStatusClasses = (status) => {
      switch (status) {
        case 'Active':
          return 'bg-green-100 text-green-800'
        case 'Draft':
          return 'bg-blue-100 text-blue-800'
        case 'Completed':
          return 'bg-gray-100 text-gray-800'
        case 'Cancelled':
          return 'bg-red-100 text-red-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }
    
    // ==========================================
    // ACTION METHODS
    // ==========================================
    
    const dismissAlert = (alertId) => {
      systemAlerts.value = systemAlerts.value.filter(alert => alert.id !== alertId)
      emit('show-success', 'Alert dismissed')
    }
    
    const viewTreatmentPlan = (planId) => {
      router.push(`/moderator/treatment-plans/${planId}`)
    }
    
    // Quick action methods
    const openTreatmentPlanGenerator = () => {
      router.push('/moderator/treatment-plans/new')
    }
    
    const openTaskTemplateCreator = () => {
      router.push('/moderator/task-templates/new')
    }

    const openTreatmentPlanRequests = () => {
      router.push('/moderator/treatment-plan-requests')
    }
    
    const openTreatmentPlans = () => {
      router.push('/moderator/treatment-plans')
    }
    
    const openTaskTemplates = () => {
      router.push('/moderator/task-templates')
    }
    
    const openSystemAnalytics = () => {
      router.push('/moderator/system-analytics')
    }
    
    const openAIConfiguration = () => {
      router.push('/moderator/ai-configuration')
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
      isLoading,
      systemStats,
      systemAlerts,
      recentTreatmentPlans,
      recentActivity,
      systemStatus,
      
      // Computed
      currentUser,
      
      // Methods
      getTimeOfDay,
      getCurrentDate,
      formatDate,
      formatTimeAgo,
      getAlertClasses,
      getAlertDotColor,
      getPlanStatusClasses,
      dismissAlert,
      viewTreatmentPlan,
      openTreatmentPlanGenerator,
      openTaskTemplateCreator,
      openTreatmentPlans,
      openTaskTemplates,
      openTreatmentPlanRequests,
      openSystemAnalytics,
      openAIConfiguration,
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
  .md\\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  
  .md\\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
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
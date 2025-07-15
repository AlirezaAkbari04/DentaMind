<!--
  System Analytics Component
  
  System usage analytics, performance reports, and metrics dashboard
-->
<template>
  <div class="p-4 space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">System Analytics</h1>
          <p class="text-slate-600">Monitor system usage, performance, and user behavior</p>
        </div>
        <div class="flex items-center space-x-3">
          <select
            v-model="timeRange"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button 
            @click="exportAnalytics"
            class="bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Report
          </button>
          <button 
            @click="refreshData"
            :disabled="isRefreshing"
            class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <svg v-if="isRefreshing" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>
    </div>

    <!-- Key Performance Indicators -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-blue-600 font-medium">Total Users</p>
            <p class="text-2xl font-bold text-blue-800">{{ kpiData.totalUsers.toLocaleString() }}</p>
            <p class="text-xs text-slate-500">
              <span :class="kpiData.userGrowth >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ kpiData.userGrowth >= 0 ? '+' : '' }}{{ kpiData.userGrowth }}%
              </span>
              vs last period
            </p>
          </div>
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-green-600 font-medium">API Requests</p>
            <p class="text-2xl font-bold text-green-800">{{ kpiData.apiRequests.toLocaleString() }}</p>
            <p class="text-xs text-slate-500">
              <span :class="kpiData.apiGrowth >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ kpiData.apiGrowth >= 0 ? '+' : '' }}{{ kpiData.apiGrowth }}%
              </span>
              vs last period
            </p>
          </div>
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-purple-600 font-medium">Avg Response Time</p>
            <p class="text-2xl font-bold text-purple-800">{{ kpiData.avgResponseTime }}ms</p>
            <p class="text-xs text-slate-500">
              <span :class="kpiData.responseTimeChange <= 0 ? 'text-green-600' : 'text-red-600'">
                {{ kpiData.responseTimeChange >= 0 ? '+' : '' }}{{ kpiData.responseTimeChange }}ms
              </span>
              vs last period
            </p>
          </div>
          <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-orange-600 font-medium">Error Rate</p>
            <p class="text-2xl font-bold text-orange-800">{{ kpiData.errorRate }}%</p>
            <p class="text-xs text-slate-500">
              <span :class="kpiData.errorRateChange <= 0 ? 'text-green-600' : 'text-red-600'">
                {{ kpiData.errorRateChange >= 0 ? '+' : '' }}{{ kpiData.errorRateChange }}%
              </span>
              vs last period
            </p>
          </div>
          <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Usage Analytics -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- User Activity Chart -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-slate-800">User Activity</h2>
          <select
            v-model="activityMetric"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="logins">Daily Logins</option>
            <option value="sessions">Active Sessions</option>
            <option value="appointments">Appointments Created</option>
          </select>
        </div>
        
        <!-- Simple Chart Representation -->
        <div class="space-y-2">
          <div
            v-for="(day, index) in chartData.userActivity"
            :key="index"
            class="flex items-center space-x-3"
          >
            <span class="text-xs text-slate-500 w-12">{{ day.label }}</span>
            <div class="flex-1 bg-gray-200 rounded-full h-4 relative">
              <div 
                class="bg-blue-500 h-4 rounded-full transition-all duration-500"
                :style="{ width: `${(day.value / Math.max(...chartData.userActivity.map(d => d.value))) * 100}%` }"
              ></div>
            </div>
            <span class="text-xs text-slate-700 w-8 text-right">{{ day.value }}</span>
          </div>
        </div>
      </div>

      <!-- Feature Usage -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-semibold text-slate-800 mb-4">Feature Usage</h2>
        
        <div class="space-y-4">
          <div
            v-for="feature in featureUsage"
            :key="feature.name"
            class="flex items-center justify-between"
          >
            <div>
              <p class="font-medium text-slate-800">{{ feature.name }}</p>
              <p class="text-sm text-slate-600">{{ feature.description }}</p>
            </div>
            <div class="text-right">
              <span class="text-lg font-semibold text-slate-800">{{ feature.usage }}%</span>
              <div class="w-16 bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  class="bg-green-500 h-2 rounded-full transition-all duration-500"
                  :style="{ width: `${feature.usage}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance Metrics -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 class="text-lg font-semibold text-slate-800 mb-4">System Performance</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Server Health -->
        <div>
          <h3 class="text-sm font-medium text-slate-600 mb-3">Server Health</h3>
          <div class="space-y-3">
            <div
              v-for="server in serverMetrics"
              :key="server.name"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <div 
                  class="w-3 h-3 rounded-full"
                  :class="getServerStatusColor(server.status)"
                ></div>
                <span class="text-sm text-slate-700">{{ server.name }}</span>
              </div>
              <span class="text-xs text-slate-500">{{ server.uptime }}% uptime</span>
            </div>
          </div>
        </div>

        <!-- Database Performance -->
        <div>
          <h3 class="text-sm font-medium text-slate-600 mb-3">Database Performance</h3>
          <div class="space-y-3">
            <div class="p-3 bg-gray-50 rounded-lg">
              <div class="flex justify-between text-sm">
                <span class="text-slate-600">Query Time</span>
                <span class="font-medium text-slate-800">{{ dbMetrics.avgQueryTime }}ms</span>
              </div>
            </div>
            <div class="p-3 bg-gray-50 rounded-lg">
              <div class="flex justify-between text-sm">
                <span class="text-slate-600">Active Connections</span>
                <span class="font-medium text-slate-800">{{ dbMetrics.activeConnections }}</span>
              </div>
            </div>
            <div class="p-3 bg-gray-50 rounded-lg">
              <div class="flex justify-between text-sm">
                <span class="text-slate-600">Storage Used</span>
                <span class="font-medium text-slate-800">{{ dbMetrics.storageUsed }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- API Endpoints -->
        <div>
          <h3 class="text-sm font-medium text-slate-600 mb-3">Top API Endpoints</h3>
          <div class="space-y-2">
            <div
              v-for="endpoint in topEndpoints"
              :key="endpoint.path"
              class="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
            >
              <div>
                <span class="text-xs font-mono text-slate-700">{{ endpoint.method }}</span>
                <span class="text-xs text-slate-600 ml-2">{{ endpoint.path }}</span>
              </div>
              <span class="text-xs text-slate-500">{{ endpoint.requests }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent System Events -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-slate-800">Recent System Events</h2>
        <select
          v-model="eventFilter"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">All Events</option>
          <option value="error">Errors</option>
          <option value="warning">Warnings</option>
          <option value="info">Information</option>
        </select>
      </div>

      <div class="space-y-3">
        <div
          v-for="event in filteredEvents"
          :key="event.id"
          class="flex items-start space-x-3 p-3 rounded-lg border"
          :class="getEventClasses(event.type)"
        >
          <div 
            class="w-2 h-2 rounded-full mt-2"
            :class="getEventDotColor(event.type)"
          ></div>
          <div class="flex-1">
            <p class="text-sm font-medium text-slate-800">{{ event.title }}</p>
            <p class="text-sm text-slate-600">{{ event.description }}</p>
            <p class="text-xs text-slate-500 mt-1">{{ event.component }} • {{ formatTimeAgo(event.timestamp) }}</p>
          </div>
          <span class="text-xs text-slate-500">{{ formatTime(event.timestamp) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'SystemAnalytics',
  emits: ['show-toast', 'show-error', 'show-success'],
  setup(props, { emit }) {
    // ==========================================
    // REACTIVE STATE
    // ==========================================
    
    const timeRange = ref('7d')
    const activityMetric = ref('logins')
    const eventFilter = ref('')
    const isRefreshing = ref(false)
    
    const kpiData = ref({
      totalUsers: 1247,
      userGrowth: 12.5,
      apiRequests: 42847,
      apiGrowth: 8.3,
      avgResponseTime: 247,
      responseTimeChange: -15,
      errorRate: 0.8,
      errorRateChange: -0.2
    })
    
    const chartData = ref({
      userActivity: [
        { label: 'Mon', value: 45 },
        { label: 'Tue', value: 52 },
        { label: 'Wed', value: 48 },
        { label: 'Thu', value: 61 },
        { label: 'Fri', value: 55 },
        { label: 'Sat', value: 33 },
        { label: 'Sun', value: 28 }
      ]
    })
    
    const featureUsage = ref([
      { name: 'Appointment Booking', description: 'Patient appointment requests', usage: 89 },
      { name: 'Medical Records', description: 'Patient record access', usage: 76 },
      { name: 'AI Diagnostics', description: 'AI-powered analysis', usage: 63 },
      { name: 'Task Management', description: 'Care task tracking', usage: 58 },
      { name: 'Chat System', description: 'Patient-doctor communication', usage: 42 }
    ])
    
    const serverMetrics = ref([
      { name: 'Web Server', status: 'healthy', uptime: 99.9 },
      { name: 'API Server', status: 'healthy', uptime: 99.7 },
      { name: 'Database', status: 'healthy', uptime: 99.8 },
      { name: 'File Storage', status: 'warning', uptime: 98.2 }
    ])
    
    const dbMetrics = ref({
      avgQueryTime: 142,
      activeConnections: 34,
      storageUsed: 67
    })
    
    const topEndpoints = ref([
      { method: 'GET', path: '/api/patients', requests: '12.4K' },
      { method: 'POST', path: '/api/appointments', requests: '8.7K' },
      { method: 'GET', path: '/api/tasks', requests: '6.2K' },
      { method: 'PUT', path: '/api/records', requests: '4.1K' },
      { method: 'GET', path: '/api/chat', requests: '3.8K' }
    ])
    
    const systemEvents = ref([
      {
        id: 1,
        title: 'High Memory Usage',
        description: 'Server memory usage exceeded 85% threshold',
        type: 'warning',
        component: 'Web Server',
        timestamp: new Date(Date.now() - 15 * 60 * 1000)
      },
      {
        id: 2,
        title: 'Database Backup Completed',
        description: 'Automated daily backup completed successfully',
        type: 'info',
        component: 'Database',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 3,
        title: 'API Rate Limit Exceeded',
        description: 'Client 192.168.1.100 exceeded rate limit',
        type: 'error',
        component: 'API Gateway',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      {
        id: 4,
        title: 'New User Registration Spike',
        description: '15 new users registered in the last hour',
        type: 'info',
        component: 'Authentication',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
      }
    ])
    
    // ==========================================
    // COMPUTED PROPERTIES
    // ==========================================
    
    const filteredEvents = computed(() => {
      if (!eventFilter.value) return systemEvents.value
      return systemEvents.value.filter(event => event.type === eventFilter.value)
    })
    
    // ==========================================
    // METHODS
    // ==========================================
    
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
        const diffDays = Math.floor(diffHours / 24)
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
      }
    }
    
    const formatTime = (date) => {
      return new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    const getServerStatusColor = (status) => {
      const colors = {
        healthy: 'bg-green-500',
        warning: 'bg-yellow-500',
        error: 'bg-red-500'
      }
      return colors[status] || 'bg-gray-500'
    }
    
    const getEventClasses = (type) => {
      const classes = {
        error: 'border-red-200 bg-red-50',
        warning: 'border-yellow-200 bg-yellow-50',
        info: 'border-blue-200 bg-blue-50'
      }
      return classes[type] || 'border-gray-200 bg-gray-50'
    }
    
    const getEventDotColor = (type) => {
      const colors = {
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
      }
      return colors[type] || 'bg-gray-500'
    }
    
    const exportAnalytics = () => {
      // TODO: Implement export functionality
      emit('show-success', 'Analytics report exported successfully')
    }
    
    const refreshData = async () => {
      isRefreshing.value = true
      
      try {
        // Simulate data refresh
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Update some random data to show refresh
        kpiData.value.apiRequests += Math.floor(Math.random() * 100)
        kpiData.value.totalUsers += Math.floor(Math.random() * 5)
        
        emit('show-success', 'Analytics data refreshed')
      } catch (error) {
        emit('show-error', 'Failed to refresh data')
      } finally {
        isRefreshing.value = false
      }
    }
    
    // ==========================================
    // LIFECYCLE
    // ==========================================
    
    onMounted(() => {
      console.log('System Analytics mounted')
    })
    
    // ==========================================
    // RETURN FOR TEMPLATE
    // ==========================================
    
    return {
      // State
      timeRange,
      activityMetric,
      eventFilter,
      isRefreshing,
      kpiData,
      chartData,
      featureUsage,
      serverMetrics,
      dbMetrics,
      topEndpoints,
      systemEvents,
      
      // Computed
      filteredEvents,
      
      // Methods
      formatTimeAgo,
      formatTime,
      getServerStatusColor,
      getEventClasses,
      getEventDotColor,
      exportAnalytics,
      refreshData
    }
  }
}
</script>

<style scoped>
/* Animate spinner */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Color classes */
.bg-primary-600 { background-color: #0066CC; }
.bg-primary-700 { background-color: #0052a3; }
.bg-secondary-600 { background-color: #00A86B; }
.bg-secondary-700 { background-color: #047857; }
.text-primary-600 { color: #0066CC; }
.text-primary-700 { color: #0052a3; }
.ring-primary-500 { --tw-ring-color: #3b82f6; }
.border-primary-500 { border-color: #3b82f6; }

/* Transition effects */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>
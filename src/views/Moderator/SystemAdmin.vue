<!--
  System Administration Component
  
  System administration overview with:
  - Clinic management and configuration
  - Subscription tier management
  - System analytics and reporting
  - Database management tools
  - Security settings
  - Performance monitoring
-->
<template>
  <div class="p-4 space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">System Administration</h1>
          <p class="text-slate-600">Manage system settings, clinics, and monitor performance</p>
        </div>
        <div class="flex items-center space-x-3">
          <button 
            @click="runSystemCheck"
            :disabled="isRunningCheck"
            class="bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <svg v-if="isRunningCheck" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            System Health Check
          </button>
          <button 
            @click="exportSystemReport"
            class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Report
          </button>
        </div>
      </div>
    </div>

    <!-- System Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-blue-600 font-medium">Active Clinics</p>
            <p class="text-2xl font-bold text-blue-800">{{ systemStats.activeClinics }}</p>
            <p class="text-xs text-slate-500 mt-1">{{ systemStats.totalClinics }} total registered</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-green-600 font-medium">System Uptime</p>
            <p class="text-2xl font-bold text-green-800">{{ systemStats.uptime }}%</p>
            <p class="text-xs text-slate-500 mt-1">Last {{ systemStats.uptimeDays }} days</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-purple-600 font-medium">Database Size</p>
            <p class="text-2xl font-bold text-purple-800">{{ systemStats.databaseSize }}</p>
            <p class="text-xs text-slate-500 mt-1">{{ systemStats.databaseGrowth }} growth this month</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-orange-600 font-medium">Active Users</p>
            <p class="text-2xl font-bold text-orange-800">{{ systemStats.activeUsers }}</p>
            <p class="text-xs text-slate-500 mt-1">{{ systemStats.totalUsers }} total users</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Administration Sections -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Clinic Management -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-slate-800">Clinic Management</h2>
          <button 
            @click="openClinicManagement"
            class="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View All
          </button>
        </div>

        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <button 
              @click="openClinicRegistration"
              class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-slate-800">Register Clinic</p>
                  <p class="text-xs text-slate-500">Add new clinic</p>
                </div>
              </div>
            </button>

            <button 
              @click="openClinicSettings"
              class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-slate-800">Clinic Settings</p>
                  <p class="text-xs text-slate-500">Configure clinics</p>
                </div>
              </div>
            </button>
          </div>

          <!-- Recent Clinic Activity -->
          <div>
            <h3 class="text-sm font-medium text-slate-600 mb-2">Recent Activity</h3>
            <div class="space-y-2">
              <div
                v-for="activity in recentClinicActivity"
                :key="activity.id"
                class="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center space-x-3">
                  <div 
                    class="w-2 h-2 rounded-full"
                    :class="getActivityStatusColor(activity.type)"
                  ></div>
                  <span class="text-sm text-slate-700">{{ activity.message }}</span>
                </div>
                <span class="text-xs text-slate-500">{{ formatTimeAgo(activity.timestamp) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Subscription Management -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-slate-800">Subscription Management</h2>
          <button 
            @click="openSubscriptionManagement"
            class="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View All
          </button>
        </div>

        <div class="space-y-4">
          <!-- Subscription Stats -->
          <div class="grid grid-cols-3 gap-3">
            <div class="text-center p-3 bg-blue-50 rounded-lg">
              <p class="text-lg font-bold text-blue-800">{{ subscriptionStats.basic }}</p>
              <p class="text-xs text-blue-600">Basic</p>
            </div>
            <div class="text-center p-3 bg-green-50 rounded-lg">
              <p class="text-lg font-bold text-green-800">{{ subscriptionStats.professional }}</p>
              <p class="text-xs text-green-600">Professional</p>
            </div>
            <div class="text-center p-3 bg-purple-50 rounded-lg">
              <p class="text-lg font-bold text-purple-800">{{ subscriptionStats.enterprise }}</p>
              <p class="text-xs text-purple-600">Enterprise</p>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="grid grid-cols-2 gap-3">
            <button 
              @click="openBillingOverview"
              class="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p class="text-sm font-medium text-slate-700">Billing Overview</p>
            </button>

            <button 
              @click="openSubscriptionSettings"
              class="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <p class="text-sm font-medium text-slate-700">Tier Settings</p>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- System Tools -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Database Management -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-slate-800">Database Tools</h2>
          <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
          </div>
        </div>

        <div class="space-y-3">
          <button 
            @click="openDatabaseBackup"
            class="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-slate-700">Backup Management</span>
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          <button 
            @click="openDatabaseMaintenance"
            class="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-slate-700">Maintenance</span>
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          <button 
            @click="openDatabaseAnalytics"
            class="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-slate-700">Performance Analytics</span>
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          <!-- Last Backup Info -->
          <div class="mt-4 p-3 bg-gray-50 rounded-lg">
            <p class="text-xs text-slate-600">Last backup: {{ formatTimeAgo(lastBackupTime) }}</p>
            <p class="text-xs text-slate-500">Next scheduled: {{ formatDate(nextBackupTime) }}</p>
          </div>
        </div>
      </div>

      <!-- Security Settings -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-slate-800">Security Settings</h2>
          <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        <div class="space-y-3">
          <button 
            @click="openAccessControl"
            class="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-slate-700">Access Control</span>
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          <button 
            @click="openAuditLogs"
            class="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-slate-700">Audit Logs</span>
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          <button 
            @click="openSecurityPolicies"
            class="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-slate-700">Security Policies</span>
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          <!-- Security Status -->
          <div class="mt-4 p-3 bg-green-50 rounded-lg">
            <div class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <p class="text-xs text-green-700 font-medium">Security Status: Good</p>
            </div>
            <p class="text-xs text-green-600 mt-1">All security checks passed</p>
          </div>
        </div>
      </div>

      <!-- System Analytics -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-slate-800">System Analytics</h2>
          <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>

        <div class="space-y-3">
          <button 
            @click="openUsageAnalytics"
            class="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-slate-700">Usage Analytics</span>
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          <button 
            @click="openPerformanceReports"
            class="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-slate-700">Performance Reports</span>
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          <button 
            @click="openSystemMetrics"
            class="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-slate-700">System Metrics</span>
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          <!-- Analytics Summary -->
          <div class="mt-4 p-3 bg-blue-50 rounded-lg">
            <p class="text-xs text-blue-700 font-medium">Today's Activity</p>
            <p class="text-xs text-blue-600">{{ systemStats.todayRequests }} API requests</p>
            <p class="text-xs text-blue-600">{{ systemStats.todayLogins }} user logins</p>
          </div>
        </div>
      </div>
    </div>

    <!-- System Alerts -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-slate-800">System Alerts</h2>
        <span class="text-sm text-slate-500">{{ systemAlerts.length }} active alerts</span>
      </div>

      <div class="space-y-3">
        <div
          v-for="alert in systemAlerts"
          :key="alert.id"
          class="flex items-start space-x-3 p-4 rounded-lg border"
          :class="getAlertClasses(alert.severity)"
        >
          <div 
            class="w-2 h-2 rounded-full mt-2"
            :class="getAlertDotColor(alert.severity)"
          ></div>
          <div class="flex-1">
            <p class="text-sm font-medium text-slate-800">{{ alert.title }}</p>
            <p class="text-sm text-slate-600 mt-1">{{ alert.description }}</p>
            <p class="text-xs text-slate-500 mt-2">{{ alert.component }} • {{ formatTimeAgo(alert.timestamp) }}</p>
          </div>
          <div class="flex items-center space-x-2">
            <button 
              @click="resolveAlert(alert.id)"
              class="text-xs text-green-600 hover:text-green-700 font-medium"
            >
              Resolve
            </button>
            <button 
              @click="dismissAlert(alert.id)"
              class="text-xs text-slate-500 hover:text-slate-700"
            >
              Dismiss
            </button>
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
  name: 'SystemAdmin',
  emits: ['show-toast', 'show-error', 'show-success'],
  setup(props, { emit }) {
    const router = useRouter()
    
    // ==========================================
    // REACTIVE STATE
    // ==========================================
    
    const isRunningCheck = ref(false)
    
    // System statistics
    const systemStats = ref({
      activeClinics: 12,
      totalClinics: 15,
      uptime: 99.7,
      uptimeDays: 30,
      databaseSize: '2.4 GB',
      databaseGrowth: '+15%',
      activeUsers: 847,
      totalUsers: 1253,
      todayRequests: 12547,
      todayLogins: 342
    })
    
    // Subscription statistics
    const subscriptionStats = ref({
      basic: 8,
      professional: 5,
      enterprise: 2
    })
    
    // Recent clinic activity
    const recentClinicActivity = ref([
      {
        id: 1,
        message: 'New clinic "Smile Dental" registered',
        type: 'success',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 2,
        message: 'Clinic "Downtown Dental" upgraded to Professional',
        type: 'info',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      {
        id: 3,
        message: 'Configuration updated for "Family Care Clinic"',
        type: 'warning',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
      }
    ])
    
    // System alerts
    const systemAlerts = ref([
      {
        id: 1,
        title: 'High Database Usage',
        description: 'Database storage is at 85% capacity. Consider cleanup or upgrade.',
        severity: 'warning',
        component: 'Database',
        timestamp: new Date(Date.now() - 30 * 60 * 1000)
      },
      {
        id: 2,
        title: 'SSL Certificate Expiring',
        description: 'SSL certificate for main domain expires in 15 days.',
        severity: 'medium',
        component: 'Security',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 3,
        title: 'Backup Completed Successfully',
        description: 'Daily automated backup completed without errors.',
        severity: 'info',
        component: 'Backup System',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
      }
    ])
    
    // Backup information
    const lastBackupTime = ref(new Date(Date.now() - 6 * 60 * 60 * 1000))
    const nextBackupTime = ref(new Date(Date.now() + 18 * 60 * 60 * 1000))
    
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
    
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    const getActivityStatusColor = (type) => {
      const colors = {
        success: 'bg-green-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500',
        error: 'bg-red-500'
      }
      return colors[type] || 'bg-gray-500'
    }
    
    const getAlertClasses = (severity) => {
      const classes = {
        warning: 'border-yellow-200 bg-yellow-50',
        medium: 'border-orange-200 bg-orange-50',
        info: 'border-blue-200 bg-blue-50',
        high: 'border-red-200 bg-red-50'
      }
      return classes[severity] || 'border-gray-200 bg-gray-50'
    }
    
    const getAlertDotColor = (severity) => {
      const colors = {
        warning: 'bg-yellow-500',
        medium: 'bg-orange-500',
        info: 'bg-blue-500',
        high: 'bg-red-500'
      }
      return colors[severity] || 'bg-gray-500'
    }
    
    const runSystemCheck = async () => {
      isRunningCheck.value = true
      
      try {
        // Simulate system health check
        await new Promise(resolve => setTimeout(resolve, 3000))
        emit('show-success', 'System health check completed successfully')
      } catch (error) {
        emit('show-error', 'System health check failed')
      } finally {
        isRunningCheck.value = false
      }
    }
    
    const exportSystemReport = () => {
      // TODO: Implement system report export
      emit('show-success', 'System report exported successfully')
    }
    
    const resolveAlert = (alertId) => {
      systemAlerts.value = systemAlerts.value.filter(alert => alert.id !== alertId)
      emit('show-success', 'Alert resolved')
    }
    
    const dismissAlert = (alertId) => {
      systemAlerts.value = systemAlerts.value.filter(alert => alert.id !== alertId)
      emit('show-success', 'Alert dismissed')
    }
    
    // Navigation methods
    const openClinicManagement = () => {
      router.push('/moderator/clinic-management')
    }
    
    const openClinicRegistration = () => {
      router.push('/moderator/clinic-management/register')
    }
    
    const openClinicSettings = () => {
      router.push('/moderator/clinic-management/settings')
    }
    
    const openSubscriptionManagement = () => {
      router.push('/moderator/subscription-management')
    }
    
    const openBillingOverview = () => {
      router.push('/moderator/subscription-management/billing')
    }
    
    const openSubscriptionSettings = () => {
      router.push('/moderator/subscription-management/settings')
    }
    
    const openDatabaseBackup = () => {
      router.push('/moderator/database-tools/backup')
    }
    
    const openDatabaseMaintenance = () => {
      router.push('/moderator/database-tools/maintenance')
    }
    
    const openDatabaseAnalytics = () => {
      router.push('/moderator/database-tools/analytics')
    }
    
    const openAccessControl = () => {
      router.push('/moderator/security-settings/access-control')
    }
    
    const openAuditLogs = () => {
      router.push('/moderator/security-settings/audit-logs')
    }
    
    const openSecurityPolicies = () => {
      router.push('/moderator/security-settings/policies')
    }
    
    const openUsageAnalytics = () => {
      router.push('/moderator/system-analytics/usage')
    }
    
    const openPerformanceReports = () => {
      router.push('/moderator/system-analytics/performance')
    }
    
    const openSystemMetrics = () => {
      router.push('/moderator/system-analytics/metrics')
    }
    
    // ==========================================
    // LIFECYCLE
    // ==========================================
    
    onMounted(() => {
      console.log('System Admin mounted')
    })
    
    // ==========================================
    // RETURN FOR TEMPLATE
    // ==========================================
    
    return {
      // State
      isRunningCheck,
      systemStats,
      subscriptionStats,
      recentClinicActivity,
      systemAlerts,
      lastBackupTime,
      nextBackupTime,
      
      // Methods
      formatTimeAgo,
      formatDate,
      getActivityStatusColor,
      getAlertClasses,
      getAlertDotColor,
      runSystemCheck,
      exportSystemReport,
      resolveAlert,
      dismissAlert,
      openClinicManagement,
      openClinicRegistration,
      openClinicSettings,
      openSubscriptionManagement,
      openBillingOverview,
      openSubscriptionSettings,
      openDatabaseBackup,
      openDatabaseMaintenance,
      openDatabaseAnalytics,
      openAccessControl,
      openAuditLogs,
      openSecurityPolicies,
      openUsageAnalytics,
      openPerformanceReports,
      openSystemMetrics
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

/* Transition effects */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Color classes */
.bg-primary-600 { background-color: #0066CC; }
.bg-primary-700 { background-color: #0052a3; }
.bg-secondary-600 { background-color: #00A86B; }
.bg-secondary-700 { background-color: #047857; }
.text-primary-600 { color: #0066CC; }
.text-primary-700 { color: #0052a3; }
.hover\\:text-primary-700:hover { color: #0052a3; }
</style>
<!--
  Moderator Profile Component
  
  Comprehensive profile management for moderator with:
  - Personal information editing
  - Professional credentials and role information
  - Security settings and password management
  - System preferences and AI configuration
  - Activity logs and audit trail
  - Notification preferences
  - Account management
-->
<template>
  <div class="p-4 space-y-6">
    <!-- Header Section -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Profile & Settings</h1>
          <p class="text-slate-600">Manage your moderator account and system preferences</p>
        </div>
        <div class="flex items-center space-x-3">
          <div class="text-right">
            <p class="text-sm font-medium text-slate-700">{{ profileData.username }}</p>
            <span class="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-full">Moderator</span>
          </div>
          <div class="relative">
            <div 
              v-if="profileData.avatar"
              class="w-12 h-12 rounded-full overflow-hidden border-2 border-primary-200"
            >
              <img :src="profileData.avatar" :alt="profileData.name" class="w-full h-full object-cover">
            </div>
            <div 
              v-else
              class="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium"
            >
              {{ profileData.initials }}
            </div>
            <button 
              @click="changeAvatar"
              class="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <svg class="w-3 h-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Profile Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p class="text-xl font-bold text-blue-800">{{ profileStats.treatmentPlansCreated }}</p>
          <p class="text-sm text-blue-600">Treatment Plans Created</p>
        </div>
        <div class="text-center p-3 bg-green-50 rounded-lg border border-green-100">
          <p class="text-xl font-bold text-green-800">{{ profileStats.taskTemplatesManaged }}</p>
          <p class="text-sm text-green-600">Task Templates Managed</p>
        </div>
        <div class="text-center p-3 bg-purple-50 rounded-lg border border-purple-100">
          <p class="text-xl font-bold text-purple-800">{{ profileStats.systemActionsPerformed }}</p>
          <p class="text-sm text-purple-600">System Actions</p>
        </div>
        <div class="text-center p-3 bg-orange-50 rounded-lg border border-orange-100">
          <p class="text-xl font-bold text-orange-800">{{ formatDate(profileData.lastLogin) }}</p>
          <p class="text-sm text-orange-600">Last Login</p>
        </div>
      </div>
    </div>

    <!-- Personal Information -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-slate-800">Personal Information</h2>
        <button 
          @click="toggleEditProfile"
          class="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
        >
          {{ editingProfile ? 'Cancel' : 'Edit' }}
        </button>
      </div>

      <div v-if="!editingProfile" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium text-slate-600">Full Name</label>
            <p class="text-slate-800">{{ profileData.name }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-slate-600">Email Address</label>
            <p class="text-slate-800">{{ profileData.email }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-slate-600">Phone Number</label>
            <p class="text-slate-800">{{ profileData.phone || 'Not provided' }}</p>
          </div>
        </div>
        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium text-slate-600">Employee ID</label>
            <p class="text-slate-800">{{ profileData.employeeId }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-slate-600">Department</label>
            <p class="text-slate-800">{{ profileData.department }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-slate-600">Date Joined</label>
            <p class="text-slate-800">{{ formatDate(profileData.dateJoined) }}</p>
          </div>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">First Name</label>
            <input 
              v-model="editForm.firstName"
              type="text" 
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter first name"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
            <input 
              v-model="editForm.lastName"
              type="text" 
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter last name"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input 
              v-model="editForm.email"
              type="email" 
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter email address"
            >
          </div>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
            <input 
              v-model="editForm.phone"
              type="tel" 
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter phone number"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Department</label>
            <select 
              v-model="editForm.department"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="System Administration">System Administration</option>
              <option value="Clinical Operations">Clinical Operations</option>
              <option value="Quality Assurance">Quality Assurance</option>
              <option value="Data Management">Data Management</option>
            </select>
          </div>
        </div>
        
        <div class="md:col-span-2 flex space-x-3 pt-4">
          <button 
            @click="saveProfile"
            class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Save Changes
          </button>
          <button 
            @click="toggleEditProfile"
            class="border border-gray-300 text-slate-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      <input 
        ref="avatarInput"
        type="file" 
        accept="image/*" 
        @change="handleAvatarUpload"
        class="hidden"
      >
    </div>

    <!-- Professional Information -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 class="text-lg font-semibold text-slate-800 mb-6">Professional Information</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium text-slate-600">Role & Permissions</label>
            <div class="mt-2 space-y-2">
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-sm text-slate-700">Treatment Plan Generation</span>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-sm text-slate-700">Task Template Management</span>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-sm text-slate-700">System Administration</span>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-sm text-slate-700">AI Model Configuration</span>
              </div>
            </div>
          </div>
        </div>
        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium text-slate-600">Access Level</label>
            <p class="text-slate-800">System Moderator</p>
            <p class="text-xs text-slate-500">Full system access except user management</p>
          </div>
          <div>
            <label class="text-sm font-medium text-slate-600">Certification</label>
            <p class="text-slate-800">{{ profileData.certification || 'Healthcare IT Management' }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-slate-600">Certification Expiry</label>
            <p class="text-slate-800">{{ formatDate(profileData.certificationExpiry) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Security Settings -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 class="text-lg font-semibold text-slate-800 mb-6">Security Settings</h2>
      
      <div class="space-y-6">
        <!-- Password -->
        <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 class="font-medium text-slate-800">Password</h3>
            <p class="text-sm text-slate-600">Last changed {{ formatTimeAgo(profileData.passwordLastChanged) }}</p>
          </div>
          <button 
            @click="showChangePasswordModal = true"
            class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Change Password
          </button>
        </div>

        <!-- Two-Factor Authentication -->
        <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 class="font-medium text-slate-800">Two-Factor Authentication</h3>
            <p class="text-sm text-slate-600">
              {{ securitySettings.twoFactorEnabled ? 'Enabled' : 'Disabled' }} - 
              Add extra security to your account
            </p>
          </div>
          <button 
            @click="toggle2FA"
            class="text-sm font-medium transition-colors"
            :class="securitySettings.twoFactorEnabled 
              ? 'text-red-600 hover:text-red-700' 
              : 'text-primary-600 hover:text-primary-700'"
          >
            {{ securitySettings.twoFactorEnabled ? 'Disable' : 'Enable' }}
          </button>
        </div>

        <!-- Login Activity -->
        <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 class="font-medium text-slate-800">Login Activity</h3>
            <p class="text-sm text-slate-600">View your recent login activity and sessions</p>
          </div>
          <button 
            @click="viewLoginActivity"
            class="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
          >
            View Activity
          </button>
        </div>

        <!-- Session Management -->
        <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 class="font-medium text-slate-800">Active Sessions</h3>
            <p class="text-sm text-slate-600">{{ securitySettings.activeSessions }} active sessions</p>
          </div>
          <button 
            @click="manageActiveSessions"
            class="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
          >
            Manage Sessions
          </button>
        </div>
      </div>
    </div>

    <!-- System Preferences -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 class="text-lg font-semibold text-slate-800 mb-6">System Preferences</h2>
      
      <div class="space-y-6">
        <!-- AI Model Preferences -->
        <div>
          <h3 class="font-medium text-slate-800 mb-3">AI Model Preferences</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-slate-700">Preferred AI Model for Treatment Plans</span>
              <select 
                v-model="systemPreferences.preferredAIModel"
                class="text-sm border border-gray-300 rounded px-3 py-1"
              >
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="deepseek">DeepSeek</option>
              </select>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-slate-700">AI Confidence Threshold</span>
              <select 
                v-model="systemPreferences.aiConfidenceThreshold"
                class="text-sm border border-gray-300 rounded px-3 py-1"
              >
                <option value="high">High (90%+)</option>
                <option value="medium">Medium (70%+)</option>
                <option value="low">Low (50%+)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Interface Preferences -->
        <div>
          <h3 class="font-medium text-slate-800 mb-3">Interface Preferences</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-slate-700">Theme</span>
              <select 
                v-model="systemPreferences.theme"
                class="text-sm border border-gray-300 rounded px-3 py-1"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-slate-700">Default Dashboard View</span>
              <select 
                v-model="systemPreferences.defaultView"
                class="text-sm border border-gray-300 rounded px-3 py-1"
              >
                <option value="overview">Overview</option>
                <option value="treatment-plans">Treatment Plans</option>
                <option value="task-templates">Task Templates</option>
                <option value="system-admin">System Admin</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Data Preferences -->
        <div>
          <h3 class="font-medium text-slate-800 mb-3">Data & Analytics</h3>
          <div class="space-y-3">
            <label class="flex items-center space-x-3">
              <input 
                type="checkbox" 
                v-model="systemPreferences.enableAdvancedAnalytics"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              >
              <span class="text-sm text-slate-700">Enable advanced analytics tracking</span>
            </label>
            <label class="flex items-center space-x-3">
              <input 
                type="checkbox" 
                v-model="systemPreferences.autoGenerateReports"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              >
              <span class="text-sm text-slate-700">Auto-generate monthly reports</span>
            </label>
            <label class="flex items-center space-x-3">
              <input 
                type="checkbox" 
                v-model="systemPreferences.enablePerformanceMonitoring"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              >
              <span class="text-sm text-slate-700">Enable real-time performance monitoring</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Preferences -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 class="text-lg font-semibold text-slate-800 mb-6">Notification Preferences</h2>
      
      <div class="space-y-6">
        <!-- Email Notifications -->
        <div>
          <h3 class="font-medium text-slate-800 mb-3">Email Notifications</h3>
          <div class="space-y-3">
            <label class="flex items-center justify-between">
              <span class="text-sm text-slate-700">System alerts and warnings</span>
              <input 
                type="checkbox" 
                v-model="notificationSettings.email.systemAlerts"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              >
            </label>
            <label class="flex items-center justify-between">
              <span class="text-sm text-slate-700">Daily system reports</span>
              <input 
                type="checkbox" 
                v-model="notificationSettings.email.dailyReports"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              >
            </label>
            <label class="flex items-center justify-between">
              <span class="text-sm text-slate-700">Treatment plan requests</span>
              <input 
                type="checkbox" 
                v-model="notificationSettings.email.treatmentRequests"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              >
            </label>
            <label class="flex items-center justify-between">
              <span class="text-sm text-slate-700">AI model performance alerts</span>
              <input 
                type="checkbox" 
                v-model="notificationSettings.email.aiAlerts"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              >
            </label>
          </div>
        </div>

        <!-- In-App Notifications -->
        <div>
          <h3 class="font-medium text-slate-800 mb-3">In-App Notifications</h3>
          <div class="space-y-3">
            <label class="flex items-center justify-between">
              <span class="text-sm text-slate-700">Real-time system status updates</span>
              <input 
                type="checkbox" 
                v-model="notificationSettings.inApp.systemStatus"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              >
            </label>
            <label class="flex items-center justify-between">
              <span class="text-sm text-slate-700">New treatment plan requests</span>
              <input 
                type="checkbox" 
                v-model="notificationSettings.inApp.newRequests"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              >
            </label>
            <label class="flex items-center justify-between">
              <span class="text-sm text-slate-700">Database maintenance reminders</span>
              <input 
                type="checkbox" 
                v-model="notificationSettings.inApp.maintenanceReminders"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              >
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Activity Log -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-slate-800">Recent Activity</h2>
        <button 
          @click="viewFullActivityLog"
          class="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
        >
          View Full Log
        </button>
      </div>
      
      <div class="space-y-4">
        <div
          v-for="activity in recentActivity"
          :key="activity.id"
          class="flex items-start space-x-3 p-3 border border-gray-100 rounded-lg"
        >
          <div 
            class="w-8 h-8 rounded-full flex items-center justify-center"
            :class="getActivityIconClasses(activity.type)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                :d="getActivityIconPath(activity.type)"
              />
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-slate-800">{{ activity.description }}</p>
            <p class="text-xs text-slate-500">{{ formatTimeAgo(activity.timestamp) }}</p>
          </div>
          <div class="text-right">
            <span 
              class="text-xs px-2 py-1 rounded-full"
              :class="getActivityStatusClasses(activity.status)"
            >
              {{ activity.status }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Account Management -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 class="text-lg font-semibold text-slate-800 mb-6">Account Management</h2>
      
      <div class="space-y-4">
        <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 class="font-medium text-slate-800">Export Account Data</h3>
            <p class="text-sm text-slate-600">Download your account information and activity data</p>
          </div>
          <button 
            @click="exportAccountData"
            class="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
          >
            Export Data
          </button>
        </div>

        <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 class="font-medium text-slate-800">Contact Support</h3>
            <p class="text-sm text-slate-600">Get help with your moderator account</p>
          </div>
          <button 
            @click="contactSupport"
            class="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
          >
            Contact Support
          </button>
        </div>

        <div class="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
          <div>
            <h3 class="font-medium text-red-800">Deactivate Account</h3>
            <p class="text-sm text-red-600">Temporarily disable your moderator access</p>
          </div>
          <button 
            @click="showDeactivateModal = true"
            class="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
          >
            Deactivate
          </button>
        </div>
      </div>
    </div>

    <!-- Change Password Modal -->
    <div 
      v-if="showChangePasswordModal"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-xl max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-slate-800">Change Password</h3>
          <button 
            @click="showChangePasswordModal = false"
            class="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
            <input 
              v-model="passwordForm.currentPassword"
              type="password" 
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter current password"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">New Password</label>
            <input 
              v-model="passwordForm.newPassword"
              type="password" 
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter new password"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
            <input 
              v-model="passwordForm.confirmPassword"
              type="password" 
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Confirm new password"
            >
          </div>

          <div class="flex space-x-3 pt-4">
            <button 
              @click="changePassword"
              class="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              :disabled="!isPasswordFormValid"
            >
              Change Password
            </button>
            <button 
              @click="showChangePasswordModal = false"
              class="flex-1 border border-gray-300 text-slate-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Deactivate Account Modal -->
    <div 
      v-if="showDeactivateModal"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-xl max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-slate-800">Deactivate Account</h3>
          <button 
            @click="showDeactivateModal = false"
            class="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div class="bg-red-50 border border-red-200 rounded-lg p-3">
            <div class="flex items-start space-x-2">
              <svg class="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <p class="text-sm font-medium text-red-800">Warning</p>
                <p class="text-sm text-red-700">This will temporarily disable your moderator access. You can reactivate your account by contacting an administrator.</p>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Reason for Deactivation</label>
            <textarea 
              v-model="deactivationReason"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              rows="3"
              placeholder="Please provide a reason for deactivating your account"
            ></textarea>
          </div>

          <div class="flex items-center space-x-2">
            <input 
              type="checkbox" 
              v-model="confirmDeactivation"
              class="rounded border-gray-300 text-red-600 focus:ring-red-500"
            >
            <span class="text-sm text-slate-700">I understand that my moderator access will be disabled</span>
          </div>

          <div class="flex space-x-3 pt-4">
            <button 
              @click="deactivateAccount"
              class="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              :disabled="!confirmDeactivation || !deactivationReason"
            >
              Deactivate Account
            </button>
            <button 
              @click="showDeactivateModal = false"
              class="flex-1 border border-gray-300 text-slate-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'ModeratorProfile',
  emits: ['show-toast', 'show-error', 'show-success'],
  setup(props, { emit }) {
    const router = useRouter()
    const authStore = useAuthStore()
    
    // ==========================================
    // REACTIVE STATE
    // ==========================================
    
    const editingProfile = ref(false)
    const showChangePasswordModal = ref(false)
    const showDeactivateModal = ref(false)
    const avatarInput = ref(null)
    
    // Profile data
    const profileData = ref({
      username: 'moderator_sarah',
      name: 'Sarah Wilson',
      initials: 'SW',
      email: 'sarah.wilson@dentalclinic.com',
      phone: '+1 (555) 123-4567',
      employeeId: 'MOD-2024-001',
      department: 'System Administration',
      dateJoined: '2023-08-15T00:00:00Z',
      lastLogin: '2024-01-15T09:30:00Z',
      avatar: null,
      certification: 'Healthcare IT Management',
      certificationExpiry: '2025-08-15T00:00:00Z',
      passwordLastChanged: '2023-12-01T00:00:00Z'
    })

    // Profile statistics
    const profileStats = ref({
      treatmentPlansCreated: 127,
      taskTemplatesManaged: 34,
      systemActionsPerformed: 892
    })
    
    // Edit form
    const editForm = ref({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: ''
    })
    
    // Password form
    const passwordForm = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    
    // Security settings
    const securitySettings = ref({
      twoFactorEnabled: true,
      activeSessions: 3,
      lastPasswordChange: '2023-12-01T00:00:00Z'
    })
    
    // System preferences
    const systemPreferences = ref({
      preferredAIModel: 'gpt-4',
      aiConfidenceThreshold: 'high',
      theme: 'light',
      defaultView: 'overview',
      enableAdvancedAnalytics: true,
      autoGenerateReports: true,
      enablePerformanceMonitoring: true
    })
    
    // Notification settings
    const notificationSettings = ref({
      email: {
        systemAlerts: true,
        dailyReports: true,
        treatmentRequests: true,
        aiAlerts: true
      },
      inApp: {
        systemStatus: true,
        newRequests: true,
        maintenanceReminders: true
      }
    })
    
    // Recent activity
    const recentActivity = ref([
      {
        id: 1,
        type: 'treatment_plan',
        description: 'Created treatment plan for patient John Doe',
        timestamp: '2024-01-15T10:30:00Z',
        status: 'Completed'
      },
      {
        id: 2,
        type: 'task_template',
        description: 'Updated task template "Post-Surgery Care"',
        timestamp: '2024-01-15T09:15:00Z',
        status: 'Completed'
      },
      {
        id: 3,
        type: 'system_config',
        description: 'Modified AI model configuration settings',
        timestamp: '2024-01-14T16:45:00Z',
        status: 'Completed'
      },
      {
        id: 4,
        type: 'database',
        description: 'Performed database optimization',
        timestamp: '2024-01-14T14:20:00Z',
        status: 'Completed'
      },
      {
        id: 5,
        type: 'security',
        description: 'Updated security settings',
        timestamp: '2024-01-13T11:30:00Z',
        status: 'Completed'
      }
    ])
    
    // Modal states
    const deactivationReason = ref('')
    const confirmDeactivation = ref(false)
    
    // ==========================================
    // COMPUTED PROPERTIES
    // ==========================================
    
    const isPasswordFormValid = computed(() => {
      return passwordForm.value.currentPassword &&
             passwordForm.value.newPassword &&
             passwordForm.value.confirmPassword &&
             passwordForm.value.newPassword === passwordForm.value.confirmPassword &&
             passwordForm.value.newPassword.length >= 8
    })
    
    // ==========================================
    // UTILITY METHODS
    // ==========================================
    
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
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffMins = Math.floor(diffMs / (1000 * 60))
      
      if (diffDays > 0) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
      } else if (diffHours > 0) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
      } else {
        return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
      }
    }
    
    const getActivityIconClasses = (type) => {
      switch (type) {
        case 'treatment_plan':
          return 'bg-blue-100 text-blue-600'
        case 'task_template':
          return 'bg-green-100 text-green-600'
        case 'system_config':
          return 'bg-purple-100 text-purple-600'
        case 'database':
          return 'bg-orange-100 text-orange-600'
        case 'security':
          return 'bg-red-100 text-red-600'
        default:
          return 'bg-gray-100 text-gray-600'
      }
    }
    
    const getActivityIconPath = (type) => {
      switch (type) {
        case 'treatment_plan':
          return 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
        case 'task_template':
          return 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
        case 'system_config':
          return 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'
        case 'database':
          return 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4'
        case 'security':
          return 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
        default:
          return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      }
    }
    
    const getActivityStatusClasses = (status) => {
      switch (status) {
        case 'Completed':
          return 'bg-green-100 text-green-800'
        case 'In Progress':
          return 'bg-blue-100 text-blue-800'
        case 'Failed':
          return 'bg-red-100 text-red-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }
    
    // ==========================================
    // ACTION METHODS
    // ==========================================
    
    const toggleEditProfile = () => {
      if (!editingProfile.value) {
        // Initialize edit form with current data
        const nameParts = profileData.value.name.split(' ')
        editForm.value = {
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: profileData.value.email,
          phone: profileData.value.phone,
          department: profileData.value.department
        }
      }
      editingProfile.value = !editingProfile.value
    }
    
    const saveProfile = async () => {
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Update profile data
        profileData.value = {
          ...profileData.value,
          name: `${editForm.value.firstName} ${editForm.value.lastName}`,
          initials: `${editForm.value.firstName[0]}${editForm.value.lastName[0]}`,
          email: editForm.value.email,
          phone: editForm.value.phone,
          department: editForm.value.department
        }
        
        editingProfile.value = false
        emit('show-success', 'Profile updated successfully')
      } catch (error) {
        console.error('Error saving profile:', error)
        emit('show-error', 'Failed to update profile')
      }
    }
    
    const changeAvatar = () => {
      avatarInput.value?.click()
    }
    
    const handleAvatarUpload = (event) => {
      const file = event.target.files[0]
      if (file) {
        // TODO: Upload avatar to server
        console.log('Uploading avatar:', file.name)
        
        // Create preview URL
        const reader = new FileReader()
        reader.onload = (e) => {
          profileData.value.avatar = e.target.result
          emit('show-success', 'Avatar updated successfully')
        }
        reader.readAsDataURL(file)
      }
    }
    
    const changePassword = async () => {
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Reset form
        passwordForm.value = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
        showChangePasswordModal.value = false
        profileData.value.passwordLastChanged = new Date().toISOString()
        
        emit('show-success', 'Password changed successfully')
      } catch (error) {
        console.error('Error changing password:', error)
        emit('show-error', 'Failed to change password')
      }
    }
    
    const toggle2FA = async () => {
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        securitySettings.value.twoFactorEnabled = !securitySettings.value.twoFactorEnabled
        
        const message = securitySettings.value.twoFactorEnabled 
          ? 'Two-factor authentication enabled' 
          : 'Two-factor authentication disabled'
        emit('show-success', message)
      } catch (error) {
        console.error('Error toggling 2FA:', error)
        emit('show-error', 'Failed to update two-factor authentication')
      }
    }
    
    const viewLoginActivity = () => {
      router.push('/moderator/login-activity')
    }
    
    const manageActiveSessions = () => {
      router.push('/moderator/active-sessions')
    }
    
    const viewFullActivityLog = () => {
      router.push('/moderator/activity-log')
    }
    
    const exportAccountData = async () => {
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        emit('show-success', 'Data export request submitted. You will receive an email with your data within 24 hours.')
      } catch (error) {
        console.error('Error exporting data:', error)
        emit('show-error', 'Failed to export account data')
      }
    }
    
    const contactSupport = () => {
      router.push('/moderator/support')
    }
    
    const deactivateAccount = async () => {
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        emit('show-success', 'Account deactivation request submitted. Please contact an administrator to reactivate.')
        
        // Logout and redirect
        await authStore.signOut()
        router.push('/auth/login')
      } catch (error) {
        console.error('Error deactivating account:', error)
        emit('show-error', 'Failed to deactivate account')
      }
    }
    
    // Save preferences automatically
    const savePreferences = async () => {
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 500))
        console.log('Preferences saved')
      } catch (error) {
        console.error('Error saving preferences:', error)
      }
    }
    
    // Data loading method
    const loadProfileData = async () => {
      try {
        // TODO: Replace with actual API calls
        console.log('Loading profile data...')
      } catch (error) {
        console.error('Error loading profile data:', error)
        emit('show-error', 'Failed to load profile data')
      }
    }
    
    // ==========================================
    // WATCHERS
    // ==========================================
    
    // Auto-save preferences when they change
    watch([systemPreferences, notificationSettings], () => {
      savePreferences()
    }, { deep: true })
    
    // ==========================================
    // LIFECYCLE
    // ==========================================
    
    onMounted(() => {
      loadProfileData()
    })
    
    // ==========================================
    // RETURN FOR TEMPLATE
    // ==========================================
    
    return {
      // State
      editingProfile,
      showChangePasswordModal,
      showDeactivateModal,
      avatarInput,
      profileData,
      profileStats,
      editForm,
      passwordForm,
      securitySettings,
      systemPreferences,
      notificationSettings,
      recentActivity,
      deactivationReason,
      confirmDeactivation,
      
      // Computed
      isPasswordFormValid,
      
      // Methods
      formatDate,
      formatTimeAgo,
      getActivityIconClasses,
      getActivityIconPath,
      getActivityStatusClasses,
      toggleEditProfile,
      saveProfile,
      changeAvatar,
      handleAvatarUpload,
      changePassword,
      toggle2FA,
      viewLoginActivity,
      manageActiveSessions,
      viewFullActivityLog,
      exportAccountData,
      contactSupport,
      deactivateAccount,
      loadProfileData
    }
  }
}
</script>

<style scoped>
/* Custom styles consistent with the moderator interface */
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
  
  .md\\:col-span-2 {
    grid-column: span 2 / span 2;
  }
}

/* Custom color classes */
.bg-primary-100 { background-color: #e6f3ff; }
.bg-primary-600 { background-color: #0066CC; }
.bg-primary-700 { background-color: #0052a3; }
.text-primary-600 { color: #0066CC; }
.text-primary-700 { color: #0052a3; }
.border-primary-200 { border-color: #bfdbfe; }

/* Focus styles */
input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #0066CC;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

/* Checkbox styling */
input[type="checkbox"] {
  accent-color: #0066CC;
}

/* Hover effects */
.hover\\:bg-gray-50:hover {
  background-color: #f9fafb;
}

.hover\\:bg-gray-100:hover {
  background-color: #f3f4f6;
}

.hover\\:bg-primary-700:hover {
  background-color: #0052a3;
}

.hover\\:bg-red-700:hover {
  background-color: #dc2626;
}

.hover\\:text-primary-700:hover {
  color: #0052a3;
}

.hover\\:text-red-700:hover {
  color: #dc2626;
}

/* Transition effects */
.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Button disabled states */
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Modal backdrop */
.fixed.inset-0 {
  backdrop-filter: blur(2px);
}

/* Avatar styling */
.w-12.h-12.rounded-full img {
  object-fit: cover;
}

/* Activity item hover effect */
.border.border-gray-100.rounded-lg:hover {
  border-color: #d1d5db;
  background-color: #f9fafb;
}

/* File input hidden */
input[type="file"].hidden {
  display: none;
}

/* Responsive text sizes */
@media (max-width: 640px) {
  .text-2xl {
    font-size: 1.5rem;
    line-height: 2rem;
  }
}

/* Stats cards responsive layout */
@media (max-width: 768px) {
  .grid-cols-2.md\\:grid-cols-4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* Form spacing adjustments */
.space-y-4 > * + * {
  margin-top: 1rem;
}

.space-y-6 > * + * {
  margin-top: 1.5rem;
}

/* Alert styles */
.bg-red-50 {
  background-color: #fef2f2;
}

.border-red-200 {
  border-color: #fecaca;
}

.text-red-500 {
  color: #ef4444;
}

.text-red-600 {
  color: #dc2626;
}

.text-red-700 {
  color: #b91c1c;
}

.text-red-800 {
  color: #991b1b;
}
</style>
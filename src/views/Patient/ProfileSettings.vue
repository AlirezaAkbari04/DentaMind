<!-- Profile & Settings Page -->
<template>
  <div class="min-h-screen bg-neutral-50 pb-20">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-100 px-4 py-4">
      <div class="flex items-center space-x-3">
        <button 
          @click="$router.go(-1)"
          class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg class="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <div>
          <h1 class="text-xl font-semibold text-slate-800">Profile & Settings</h1>
          <p class="text-sm text-slate-600 mt-1">Manage your account and preferences</p>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="px-4 py-6 space-y-6">
      <!-- Profile Information -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-slate-800">Personal Information</h2>
          <button 
            @click="toggleEditProfile"
            class="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            {{ editingProfile ? 'Cancel' : 'Edit Profile' }}
          </button>
        </div>

        <div v-if="!editingProfile" class="space-y-6">
          <!-- Profile Display -->
          <div class="flex items-center space-x-6">
            <div class="relative">
              <div class="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                <img 
                  v-if="profileData.avatar"
                  :src="profileData.avatar"
                  :alt="profileData.name"
                  class="w-20 h-20 rounded-full object-cover"
                />
                <span v-else class="text-primary-600 text-2xl font-bold">{{ profileData.initials }}</span>
              </div>
              <button 
                @click="changeAvatar"
                class="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </button>
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-semibold text-slate-800">{{ profileData.name }}</h3>
              <p class="text-slate-600">{{ profileData.email }}</p>
              <p class="text-slate-600">{{ profileData.phone }}</p>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                Primary Account Holder
              </span>
            </div>
          </div>

          <!-- Basic Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
              <p class="text-slate-800">{{ formatDate(profileData.dateOfBirth) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Age</label>
              <p class="text-slate-800">{{ calculateAge(profileData.dateOfBirth) }} years old</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Address</label>
              <p class="text-slate-800">{{ profileData.address || 'Not provided' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Emergency Contact</label>
              <p class="text-slate-800">{{ profileData.emergencyContact || 'Not provided' }}</p>
            </div>
          </div>

          <!-- Medical Information -->
          <div class="border-t border-gray-100 pt-6">
            <h4 class="text-lg font-medium text-slate-800 mb-4">Medical Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Insurance Provider</label>
                <p class="text-slate-800">{{ profileData.insurance || 'Not provided' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Policy Number</label>
                <p class="text-slate-800">{{ profileData.policyNumber || 'Not provided' }}</p>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-slate-700 mb-1">Medical Conditions & Allergies</label>
                <p class="text-slate-800">{{ profileData.medicalConditions || 'None reported' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Edit Profile Form -->
        <form v-else @submit.prevent="saveProfile" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">First Name</label>
              <input 
                v-model="editForm.firstName"
                type="text" 
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
              <input 
                v-model="editForm.lastName"
                type="text" 
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input 
                v-model="editForm.email"
                type="email" 
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Phone</label>
              <input 
                v-model="editForm.phone"
                type="tel"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
              <input 
                v-model="editForm.dateOfBirth"
                type="date"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Emergency Contact</label>
              <input 
                v-model="editForm.emergencyContact"
                type="text"
                placeholder="Name and phone number"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-slate-700 mb-2">Address</label>
              <input 
                v-model="editForm.address"
                type="text"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Insurance Provider</label>
              <input 
                v-model="editForm.insurance"
                type="text"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Policy Number</label>
              <input 
                v-model="editForm.policyNumber"
                type="text"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-slate-700 mb-2">Medical Conditions & Allergies</label>
              <textarea 
                v-model="editForm.medicalConditions"
                rows="3"
                placeholder="List any medical conditions, allergies, or medications..."
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              ></textarea>
            </div>
          </div>

          <div class="flex space-x-3">
            <button 
              type="button"
              @click="toggleEditProfile"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

      <!-- Notification Settings -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-semibold text-slate-800 mb-6">Notification Preferences</h2>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-slate-800">Appointment Reminders</h3>
              <p class="text-xs text-slate-600">Get notified about upcoming appointments</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                v-model="notificationSettings.appointmentReminders"
                type="checkbox" 
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-slate-800">Task Reminders</h3>
              <p class="text-xs text-slate-600">Daily reminders for dental care tasks</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                v-model="notificationSettings.taskReminders"
                type="checkbox" 
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-slate-800">Photo Upload Reminders</h3>
              <p class="text-xs text-slate-600">Weekly reminders to upload oral health photos</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                v-model="notificationSettings.photoReminders"
                type="checkbox" 
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-slate-800">Doctor Messages</h3>
              <p class="text-xs text-slate-600">Notifications when doctors send messages</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                v-model="notificationSettings.doctorMessages"
                type="checkbox" 
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-slate-800">Family Notifications</h3>
              <p class="text-xs text-slate-600">Updates about family members' appointments and tasks</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                v-model="notificationSettings.familyNotifications"
                type="checkbox" 
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>

        <!-- Notification Method -->
        <div class="mt-6 pt-6 border-t border-gray-100">
          <h3 class="text-sm font-medium text-slate-800 mb-3">Notification Method</h3>
          <div class="space-y-2">
            <label class="flex items-center">
              <input 
                v-model="notificationSettings.method"
                type="radio"
                value="email"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span class="ml-2 text-sm text-slate-700">Email only</span>
            </label>
            <label class="flex items-center">
              <input 
                v-model="notificationSettings.method"
                type="radio"
                value="sms"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span class="ml-2 text-sm text-slate-700">SMS only</span>
            </label>
            <label class="flex items-center">
              <input 
                v-model="notificationSettings.method"
                type="radio"
                value="both"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span class="ml-2 text-sm text-slate-700">Both Email and SMS</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Privacy Settings -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-semibold text-slate-800 mb-6">Privacy & Data</h2>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-slate-800">Share Data with Family</h3>
              <p class="text-xs text-slate-600">Allow family members to view your dental records</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                v-model="privacySettings.shareWithFamily"
                type="checkbox" 
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-slate-800">AI Photo Analysis</h3>
              <p class="text-xs text-slate-600">Allow AI to analyze your uploaded oral health photos</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                v-model="privacySettings.aiPhotoAnalysis"
                type="checkbox" 
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-slate-800">Anonymous Usage Data</h3>
              <p class="text-xs text-slate-600">Help improve the service by sharing anonymous usage statistics</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                v-model="privacySettings.anonymousData"
                type="checkbox" 
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      <!-- Security Settings -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-semibold text-slate-800 mb-6">Security</h2>
        
        <div class="space-y-4">
          <button 
            @click="showChangePasswordModal = true"
            class="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center space-x-3">
              <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2m3 0V7a2 2 0 012-2m-6 2a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              <div class="text-left">
                <div class="text-sm font-medium text-slate-800">Change Password</div>
                <div class="text-xs text-slate-600">Update your account password</div>
              </div>
            </div>
            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>

          <button 
            @click="enable2FA"
            class="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center space-x-3">
              <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              <div class="text-left">
                <div class="text-sm font-medium text-slate-800">Two-Factor Authentication</div>
                <div class="text-xs text-slate-600">{{ securitySettings.twoFactorEnabled ? 'Enabled' : 'Add extra security to your account' }}</div>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-xs font-medium"
                    :class="securitySettings.twoFactorEnabled ? 'text-green-600' : 'text-slate-500'">
                {{ securitySettings.twoFactorEnabled ? 'On' : 'Off' }}
              </span>
              <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </button>

          <button 
            @click="viewLoginActivity"
            class="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center space-x-3">
              <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div class="text-left">
                <div class="text-sm font-medium text-slate-800">Login Activity</div>
                <div class="text-xs text-slate-600">View recent login attempts and sessions</div>
              </div>
            </div>
            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Data Export & Account -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-semibold text-slate-800 mb-6">Account Management</h2>
        
        <div class="space-y-4">
          <button 
            @click="exportData"
            class="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center space-x-3">
              <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <div class="text-left">
                <div class="text-sm font-medium text-slate-800">Export My Data</div>
                <div class="text-xs text-slate-600">Download a copy of your dental records and data</div>
              </div>
            </div>
            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>

          <button 
            @click="contactSupport"
            class="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center space-x-3">
              <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div class="text-left">
                <div class="text-sm font-medium text-slate-800">Contact Support</div>
                <div class="text-xs text-slate-600">Get help with your account or technical issues</div>
              </div>
            </div>
            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>

          <button 
            @click="showDeleteAccountModal = true"
            class="w-full flex items-center justify-between p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-red-600"
          >
            <div class="flex items-center space-x-3">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              <div class="text-left">
                <div class="text-sm font-medium">Delete Account</div>
                <div class="text-xs">Permanently delete your account and all data</div>
              </div>
            </div>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- App Information -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-semibold text-slate-800 mb-6">About</h2>
        
        <div class="space-y-4 text-sm">
          <div class="flex justify-between">
            <span class="text-slate-600">App Version</span>
            <span class="text-slate-800">1.2.3</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-600">Last Updated</span>
            <span class="text-slate-800">July 2024</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-600">Build</span>
            <span class="text-slate-800">#2024.07.456</span>
          </div>
        </div>

        <div class="mt-6 pt-6 border-t border-gray-100 space-y-2">
          <button 
            @click="viewPrivacyPolicy"
            class="block w-full text-left text-sm text-primary-600 hover:text-primary-700"
          >
            Privacy Policy
          </button>
          <button 
            @click="viewTermsOfService"
            class="block w-full text-left text-sm text-primary-600 hover:text-primary-700"
          >
            Terms of Service
          </button>
          <button 
            @click="viewLicenses"
            class="block w-full text-left text-sm text-primary-600 hover:text-primary-700"
          >
            Open Source Licenses
          </button>
        </div>
      </div>
    </main>

    <!-- Change Password Modal -->
    <div v-if="showChangePasswordModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-slate-800">Change Password</h3>
          <button @click="showChangePasswordModal = false" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="changePassword" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
            <input 
              v-model="passwordForm.currentPassword"
              type="password" 
              required
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">New Password</label>
            <input 
              v-model="passwordForm.newPassword"
              type="password" 
              required
              minlength="8"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p class="text-xs text-slate-500 mt-1">Must be at least 8 characters long</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
            <input 
              v-model="passwordForm.confirmPassword"
              type="password" 
              required
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div class="flex space-x-3 mt-6">
            <button 
              type="button"
              @click="showChangePasswordModal = false"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              :disabled="!isPasswordFormValid"
              class="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Account Modal -->
    <div v-if="showDeleteAccountModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-red-600">Delete Account</h3>
          <button @click="showDeleteAccountModal = false" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="mb-6">
          <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-sm font-medium text-red-800">Warning: This action cannot be undone</span>
            </div>
          </div>
          
          <p class="text-sm text-slate-600 mb-4">
            Deleting your account will permanently remove:
          </p>
          <ul class="text-sm text-slate-600 list-disc list-inside space-y-1 mb-4">
            <li>All your dental records and medical history</li>
            <li>Family member information and relationships</li>
            <li>Appointment history and scheduled appointments</li>
            <li>Photos and AI analysis results</li>
            <li>Chat history and conversations</li>
            <li>All personal data and preferences</li>
          </ul>
          
          <p class="text-sm text-slate-600">
            Type <strong>"DELETE"</strong> to confirm:
          </p>
        </div>

        <form @submit.prevent="deleteAccount" class="space-y-4">
          <input 
            v-model="deleteConfirmation"
            type="text" 
            placeholder="Type DELETE to confirm"
            class="w-full p-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />

          <div class="flex space-x-3">
            <button 
              type="button"
              @click="showDeleteAccountModal = false"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              :disabled="deleteConfirmation !== 'DELETE'"
              class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Delete Account
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Avatar Upload Input -->
    <input 
      ref="avatarInput"
      type="file"
      accept="image/*"
      @change="handleAvatarUpload"
      class="hidden"
    />

    <!-- Floating Chat Button -->
    <button 
      @click="openChat"
      class="fixed bottom-24 right-4 w-14 h-14 bg-accent-500 hover:bg-accent-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
      </svg>
    </button>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'ProfileSettings',
  setup() {
    const router = useRouter()
    
    // Reactive data
    const editingProfile = ref(false)
    const showChangePasswordModal = ref(false)
    const showDeleteAccountModal = ref(false)
    const deleteConfirmation = ref('')
    const avatarInput = ref(null)

    // Profile data
    const profileData = ref({
      name: 'Sarah Johnson',
      initials: 'SJ',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      dateOfBirth: new Date('1990-03-15'),
      address: '123 Main Street, Anytown, ST 12345',
      emergencyContact: 'Michael Johnson - +1 (555) 123-4568',
      insurance: 'Dental Plus Insurance',
      policyNumber: 'DP-123456789',
      medicalConditions: 'Sensitive teeth, mild gum sensitivity. No known allergies.',
      avatar: null
    })

    // Edit form
    const editForm = ref({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      address: '',
      emergencyContact: '',
      insurance: '',
      policyNumber: '',
      medicalConditions: ''
    })

    // Password form
    const passwordForm = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    // Settings
    const notificationSettings = ref({
      appointmentReminders: true,
      taskReminders: true,
      photoReminders: true,
      doctorMessages: true,
      familyNotifications: true,
      method: 'both'
    })

    const privacySettings = ref({
      shareWithFamily: true,
      aiPhotoAnalysis: true,
      anonymousData: false
    })

    const securitySettings = ref({
      twoFactorEnabled: false,
      lastLogin: new Date(),
      loginAttempts: []
    })

    // Computed properties
    const isPasswordFormValid = computed(() => {
      return passwordForm.value.currentPassword &&
             passwordForm.value.newPassword &&
             passwordForm.value.confirmPassword &&
             passwordForm.value.newPassword === passwordForm.value.confirmPassword &&
             passwordForm.value.newPassword.length >= 8
    })

    // Methods
    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const calculateAge = (dateOfBirth) => {
      const today = new Date()
      const birthDate = new Date(dateOfBirth)
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      
      return age
    }

    const toggleEditProfile = () => {
      if (!editingProfile.value) {
        // Initialize edit form with current data
        const nameParts = profileData.value.name.split(' ')
        editForm.value = {
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: profileData.value.email,
          phone: profileData.value.phone,
          dateOfBirth: profileData.value.dateOfBirth.toISOString().split('T')[0],
          address: profileData.value.address,
          emergencyContact: profileData.value.emergencyContact,
          insurance: profileData.value.insurance,
          policyNumber: profileData.value.policyNumber,
          medicalConditions: profileData.value.medicalConditions
        }
      }
      editingProfile.value = !editingProfile.value
    }

    const saveProfile = () => {
      // TODO: Send API request to update profile
      console.log('Saving profile:', editForm.value)
      
      // Update profile data
      profileData.value = {
        ...profileData.value,
        name: `${editForm.value.firstName} ${editForm.value.lastName}`,
        initials: `${editForm.value.firstName[0]}${editForm.value.lastName[0]}`,
        email: editForm.value.email,
        phone: editForm.value.phone,
        dateOfBirth: new Date(editForm.value.dateOfBirth),
        address: editForm.value.address,
        emergencyContact: editForm.value.emergencyContact,
        insurance: editForm.value.insurance,
        policyNumber: editForm.value.policyNumber,
        medicalConditions: editForm.value.medicalConditions
      }
      
      editingProfile.value = false
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
        }
        reader.readAsDataURL(file)
      }
    }

    const changePassword = () => {
      // TODO: Send API request to change password
      console.log('Changing password...')
      
      // Reset form
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
      showChangePasswordModal.value = false
      
      // Show success message
      alert('Password changed successfully!')
    }

    const enable2FA = () => {
      // TODO: Implement 2FA setup
      console.log('Setting up 2FA...')
      securitySettings.value.twoFactorEnabled = !securitySettings.value.twoFactorEnabled
    }

    const viewLoginActivity = () => {
      // TODO: Show login activity modal
      console.log('Viewing login activity...')
    }

    const exportData = () => {
      // TODO: Implement data export
      console.log('Exporting user data...')
      alert('Data export request submitted. You will receive an email with your data within 24 hours.')
    }

    const contactSupport = () => {
      // TODO: Open support chat or email
      console.log('Contacting support...')
      alert('Redirecting to support portal...')
    }

    const deleteAccount = () => {
      // TODO: Send API request to delete account
      console.log('Deleting account...')
      
      // Show confirmation and redirect to login
      alert('Account deletion request submitted. You will be logged out.')
      router.push('/auth/login')
    }

    const viewPrivacyPolicy = () => {
      // TODO: Open privacy policy
      console.log('Viewing privacy policy...')
    }

    const viewTermsOfService = () => {
      // TODO: Open terms of service
      console.log('Viewing terms of service...')
    }

    const viewLicenses = () => {
      // TODO: Open licenses page
      console.log('Viewing open source licenses...')
    }

    const openChat = () => {
      // TODO: Open chat interface
      console.log('Opening chat...')
    }

    // Watch for settings changes to auto-save
    watch([notificationSettings, privacySettings], () => {
      // TODO: Auto-save settings to API
      console.log('Settings updated')
    }, { deep: true })

    onMounted(() => {
      // TODO: Fetch user profile and settings from API
      console.log('Fetching user profile and settings...')
    })

    return {
      // Reactive data
      editingProfile,
      showChangePasswordModal,
      showDeleteAccountModal,
      deleteConfirmation,
      avatarInput,
      profileData,
      editForm,
      passwordForm,
      notificationSettings,
      privacySettings,
      securitySettings,
      
      // Computed
      isPasswordFormValid,
      
      // Methods
      formatDate,
      calculateAge,
      toggleEditProfile,
      saveProfile,
      changeAvatar,
      handleAvatarUpload,
      changePassword,
      enable2FA,
      viewLoginActivity,
      exportData,
      contactSupport,
      deleteAccount,
      viewPrivacyPolicy,
      viewTermsOfService,
      viewLicenses,
      openChat
    }
  }
}
</script>

<style scoped>
/* Ensure proper color classes */
.bg-primary-600 { background-color: #0066CC; }
.bg-primary-700 { background-color: #0052a3; }
.bg-primary-100 { background-color: #e6f3ff; }
.text-primary-600 { color: #0066CC; }
.text-primary-700 { color: #0052a3; }
.bg-secondary-600 { background-color: #00A86B; }
.text-secondary-600 { color: #00A86B; }
.bg-accent-500 { background-color: #FF6B35; }
.bg-accent-600 { background-color: #e55a2b; }
.bg-neutral-50 { background-color: #F8FAFC; }

/* Toggle switch styling */
.peer:checked ~ .peer-checked\:bg-primary-600 {
  background-color: #0066CC;
}

.peer-focus\:ring-primary-300:focus ~ * {
  ring-color: rgba(0, 102, 204, 0.3);
}

/* Modal backdrop blur */
.fixed.inset-0.bg-black.bg-opacity-50 {
  backdrop-filter: blur(4px);
}

/* Form styling */
input:focus,
select:focus,
textarea:focus {
  outline: none;
  ring: 2px;
  ring-color: #0066CC;
  border-color: transparent;
}

/* Radio button styling */
input[type="radio"]:checked {
  background-color: #0066CC;
  border-color: #0066CC;
}

input[type="radio"]:focus {
  ring-color: rgba(0, 102, 204, 0.3);
}

/* Transition effects */
.transition-colors {
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
}

/* Avatar upload area */
.relative .absolute {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .md\:grid-cols-2 {
    grid-template-columns: 1fr;
  }
  
  .md\:col-span-2 {
    grid-column: span 1;
  }
}

/* Warning styling */
.bg-red-50 { background-color: #fef2f2; }
.border-red-200 { border-color: #fecaca; }
.border-red-300 { border-color: #fca5a5; }
.text-red-600 { color: #dc2626; }
.text-red-800 { color: #991b1b; }
.bg-red-600 { background-color: #dc2626; }
.bg-red-700 { background-color: #b91c1c; }

/* Success colors */
.text-green-600 { color: #16a34a; }

/* List styling */
.list-disc {
  list-style-type: disc;
}

.list-inside {
  list-style-position: inside;
}
</style>
const DoctorSecretaryProfileTemplate = `
<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div class="px-4 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl font-semibold text-slate-800">Profile & Settings</h1>
            <p class="text-sm text-slate-600">Manage your professional account and preferences</p>
          </div>
          <button
            @click="toggleEditProfile"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
          >
            {{ editingProfile ? 'Cancel' : 'Edit Profile' }}
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="px-4 py-6 space-y-6">
      <!-- Profile Information -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-slate-800">Professional Information</h2>
          <span 
            class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
            :class="getRoleClass(profileData.role)"
          >
            {{ profileData.role === 'doctor' ? 'Doctor' : 'Secretary' }}
          </span>
        </div>

        <div v-if="!editingProfile" class="space-y-6">
          <!-- Profile Display -->
          <div class="flex items-start space-x-6">
            <div class="relative">
              <div class="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                <img 
                  v-if="profileData.avatar"
                  :src="profileData.avatar"
                  :alt="profileData.name"
                  class="w-24 h-24 rounded-full object-cover"
                />
                <span v-else class="text-primary-600 text-2xl font-bold">{{ profileData.initials }}</span>
              </div>
              <button 
                @click="changeAvatar"
                class="absolute -bottom-1 -right-1 w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </button>
            </div>
            <div class="flex-1">
              <h3 class="text-2xl font-semibold text-slate-800">{{ profileData.title }} {{ profileData.name }}</h3>
              <p class="text-slate-600 text-lg">{{ profileData.specialty }}</p>
              <div class="mt-2 space-y-1">
                <p class="text-slate-600 flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  {{ profileData.email }}
                </p>
                <p class="text-slate-600 flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  {{ profileData.phone }}
                </p>
              </div>
            </div>
          </div>

          <!-- Professional Details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">License Number</label>
              <p class="text-slate-800">{{ profileData.licenseNumber || 'Not provided' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Years of Experience</label>
              <p class="text-slate-800">{{ profileData.experience }} years</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Clinic</label>
              <p class="text-slate-800">{{ profileData.clinic }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Department</label>
              <p class="text-slate-800">{{ profileData.department }}</p>
            </div>
            <div v-if="profileData.role === 'doctor'" class="md:col-span-2">
              <label class="block text-sm font-medium text-slate-700 mb-1">Education & Credentials</label>
              <p class="text-slate-800">{{ profileData.education || 'Not provided' }}</p>
            </div>
          </div>
        </div>

        <!-- Edit Profile Form -->
        <form v-else @submit.prevent="saveProfile" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">First Name *</label>
              <input 
                v-model="editForm.firstName"
                type="text" 
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Last Name *</label>
              <input 
                v-model="editForm.lastName"
                type="text" 
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Email *</label>
              <input 
                v-model="editForm.email"
                type="email" 
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Phone *</label>
              <input 
                v-model="editForm.phone"
                type="tel" 
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Specialty</label>
              <select 
                v-model="editForm.specialty"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select Specialty</option>
                <option value="General Dentistry">General Dentistry</option>
                <option value="Orthodontics">Orthodontics</option>
                <option value="Endodontics">Endodontics</option>
                <option value="Periodontics">Periodontics</option>
                <option value="Oral Surgery">Oral Surgery</option>
                <option value="Pediatric Dentistry">Pediatric Dentistry</option>
                <option value="Administration">Administration</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">License Number</label>
              <input 
                v-model="editForm.licenseNumber"
                type="text"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div v-if="profileData.role === 'doctor'" class="md:col-span-2">
              <label class="block text-sm font-medium text-slate-700 mb-2">Education & Credentials</label>
              <textarea 
                v-model="editForm.education"
                rows="3"
                placeholder="List your degrees, certifications, and professional credentials..."
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

      <!-- Working Hours -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-slate-800">Working Hours & Availability</h2>
          <button
            @click="editingSchedule = !editingSchedule"
            class="text-sm text-primary-600 hover:text-primary-700"
          >
            {{ editingSchedule ? 'Cancel' : 'Edit Schedule' }}
          </button>
        </div>

        <div v-if="!editingSchedule">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="day in Object.keys(workingHours)"
              :key="day"
              class="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
            >
              <span class="font-medium text-slate-800 capitalize">{{ day }}</span>
              <span 
                class="text-sm"
                :class="workingHours[day].enabled ? 'text-slate-600' : 'text-gray-400'"
              >
                {{ workingHours[day].enabled ? (workingHours[day].start + ' - ' + workingHours[day].end) : 'Off' }}
              </span>
            </div>
          </div>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="day in Object.keys(workingHours)"
            :key="day"
            class="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <input
                v-model="workingHours[day].enabled"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span class="font-medium text-slate-800 capitalize w-20">{{ day }}</span>
            </div>
            <div v-if="workingHours[day].enabled" class="flex items-center space-x-2">
              <input
                v-model="workingHours[day].start"
                type="time"
                class="px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <span class="text-gray-400">to</span>
              <input
                v-model="workingHours[day].end"
                type="time"
                class="px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
          <div class="flex space-x-3 pt-4">
            <button
              @click="editingSchedule = false"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="saveSchedule"
              class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Save Schedule
            </button>
          </div>
        </div>
      </div>

      <!-- Notification Settings -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-semibold text-slate-800 mb-6">Notification Preferences</h2>
        
        <div class="space-y-6">
          <!-- Clinical Notifications -->
          <div>
            <h3 class="text-md font-medium text-slate-800 mb-4">Clinical Notifications</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-slate-800">New Patient Messages</h4>
                  <p class="text-xs text-slate-600">Get notified when patients send new messages</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input 
                    v-model="notificationSettings.patientMessages"
                    type="checkbox" 
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-slate-800">Urgent Patient Reports</h4>
                  <p class="text-xs text-slate-600">Immediate alerts for emergency patient reports</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input 
                    v-model="notificationSettings.urgentReports"
                    type="checkbox" 
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-slate-800">AI Analysis Results</h4>
                  <p class="text-xs text-slate-600">Notifications when AI completes photo analysis</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input 
                    v-model="notificationSettings.aiAnalysis"
                    type="checkbox" 
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>

          <!-- Scheduling Notifications -->
          <div>
            <h3 class="text-md font-medium text-slate-800 mb-4">Scheduling Notifications</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-slate-800">Appointment Requests</h4>
                  <p class="text-xs text-slate-600">New appointment requests requiring approval</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input 
                    v-model="notificationSettings.appointmentRequests"
                    type="checkbox" 
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-slate-800">Schedule Changes</h4>
                  <p class="text-xs text-slate-600">Cancellations, reschedules, and no-shows</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input 
                    v-model="notificationSettings.scheduleChanges"
                    type="checkbox" 
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-slate-800">Daily Schedule Summary</h4>
                  <p class="text-xs text-slate-600">Morning summary of the day's appointments</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input 
                    v-model="notificationSettings.dailySummary"
                    type="checkbox" 
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>

          <!-- Notification Method -->
          <div>
            <h3 class="text-md font-medium text-slate-800 mb-4">Notification Method</h3>
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
                <span class="ml-2 text-sm text-slate-700">Both email and SMS</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Security Settings -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-semibold text-slate-800 mb-6">Security & Privacy</h2>
        
        <div class="space-y-6">
          <!-- Password Change -->
          <div>
            <h3 class="text-md font-medium text-slate-800 mb-4">Change Password</h3>
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
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                  <input 
                    v-model="passwordForm.newPassword"
                    type="password" 
                    required
                    minlength="8"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
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
              </div>
              <button 
                type="submit"
                :disabled="!isPasswordFormValid"
                class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Update Password
              </button>
            </form>
          </div>

          <!-- Two-Factor Authentication -->
          <div class="border-t border-gray-100 pt-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-md font-medium text-slate-800">Two-Factor Authentication</h3>
                <p class="text-sm text-slate-600">Add an extra layer of security to your account</p>
              </div>
              <button
                @click="toggle2FA"
                :class="securitySettings.twoFactorEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'"
                class="px-4 py-2 text-white rounded-lg transition-colors text-sm"
              >
                {{ securitySettings.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA' }}
              </button>
            </div>
          </div>

          <!-- Login Activity -->
          <div class="border-t border-gray-100 pt-6">
            <h3 class="text-md font-medium text-slate-800 mb-4">Recent Login Activity</h3>
            <div class="space-y-3">
              <div
                v-for="login in securitySettings.recentLogins"
                :key="login.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <div class="text-sm font-medium text-slate-800">{{ login.device }}</div>
                  <div class="text-xs text-slate-600">{{ login.location }} • {{ formatDateTime(login.timestamp) }}</div>
                </div>
                <div 
                  class="w-2 h-2 rounded-full"
                  :class="login.current ? 'bg-green-400' : 'bg-gray-400'"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Statistics -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-semibold text-slate-800 mb-6">Performance Overview</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- This Month Stats -->
          <div class="space-y-4">
            <h3 class="text-md font-medium text-slate-800">This Month</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-slate-600">Patients Seen:</span>
                <span class="font-semibold text-slate-800">{{ monthlyStats.patientsSeen }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-slate-600">Appointments:</span>
                <span class="font-semibold text-slate-800">{{ monthlyStats.appointments }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-slate-600">Hours Worked:</span>
                <span class="font-semibold text-slate-800">{{ monthlyStats.hoursWorked }}</span>
              </div>
              <div v-if="profileData.role === 'doctor'" class="flex justify-between items-center">
                <span class="text-sm text-slate-600">Procedures:</span>
                <span class="font-semibold text-slate-800">{{ monthlyStats.procedures }}</span>
              </div>
            </div>
          </div>

          <!-- Patient Satisfaction -->
          <div class="space-y-4">
            <h3 class="text-md font-medium text-slate-800">Patient Feedback</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-slate-600">Satisfaction Rate:</span>
                <span class="font-semibold text-green-600">{{ monthlyStats.satisfactionRate }}%</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-slate-600">Response Rate:</span>
                <span class="font-semibold text-slate-800">{{ monthlyStats.responseRate }}%</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-slate-600">Avg. Rating:</span>
                <div class="flex items-center">
                  <span class="font-semibold text-slate-800 mr-1">{{ monthlyStats.avgRating }}</span>
                  <div class="flex">
                    <svg v-for="star in 5" :key="star" class="w-3 h-3" :class="star <= monthlyStats.avgRating ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="space-y-4">
            <h3 class="text-md font-medium text-slate-800">Quick Actions</h3>
            <div class="space-y-2">
              <button 
                @click="downloadData"
                class="w-full bg-blue-600 text-white p-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                Download My Data
              </button>
              <button 
                @click="exportSchedule"
                class="w-full bg-green-600 text-white p-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
              >
                Export Schedule
              </button>
              <button 
                @click="contactSupport"
                class="w-full bg-purple-600 text-white p-2 rounded-lg text-sm hover:bg-purple-700 transition-colors"
              >
                Contact Support
              </button>
              <button 
                @click="signOut"
                class="w-full bg-red-600 text-white p-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Avatar Upload Modal -->
    <div v-if="showAvatarModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-slate-800">Change Profile Photo</h3>
          <button @click="showAvatarModal = false" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <input 
              ref="avatarInput"
              type="file"
              @change="handleAvatarSelect"
              accept="image/*"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p class="text-xs text-slate-500 mt-1">Upload a professional photo (JPG, PNG, max 5MB)</p>
          </div>

          <div class="flex space-x-3">
            <button 
              @click="showAvatarModal = false"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              @click="uploadAvatar"
              :disabled="!selectedAvatar"
              class="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Upload Photo
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
  name: 'DoctorSecretaryProfile',
  setup() {
    const router = useRouter()
    
    // Reactive data
    const editingProfile = ref(false)
    const editingSchedule = ref(false)
    const showAvatarModal = ref(false)
    const selectedAvatar = ref(null)

    // Profile data - replace with API call
    const profileData = ref({
      name: 'John Smith',
      title: 'Dr.',
      initials: 'JS',
      role: 'doctor', // 'doctor' or 'secretary'
      specialty: 'General Dentistry',
      email: 'dr.smith@dentalclinic.com',
      phone: '+1 (555) 123-4567',
      licenseNumber: 'DDS-12345',
      experience: 12,
      clinic: 'Downtown Dental Center',
      department: 'General Dentistry',
      education: 'DDS from University of Dental Medicine, Certified in Advanced Restorative Dentistry',
      avatar: null
    })

    // Edit form
    const editForm = ref({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      specialty: '',
      licenseNumber: '',
      education: ''
    })

    // Password form
    const passwordForm = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    // Working hours
    const workingHours = ref({
      monday: { enabled: true, start: '08:00', end: '17:00' },
      tuesday: { enabled: true, start: '08:00', end: '17:00' },
      wednesday: { enabled: true, start: '08:00', end: '17:00' },
      thursday: { enabled: true, start: '08:00', end: '17:00' },
      friday: { enabled: true, start: '08:00', end: '15:00' },
      saturday: { enabled: false, start: '09:00', end: '13:00' },
      sunday: { enabled: false, start: '09:00', end: '13:00' }
    })

    // Settings
    const notificationSettings = ref({
      patientMessages: true,
      urgentReports: true,
      aiAnalysis: true,
      appointmentRequests: true,
      scheduleChanges: true,
      dailySummary: true,
      method: 'both'
    })

    const securitySettings = ref({
      twoFactorEnabled: false,
      recentLogins: [
        {
          id: 1,
          device: 'Chrome on Windows',
          location: 'New York, NY',
          timestamp: new Date(),
          current: true
        },
        {
          id: 2,
          device: 'Safari on iPhone',
          location: 'New York, NY',
          timestamp: new Date(Date.now() - 86400000),
          current: false
        }
      ]
    })

    const monthlyStats = ref({
      patientsSeen: 156,
      appointments: 142,
      hoursWorked: 168,
      procedures: 89,
      satisfactionRate: 94,
      responseRate: 87,
      avgRating: 4.8
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
    const getRoleClass = (role) => {
      return role === 'doctor' 
        ? 'bg-blue-100 text-blue-700' 
        : 'bg-green-100 text-green-700'
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
          specialty: profileData.value.specialty,
          licenseNumber: profileData.value.licenseNumber,
          education: profileData.value.education
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
        name: editForm.value.firstName + ' ' + editForm.value.lastName,
        email: editForm.value.email,
        phone: editForm.value.phone,
        specialty: editForm.value.specialty,
        licenseNumber: editForm.value.licenseNumber,
        education: editForm.value.education
      }
      
      editingProfile.value = false
    }

    const saveSchedule = () => {
      // TODO: Send API request to update working hours
      console.log('Saving schedule:', workingHours.value)
      editingSchedule.value = false
    }

    const changePassword = () => {
      // TODO: Send API request to change password
      console.log('Changing password')
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }

    const toggle2FA = () => {
      // TODO: Implement 2FA toggle
      console.log('Toggle 2FA:', !securitySettings.value.twoFactorEnabled)
      securitySettings.value.twoFactorEnabled = !securitySettings.value.twoFactorEnabled
    }

    const changeAvatar = () => {
      showAvatarModal.value = true
    }

    const handleAvatarSelect = (event) => {
      const file = event.target.files[0]
      if (file) {
        selectedAvatar.value = file
      }
    }

    const uploadAvatar = () => {
      // TODO: Upload avatar to server
      console.log('Uploading avatar:', selectedAvatar.value)
      
      // Create preview URL
      if (selectedAvatar.value) {
        profileData.value.avatar = URL.createObjectURL(selectedAvatar.value)
      }
      
      showAvatarModal.value = false
      selectedAvatar.value = null
    }

    const formatDateTime = (date) => {
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const downloadData = () => {
      // TODO: Generate and download user data
      console.log('Downloading user data')
    }

    const exportSchedule = () => {
      // TODO: Export schedule data
      console.log('Exporting schedule')
    }

    const contactSupport = () => {
      // TODO: Open support contact form
      console.log('Contacting support')
    }

    const signOut = () => {
      // TODO: Implement sign out
      console.log('Signing out')
      router.push('/auth/login')
    }

    // Lifecycle
    onMounted(() => {
      console.log('DoctorSecretaryProfile component mounted')
      // TODO: Load user profile data from API
    })

    return {
      // Reactive data
      editingProfile,
      editingSchedule,
      showAvatarModal,
      selectedAvatar,
      profileData,
      editForm,
      passwordForm,
      workingHours,
      notificationSettings,
      securitySettings,
      monthlyStats,
      
      // Computed
      isPasswordFormValid,
      
      // Methods
      getRoleClass,
      toggleEditProfile,
      saveProfile,
      saveSchedule,
      changePassword,
      toggle2FA,
      changeAvatar,
      handleAvatarSelect,
      uploadAvatar,
      formatDateTime,
      downloadData,
      exportSchedule,
      contactSupport,
      signOut
    }
  }
}
</script>

<style scoped>
/* Color definitions */
.bg-primary-600 { background-color: #0066CC; }
.bg-primary-700 { background-color: #0052a3; }
.bg-primary-100 { background-color: #e6f3ff; }
.text-primary-600 { color: #0066CC; }
.text-primary-700 { color: #0052a3; }

/* Toggle switch styling */
.peer:checked ~ .peer-checked\:bg-primary-600 {
  background-color: #0066CC;
}

.peer:focus ~ .peer-focus\:ring-primary-300 {
  box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.3);
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

/* Focus states */
.focus\:ring-2:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px #0066CC;
}

/* Hover effects */
button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}

/* File input styling */
input[type="file"] {
  font-size: 14px;
}

input[type="file"]::-webkit-file-upload-button {
  background-color: #f8fafc;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  color: #374151;
  cursor: pointer;
  font-size: 14px;
  margin-right: 12px;
  padding: 8px 12px;
}

input[type="file"]::-webkit-file-upload-button:hover {
  background-color: #f1f5f9;
}

/* Modal backdrop */
.fixed.inset-0.bg-black.bg-opacity-50 {
  backdrop-filter: blur(4px);
}

/* Card animations */
.bg-white {
  transition: all 0.2s ease;
}

.bg-white:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
</style>`;
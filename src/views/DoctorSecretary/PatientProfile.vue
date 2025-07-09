<!--
  Patient Profile Component
  
  Detailed patient view with:
  - Complete patient information
  - Medical history and records
  - Appointment history
  - Treatment plans
  - Family member management
  - Photo gallery with AI analysis
  - Clinical notes integration
-->
<template>
  <div class="p-4 space-y-6">
    <!-- Header Section -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <!-- Patient Basic Info -->
        <div class="flex items-start space-x-4">
          <!-- Avatar -->
          <div class="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center">
            <span class="text-2xl font-bold text-slate-600">
              {{ patient?.name?.split(' ').map(n => n[0]).join('') || 'P' }}
            </span>
          </div>
          
          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-2">
              <h1 class="text-2xl font-bold text-slate-800">{{ patient?.name || 'Loading...' }}</h1>
              <span 
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                :class="getHealthStatusClasses(patient?.healthStatus)"
              >
                {{ patient?.healthStatus || 'Unknown' }}
              </span>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-slate-600">Email:</span>
                <span class="ml-2 text-slate-800">{{ patient?.email || 'N/A' }}</span>
              </div>
              <div>
                <span class="text-slate-600">Phone:</span>
                <span class="ml-2 text-slate-800">{{ patient?.phone || 'N/A' }}</span>
              </div>
              <div>
                <span class="text-slate-600">Age:</span>
                <span class="ml-2 text-slate-800">{{ patient?.age || 'N/A' }} years</span>
              </div>
              <div>
                <span class="text-slate-600">Member since:</span>
                <span class="ml-2 text-slate-800">{{ formatDate(patient?.memberSince) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-3">
          <button 
            @click="openChat"
            class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Send Message
          </button>
          
          <button 
            @click="bookAppointment"
            class="bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a1 1 0 001 1h6a1 1 0 001-1V11a1 1 0 00-1-1H9a1 1 0 00-1 1z" />
            </svg>
            Book Appointment
          </button>
          
          <button 
            v-if="userRole === 'doctor'"
            @click="openClinicalNotes"
            class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Clinical Notes
          </button>
        </div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100">
      <div class="border-b border-gray-200">
        <nav class="flex space-x-8 px-6" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
            :class="activeTab === tab.id 
              ? 'border-primary-500 text-primary-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'"
          >
            <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="tab.icon" />
            </svg>
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="p-6">
        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'" class="space-y-6">
          <!-- Health Summary -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-blue-600 font-medium">Oral Health Score</p>
                  <p class="text-2xl font-bold text-blue-800">{{ patient?.healthScore || 0 }}/100</p>
                </div>
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-green-50 rounded-lg p-4 border border-green-100">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-green-600 font-medium">Completed Visits</p>
                  <p class="text-2xl font-bold text-green-800">{{ patient?.completedVisits || 0 }}</p>
                </div>
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
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
                  <p class="text-2xl font-bold text-yellow-800">{{ patient?.pendingTasks || 0 }}</p>
                </div>
                <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div>
            <h3 class="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h3>
            <div class="space-y-3">
              <div
                v-for="activity in patient?.recentActivity || []"
                :key="activity.id"
                class="flex items-start space-x-3 p-3 rounded-lg border border-gray-100"
              >
                <div 
                  class="w-3 h-3 rounded-full mt-2"
                  :class="getActivityColor(activity.type)"
                ></div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-slate-800">{{ activity.title }}</p>
                  <p class="text-sm text-slate-600">{{ activity.description }}</p>
                  <span class="text-xs text-slate-500">{{ formatDate(activity.date) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Medical History Tab -->
        <div v-else-if="activeTab === 'medical'" class="space-y-6">
          <!-- Medical Conditions -->
          <div>
            <h3 class="text-lg font-semibold text-slate-800 mb-4">Medical Conditions</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="condition in patient?.medicalConditions || []"
                :key="condition.id"
                class="p-4 rounded-lg border border-gray-200"
              >
                <div class="flex items-center justify-between mb-2">
                  <h4 class="font-medium text-slate-800">{{ condition.name }}</h4>
                  <span 
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    :class="getSeverityClasses(condition.severity)"
                  >
                    {{ condition.severity }}
                  </span>
                </div>
                <p class="text-sm text-slate-600">{{ condition.description }}</p>
                <p class="text-xs text-slate-500 mt-2">Diagnosed: {{ formatDate(condition.diagnosedDate) }}</p>
              </div>
            </div>
          </div>

          <!-- Allergies -->
          <div>
            <h3 class="text-lg font-semibold text-slate-800 mb-4">Allergies</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="allergy in patient?.allergies || []"
                :key="allergy"
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800"
              >
                {{ allergy }}
              </span>
            </div>
          </div>

          <!-- Medications -->
          <div>
            <h3 class="text-lg font-semibold text-slate-800 mb-4">Current Medications</h3>
            <div class="space-y-3">
              <div
                v-for="medication in patient?.medications || []"
                :key="medication.id"
                class="flex items-center justify-between p-3 rounded-lg border border-gray-100"
              >
                <div>
                  <p class="font-medium text-slate-800">{{ medication.name }}</p>
                  <p class="text-sm text-slate-600">{{ medication.dosage }} - {{ medication.frequency }}</p>
                </div>
                <span class="text-xs text-slate-500">Since {{ formatDate(medication.startDate) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Appointments Tab -->
        <div v-else-if="activeTab === 'appointments'" class="space-y-6">
          <!-- Upcoming Appointments -->
          <div>
            <h3 class="text-lg font-semibold text-slate-800 mb-4">Upcoming Appointments</h3>
            <div class="space-y-3">
              <div
                v-for="appointment in upcomingAppointments"
                :key="appointment.id"
                class="flex items-center justify-between p-4 rounded-lg border border-gray-200"
              >
                <div class="flex items-center space-x-4">
                  <div class="text-center">
                    <div class="text-sm font-medium text-slate-800">{{ formatDate(appointment.date) }}</div>
                    <div class="text-xs text-slate-500">{{ appointment.time }}</div>
                  </div>
                  <div>
                    <p class="font-medium text-slate-800">{{ appointment.treatment }}</p>
                    <p class="text-sm text-slate-600">Dr. {{ appointment.doctor }}</p>
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
                    @click="editAppointment(appointment.id)"
                    class="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Appointment History -->
          <div>
            <h3 class="text-lg font-semibold text-slate-800 mb-4">Appointment History</h3>
            <div class="space-y-3 max-h-96 overflow-y-auto">
              <div
                v-for="appointment in appointmentHistory"
                :key="appointment.id"
                class="flex items-center justify-between p-3 rounded-lg border border-gray-100"
              >
                <div class="flex items-center space-x-3">
                  <div class="text-center">
                    <div class="text-sm text-slate-800">{{ formatDate(appointment.date) }}</div>
                    <div class="text-xs text-slate-500">{{ appointment.time }}</div>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-slate-800">{{ appointment.treatment }}</p>
                    <p class="text-xs text-slate-600">Dr. {{ appointment.doctor }}</p>
                  </div>
                </div>
                <span 
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  :class="getAppointmentStatusClasses(appointment.status)"
                >
                  {{ appointment.status }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Photos Tab -->
        <div v-else-if="activeTab === 'photos'" class="space-y-6">
          <!-- Photo Upload -->
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-slate-800">Photo Gallery</h3>
            <button 
              @click="$refs.photoInput.click()"
              class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Upload Photo
            </button>
            <input 
              ref="photoInput"
              type="file"
              accept="image/*"
              multiple
              class="hidden"
              @change="handlePhotoUpload"
            >
          </div>

          <!-- Photo Grid -->
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div
              v-for="photo in patient?.photos || []"
              :key="photo.id"
              class="relative group cursor-pointer"
              @click="openPhotoModal(photo)"
            >
              <img 
                :src="photo.thumbnail"
                :alt="`Photo ${photo.id}`"
                class="w-full h-32 object-cover rounded-lg"
              >
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                <svg class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              
              <!-- Photo info overlay -->
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 rounded-b-lg">
                <p class="text-white text-xs">{{ formatDate(photo.date) }}</p>
                <p v-if="photo.hasAIAnalysis" class="text-purple-300 text-xs">AI Analyzed</p>
              </div>
              
              <!-- AI Analysis button -->
              <button 
                v-if="userRole === 'doctor' && !photo.hasAIAnalysis"
                @click.stop="analyzePhoto(photo.id)"
                class="absolute top-2 right-2 bg-purple-600 text-white p-1 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                AI
              </button>
            </div>
          </div>
        </div>

        <!-- Family Tab -->
        <div v-else-if="activeTab === 'family'" class="space-y-6">
          <!-- Family Members -->
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-slate-800">Family Members</h3>
            <button 
              @click="addFamilyMember"
              class="bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Family Member
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="member in patient?.familyMembers || []"
              :key="member.id"
              class="p-4 rounded-lg border border-gray-200"
            >
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                    <span class="text-sm font-medium text-slate-600">
                      {{ member.name.split(' ').map(n => n[0]).join('') }}
                    </span>
                  </div>
                  <div>
                    <p class="font-medium text-slate-800">{{ member.name }}</p>
                    <p class="text-sm text-slate-600">{{ member.relationship }}</p>
                  </div>
                </div>
                <button 
                  @click="viewFamilyMember(member.id)"
                  class="text-primary-600 hover:text-primary-700 p-1"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              <div class="text-sm space-y-1">
                <div class="flex justify-between">
                  <span class="text-slate-600">Age:</span>
                  <span class="text-slate-800">{{ member.age }} years</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-600">Last Visit:</span>
                  <span class="text-slate-800">{{ formatDate(member.lastVisit) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-600">Status:</span>
                  <span 
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    :class="getHealthStatusClasses(member.healthStatus)"
                  >
                    {{ member.healthStatus }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Photo Modal -->
    <div v-if="showPhotoModal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" @click="closePhotoModal">
      <div class="max-w-4xl max-h-full p-4">
        <div class="bg-white rounded-lg overflow-hidden">
          <div class="p-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">{{ selectedPhoto?.title || 'Patient Photo' }}</h3>
              <button 
                @click="closePhotoModal"
                class="text-slate-400 hover:text-slate-600"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div class="p-4">
            <img :src="selectedPhoto?.url" alt="Full size photo" class="max-w-full max-h-96 object-contain mx-auto rounded-lg">
            <div class="mt-4 text-sm text-slate-600">
              <p>Taken: {{ formatDate(selectedPhoto?.date) }}</p>
              <p v-if="selectedPhoto?.hasAIAnalysis" class="text-purple-600">AI Analysis Available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'PatientProfile',
  emits: ['show-toast', 'show-error', 'show-success'],
  setup(props, { emit }) {
    const router = useRouter()
    const route = useRoute()
    const authStore = useAuthStore()
    
    // ==========================================
    // REACTIVE STATE
    // ==========================================
    
    const activeTab = ref('overview')
    const showPhotoModal = ref(false)
    const selectedPhoto = ref(null)
    const isLoading = ref(false)
    
    const tabs = ref([
      { 
        id: 'overview', 
        name: 'Overview', 
        icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z M3 7l9 6 9-6' 
      },
      { 
        id: 'medical', 
        name: 'Medical History', 
        icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' 
      },
      { 
        id: 'appointments', 
        name: 'Appointments', 
        icon: 'M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a1 1 0 001 1h6a1 1 0 001-1V11a1 1 0 00-1-1H9a1 1 0 00-1 1z' 
      },
      { 
        id: 'photos', 
        name: 'Photos', 
        icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' 
      },
      { 
        id: 'family', 
        name: 'Family', 
        icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' 
      }
    ])
    
    // Mock patient data - replace with API call
    const patient = ref({
      id: 'P001',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      age: 34,
      healthStatus: 'Good',
      memberSince: new Date('2022-03-15'),
      healthScore: 78,
      completedVisits: 12,
      pendingTasks: 3,
      recentActivity: [
        {
          id: 1,
          type: 'appointment',
          title: 'Routine Cleaning Completed',
          description: 'Regular cleaning and checkup completed successfully',
          date: new Date('2024-01-05')
        },
        {
          id: 2,
          type: 'task',
          title: 'Home Care Task Assigned',
          description: 'Fluoride rinse routine for 2 weeks',
          date: new Date('2024-01-03')
        }
      ],
      medicalConditions: [
        {
          id: 1,
          name: 'Gingivitis',
          severity: 'Mild',
          description: 'Mild inflammation of gums, improving with treatment',
          diagnosedDate: new Date('2023-08-15')
        }
      ],
      allergies: ['Penicillin', 'Latex'],
      medications: [
        {
          id: 1,
          name: 'Chlorhexidine Mouthwash',
          dosage: '15ml',
          frequency: 'Twice daily',
          startDate: new Date('2024-01-01')
        }
      ],
      photos: [
        {
          id: 1,
          url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop',
          thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=200&h=150&fit=crop',
          date: new Date('2024-01-05'),
          title: 'Post-cleaning photo',
          hasAIAnalysis: true
        },
        {
          id: 2,
          url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop',
          thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=200&h=150&fit=crop',
          date: new Date('2023-12-20'),
          title: 'Before treatment',
          hasAIAnalysis: false
        }
      ],
      familyMembers: [
        {
          id: 'F001',
          name: 'Jane Smith',
          relationship: 'Spouse',
          age: 32,
          healthStatus: 'Excellent',
          lastVisit: new Date('2024-01-02')
        },
        {
          id: 'F002',
          name: 'Tommy Smith',
          relationship: 'Son',
          age: 8,
          healthStatus: 'Good',
          lastVisit: new Date('2023-12-15')
        }
      ]
    })
    
    const upcomingAppointments = ref([
      {
        id: 1,
        date: new Date('2024-02-15'),
        time: '10:00 AM',
        treatment: 'Follow-up Checkup',
        doctor: 'Johnson',
        status: 'Confirmed'
      },
      {
        id: 2,
        date: new Date('2024-03-20'),
        time: '2:00 PM',
        treatment: 'Cavity Filling',
        doctor: 'Smith',
        status: 'Scheduled'
      }
    ])
    
    const appointmentHistory = ref([
      {
        id: 1,
        date: new Date('2024-01-05'),
        time: '9:00 AM',
        treatment: 'Routine Cleaning',
        doctor: 'Johnson',
        status: 'Completed'
      },
      {
        id: 2,
        date: new Date('2023-12-20'),
        time: '11:00 AM',
        treatment: 'Consultation',
        doctor: 'Smith',
        status: 'Completed'
      }
    ])
    
    // ==========================================
    // COMPUTED PROPERTIES
    // ==========================================
    
    const userRole = computed(() => authStore.user?.role)
    const patientId = computed(() => route.params.id)
    
    // ==========================================
    // METHODS
    // ==========================================
    
    const formatDate = (date) => {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
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
    
    const getSeverityClasses = (severity) => {
      switch (severity) {
        case 'Severe':
          return 'bg-red-100 text-red-800'
        case 'Moderate':
          return 'bg-yellow-100 text-yellow-800'
        case 'Mild':
          return 'bg-green-100 text-green-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }
    
    const getActivityColor = (type) => {
      switch (type) {
        case 'appointment':
          return 'bg-blue-500'
        case 'task':
          return 'bg-green-500'
        case 'alert':
          return 'bg-red-500'
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
    
    // Action methods
    const openChat = () => {
      router.push(`/doctor-secretary/chat?patient=${patientId.value}`)
    }
    
    const bookAppointment = () => {
      if (userRole.value === 'secretary') {
        router.push(`/doctor-secretary/appointment-approval?patient=${patientId.value}`)
      } else {
        router.push(`/doctor-secretary/appointments?patient=${patientId.value}`)
      }
    }
    
    const openClinicalNotes = () => {
      router.push(`/doctor-secretary/clinical-notes?patient=${patientId.value}`)
    }
    
    const editAppointment = (appointmentId) => {
      // TODO: Implement appointment editing
      emit('show-success', 'Appointment editing feature coming soon')
    }
    
    const handlePhotoUpload = (event) => {
      const files = event.target.files
      if (!files || files.length === 0) return
      
      // TODO: Implement photo upload to server
      emit('show-success', `${files.length} photo(s) uploaded successfully`)
      
      // Reset file input
      event.target.value = ''
    }
    
    const openPhotoModal = (photo) => {
      selectedPhoto.value = photo
      showPhotoModal.value = true
    }
    
    const closePhotoModal = () => {
      showPhotoModal.value = false
      selectedPhoto.value = null
    }
    
    const analyzePhoto = (photoId) => {
      // TODO: Implement AI photo analysis
      emit('show-success', 'AI analysis initiated for photo')
      router.push('/doctor-secretary/ai-diagnostics')
    }
    
    const addFamilyMember = () => {
      // TODO: Implement add family member modal/form
      emit('show-success', 'Add family member feature coming soon')
    }
    
    const viewFamilyMember = (memberId) => {
      router.push(`/doctor-secretary/patients/${memberId}`)
    }
    
    const loadPatientData = async () => {
      if (!patientId.value) return
      
      isLoading.value = true
      try {
        // TODO: Replace with actual API call
        // const response = await api.get(`/patients/${patientId.value}`)
        // patient.value = response.data
        
        emit('show-success', 'Patient data loaded successfully')
      } catch (error) {
        console.error('Error loading patient data:', error)
        emit('show-error', 'Failed to load patient data')
      } finally {
        isLoading.value = false
      }
    }
    
    // ==========================================
    // LIFECYCLE
    // ==========================================
    
    onMounted(() => {
      loadPatientData()
    })
    
    // ==========================================
    // RETURN FOR TEMPLATE
    // ==========================================
    
    return {
      // State
      activeTab,
      showPhotoModal,
      selectedPhoto,
      isLoading,
      tabs,
      patient,
      upcomingAppointments,
      appointmentHistory,
      
      // Computed
      userRole,
      patientId,
      
      // Methods
      formatDate,
      getHealthStatusClasses,
      getSeverityClasses,
      getActivityColor,
      getAppointmentStatusClasses,
      openChat,
      bookAppointment,
      openClinicalNotes,
      editAppointment,
      handlePhotoUpload,
      openPhotoModal,
      closePhotoModal,
      analyzePhoto,
      addFamilyMember,
      viewFamilyMember,
      loadPatientData
    }
  }
}
</script>

<style scoped>
/* Tab navigation styling */
.border-primary-500 {
  border-color: #0066CC;
}

.text-primary-600 {
  color: #0066CC;
}

/* Hover effects */
.hover\\:bg-primary-700:hover {
  background-color: #0052a3;
}

.hover\\:bg-secondary-700:hover {
  background-color: #047857;
}

.hover\\:bg-gray-200:hover {
  background-color: #e5e7eb;
}

.hover\\:text-slate-700:hover {
  color: #334155;
}

.hover\\:text-slate-600:hover {
  color: #475569;
}

.hover\\:text-primary-700:hover {
  color: #0052a3;
}

.hover\\:border-slate-300:hover {
  border-color: #cbd5e1;
}

/* Transition effects */
.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-opacity {
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Custom color classes */
.bg-primary-600 { background-color: #0066CC; }
.bg-primary-700 { background-color: #0052a3; }
.bg-secondary-600 { background-color: #00A86B; }
.bg-secondary-700 { background-color: #047857; }

/* Grid responsive */
.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

@media (min-width: 768px) {
  .md\\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .md\\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .lg\\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
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

/* Modal backdrop */
.fixed {
  position: fixed;
}

.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.z-50 {
  z-index: 50;
}

/* Group hover effects */
.group:hover .group-hover\\:opacity-100 {
  opacity: 1;
}

.group:hover .group-hover\\:bg-opacity-20 {
  background-color: rgba(0, 0, 0, 0.2);
}

/* Object fit utilities */
.object-cover {
  object-fit: cover;
}

.object-contain {
  object-fit: contain;
}

/* Hidden utility */
.hidden {
  display: none;
}

/* Gradient utilities */
.bg-gradient-to-t {
  background-image: linear-gradient(to top, var(--tw-gradient-stops));
}

.from-black {
  --tw-gradient-from: #000;
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(0, 0, 0, 0));
}

.to-transparent {
  --tw-gradient-to: transparent;
}
</style>
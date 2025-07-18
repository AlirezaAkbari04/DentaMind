<!--
  Patient Dashboard Component - Updated with Treatment Plan Request
  
  Main dashboard for patient interface with:
  - Health overview and key metrics
  - Treatment plan request functionality
  - Quick actions and upcoming appointments
  - Recent activity and health summary
-->
<template>
  <div class="min-h-screen bg-neutral-50 pb-20">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-100 px-4 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-semibold text-slate-800">
            Good {{ getTimeOfDay() }}, {{ currentUser?.username }}!
          </h1>
          <p class="text-sm text-slate-600 mt-1">{{ getCurrentDate() }}</p>
        </div>
        <div class="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
          <span class="text-white font-medium text-lg">{{ currentUser?.initials || 'U' }}</span>
        </div>
      </div>
    </header>

    <!-- Treatment Plan Request Button -->
    <div class="px-4 py-4">
      <button 
        @click="showTreatmentRequestModal = true"
        class="w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-4 rounded-xl text-lg font-medium transition-colors flex items-center justify-center space-x-3 shadow-lg"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span>Ask for Treatment Plan Generation</span>
      </button>
    </div>

    <!-- Main Content -->
    <main class="px-4 py-2 space-y-6">
      <!-- Health Summary Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-semibold text-slate-800 mb-4">Health Summary</h2>
        
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-2xl font-bold text-green-600">{{ healthScore }}%</p>
            <p class="text-sm text-slate-600">Oral Health Score</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <p class="text-2xl font-bold text-blue-600">{{ completedTasks }}</p>
            <p class="text-sm text-slate-600">Tasks Completed</p>
          </div>
        </div>
        
        <div class="bg-gray-50 rounded-lg p-3">
          <p class="text-sm text-slate-700">
            <span class="font-medium">Next Check-up:</span> 
            {{ nextCheckup || 'Schedule your next appointment' }}
          </p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
        
        <div class="grid grid-cols-2 gap-4">
          <button 
            @click="goToTasks"
            class="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 8h6m-6 4h6" />
              </svg>
            </div>
            <span class="text-sm font-medium text-slate-700">View Tasks</span>
            <span v-if="pendingTasks > 0" class="text-xs text-orange-600">{{ pendingTasks }} pending</span>
          </button>

          <button 
            @click="goToAppointments"
            class="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-slate-700">Appointments</span>
          </button>

          <button 
            @click="goToRecords"
            class="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-slate-700">Medical Records</span>
          </button>

          <button 
            @click="goToChat"
            class="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-slate-700">Chat</span>
          </button>
        </div>
      </div>

      <!-- Upcoming Appointments -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-slate-800">Upcoming Appointments</h2>
          <button 
            @click="goToAppointments"
            class="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View All
          </button>
        </div>

        <div v-if="upcomingAppointments.length === 0" class="text-center py-6">
          <p class="text-slate-500 mb-2">No upcoming appointments</p>
          <button 
            @click="goToAppointments"
            class="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Schedule an appointment
          </button>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="appointment in upcomingAppointments"
            :key="appointment.id"
            class="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
          >
            <div>
              <p class="font-medium text-slate-800">{{ appointment.type }}</p>
              <p class="text-sm text-slate-600">Dr. {{ appointment.doctor }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-slate-800">{{ formatDate(appointment.date) }}</p>
              <p class="text-xs text-slate-500">{{ appointment.time }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h2>
        
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
    </main>

    <!-- Treatment Plan Request Modal -->
    <div 
      v-if="showTreatmentRequestModal"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      @click="closeTreatmentRequestModal"
    >
      <div 
        class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div class="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-xl font-semibold text-slate-800">Request Treatment Plan</h3>
              <p class="text-slate-600">Please provide details about your dental concerns</p>
            </div>
            <button 
              @click="closeTreatmentRequestModal"
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form @submit.prevent="submitTreatmentRequest" class="p-6 space-y-6">
          <!-- Patient Information (Pre-filled) -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-lg font-semibold text-slate-800 mb-3">Patient Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  v-model="treatmentRequest.patientName"
                  type="text" 
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                  readonly
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Age</label>
                <input 
                  v-model="treatmentRequest.age"
                  type="number" 
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <input 
                  v-model="treatmentRequest.phone"
                  type="tel" 
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input 
                  v-model="treatmentRequest.email"
                  type="email" 
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                  readonly
                >
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <textarea 
                  v-model="treatmentRequest.address"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  rows="2"
                  required
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Medical History -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-lg font-semibold text-slate-800 mb-3">Medical History</h4>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Previous Dental Treatments</label>
                <textarea 
                  v-model="treatmentRequest.previousTreatments"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  rows="3"
                  placeholder="Please describe any previous dental work, surgeries, or treatments..."
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Allergies</label>
                <textarea 
                  v-model="treatmentRequest.allergies"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  rows="2"
                  placeholder="List any allergies to medications, materials, or other substances..."
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Medical Conditions</label>
                <textarea 
                  v-model="treatmentRequest.medicalConditions"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  rows="2"
                  placeholder="List any medical conditions, medications you're taking, or health concerns..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Problem Description -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">
              Problem Description <span class="text-red-500">*</span>
            </label>
            <textarea 
              v-model="treatmentRequest.problemDescription"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              rows="4"
              placeholder="Please describe your dental concerns, symptoms, pain level, and when the problem started..."
              required
            ></textarea>
          </div>

          <!-- Priority Level -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">
              Priority Level <span class="text-red-500">*</span>
            </label>
            <select 
              v-model="treatmentRequest.priority"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="">Select priority level</option>
              <option value="routine">Routine - Can wait for regular appointment</option>
              <option value="normal">Normal - Would like to be seen soon</option>
              <option value="urgent">Urgent - Need immediate attention</option>
            </select>
          </div>

          <!-- Medical Images -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">
              Medical Images
            </label>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input 
                ref="fileInput"
                type="file"
                multiple
                accept="image/*"
                @change="handleImageUpload"
                class="hidden"
              >
              <button 
                type="button"
                @click="$refs.fileInput.click()"
                class="bg-gray-100 hover:bg-gray-200 text-slate-700 px-4 py-2 rounded-lg transition-colors"
              >
                <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Upload Images
              </button>
              <p class="text-sm text-slate-500 mt-2">Upload photos of the affected area (optional)</p>
            </div>

            <!-- Image Preview -->
            <div v-if="treatmentRequest.images.length > 0" class="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              <div
                v-for="(image, index) in treatmentRequest.images"
                :key="index"
                class="relative group"
              >
                <img 
                  :src="image.preview" 
                  :alt="`Uploaded image ${index + 1}`"
                  class="w-full h-24 object-cover rounded-lg border border-gray-200"
                >
                <button 
                  type="button"
                  @click="removeImage(index)"
                  class="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <p class="text-xs text-slate-500 mt-1 truncate">{{ image.file.name }}</p>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex space-x-3 pt-4 border-t border-gray-200">
            <button 
              type="submit"
              class="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'Submitting...' : 'Submit Request' }}
            </button>
            <button 
              type="button"
              @click="closeTreatmentRequestModal"
              class="flex-1 border border-gray-300 text-slate-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'PatientDashboard',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    // ==========================================
    // REACTIVE STATE
    // ==========================================
    
    const showTreatmentRequestModal = ref(false)
    const isSubmitting = ref(false)
    
    // Dashboard data
    const healthScore = ref(85)
    const completedTasks = ref(7)
    const pendingTasks = ref(3)
    const nextCheckup = ref('March 15, 2024')
    
    const upcomingAppointments = ref([
      {
        id: 1,
        type: 'Regular Cleaning',
        doctor: 'Smith',
        date: '2024-01-20',
        time: '10:00 AM'
      },
      {
        id: 2,
        type: 'Follow-up',
        doctor: 'Johnson',
        date: '2024-01-25',
        time: '2:30 PM'
      }
    ])
    
    const recentActivity = ref([
      {
        id: 1,
        description: 'Completed daily brushing task',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 2,
        description: 'Uploaded new medical photo',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      {
        id: 3,
        description: 'Scheduled cleaning appointment',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ])
    
    // Treatment request form data
    const treatmentRequest = ref({
      patientName: '',
      age: '',
      phone: '',
      email: '',
      address: '',
      previousTreatments: '',
      allergies: '',
      medicalConditions: '',
      problemDescription: '',
      priority: '',
      images: []
    })
    
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
        day: 'numeric'
      })
    }
    
    const formatTimeAgo = (date) => {
      const now = new Date()
      const diffMs = now - new Date(date)
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      
      if (diffDays > 0) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
      } else if (diffHours > 0) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
      } else {
        return 'Just now'
      }
    }
    
    // ==========================================
    // NAVIGATION METHODS
    // ==========================================
    
    const goToTasks = () => {
      router.push('/patient/tasks')
    }
    
    const goToAppointments = () => {
      router.push('/patient/all-appointments')
    }
    
    const goToRecords = () => {
      router.push('/patient/medical-records')
    }
    
    const goToChat = () => {
      router.push('/patient/chat')
    }
    
    // ==========================================
    // TREATMENT REQUEST METHODS
    // ==========================================
    
    const initializeTreatmentRequest = () => {
      const user = currentUser.value
      treatmentRequest.value = {
        patientName: user?.name || user?.username || '',
        age: user?.age || '',
        phone: user?.phone || '',
        email: user?.email || '',
        address: user?.address || '',
        previousTreatments: '',
        allergies: '',
        medicalConditions: '',
        problemDescription: '',
        priority: '',
        images: []
      }
    }
    
    const closeTreatmentRequestModal = () => {
      showTreatmentRequestModal.value = false
      // Reset form
      initializeTreatmentRequest()
    }
    
    const handleImageUpload = (event) => {
      const files = Array.from(event.target.files)
      
      files.forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.onload = (e) => {
            treatmentRequest.value.images.push({
              file: file,
              preview: e.target.result,
              filename: file.name
            })
          }
          reader.readAsDataURL(file)
        }
      })
      
      // Clear the input
      event.target.value = ''
    }
    
    const removeImage = (index) => {
      treatmentRequest.value.images.splice(index, 1)
    }
    
    const submitTreatmentRequest = async () => {
      isSubmitting.value = true
      
      try {
        // Create form data for file upload
        const formData = new FormData()
        
        // Add text fields
        Object.keys(treatmentRequest.value).forEach(key => {
          if (key !== 'images') {
            formData.append(key, treatmentRequest.value[key])
          }
        })
        
        // Add images
        treatmentRequest.value.images.forEach((image, index) => {
          formData.append(`image_${index}`, image.file)
        })
        
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Success
        alert('Treatment plan request submitted successfully! You will receive a notification when a moderator reviews your request.')
        closeTreatmentRequestModal()
        
      } catch (error) {
        console.error('Error submitting treatment request:', error)
        alert('Failed to submit treatment plan request. Please try again.')
      } finally {
        isSubmitting.value = false
      }
    }
    
    // ==========================================
    // LIFECYCLE
    // ==========================================
    
    onMounted(() => {
      initializeTreatmentRequest()
    })
    
    // ==========================================
    // RETURN FOR TEMPLATE
    // ==========================================
    
    return {
      // State
      showTreatmentRequestModal,
      isSubmitting,
      healthScore,
      completedTasks,
      pendingTasks,
      nextCheckup,
      upcomingAppointments,
      recentActivity,
      treatmentRequest,
      
      // Computed
      currentUser,
      
      // Methods
      getTimeOfDay,
      getCurrentDate,
      formatDate,
      formatTimeAgo,
      goToTasks,
      goToAppointments,
      goToRecords,
      goToChat,
      closeTreatmentRequestModal,
      handleImageUpload,
      removeImage,
      submitTreatmentRequest
    }
  }
}
</script>

<style scoped>
/* Custom styles consistent with the patient interface */
.bg-primary-600 { background-color: #0066CC; }
.bg-primary-700 { background-color: #0052a3; }
.text-primary-600 { color: #0066CC; }
.text-primary-700 { color: #0052a3; }
.bg-neutral-50 { background-color: #F8FAFC; }

/* Hover effects */
.hover\\:bg-gray-50:hover {
  background-color: #f9fafb;
}

.hover\\:bg-gray-100:hover {
  background-color: #f3f4f6;
}

.hover\\:bg-gray-200:hover {
  background-color: #e5e7eb;
}

.hover\\:bg-primary-700:hover {
  background-color: #0052a3;
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

.transition-opacity {
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Focus styles */
input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #0066CC;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
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

/* Grid layouts */
.grid {
  display: grid;
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

@media (min-width: 768px) {
  .md\\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  
  .md\\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  
  .md\\:col-span-2 {
    grid-column: span 2 / span 2;
  }
}

/* Image hover effects */
.group:hover .group-hover\\:opacity-100 {
  opacity: 1;
}

/* File upload styling */
input[type="file"] {
  display: none;
}

/* Scrollbar styling for modal */
.max-h-\[90vh\]::-webkit-scrollbar {
  width: 6px;
}

.max-h-\[90vh\]::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.max-h-\[90vh\]::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.max-h-\[90vh\]::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Responsive text adjustments */
@media (max-width: 640px) {
  .text-xl {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }
  
  .text-lg {
    font-size: 1rem;
    line-height: 1.5rem;
  }
}
</style>
<!--
  Treatment Plan Requests Component
  
  View and manage patient requests for treatment plan generation with:
  - List of all treatment plan requests
  - Filter by status, priority, and date
  - Detailed patient information view
  - Medical images and problem descriptions
  - Action to create treatment plans
-->
<template>
  <div class="p-4 space-y-6">
    <!-- Header Section -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Treatment Plan Requests</h1>
          <p class="text-slate-600">Review and process patient requests for treatment plans</p>
        </div>
        <button 
          @click="refreshRequests"
          class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
          :disabled="isLoading"
        >
          <svg v-if="isLoading" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh</span>
        </button>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-blue-600 font-medium">Total Requests</p>
              <p class="text-2xl font-bold text-blue-800">{{ requestStats.total }}</p>
            </div>
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-yellow-600 font-medium">Pending Review</p>
              <p class="text-2xl font-bold text-yellow-800">{{ requestStats.pending }}</p>
            </div>
            <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-red-50 rounded-lg p-4 border border-red-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-red-600 font-medium">Urgent</p>
              <p class="text-2xl font-bold text-red-800">{{ requestStats.urgent }}</p>
            </div>
            <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-green-50 rounded-lg p-4 border border-green-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-green-600 font-medium">Completed Today</p>
              <p class="text-2xl font-bold text-green-800">{{ requestStats.completedToday }}</p>
            </div>
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search by patient name, email, or phone..."
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
        </div>
        <div class="flex gap-2">
          <select 
            v-model="filterStatus"
            class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending Review</option>
            <option value="completed">Completed</option>
          </select>
          <select 
            v-model="filterPriority"
            class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="normal">Normal</option>
            <option value="routine">Routine</option>
          </select>
          <select 
            v-model="sortBy"
            class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">Priority First</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Requests List -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-slate-800">Treatment Plan Requests</h2>
        <span class="text-sm text-slate-500">{{ filteredRequests.length }} requests</span>
      </div>

      <div v-if="filteredRequests.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-gray-500 text-lg">No treatment plan requests found</p>
        <p class="text-gray-400">Requests will appear here when patients submit them</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="request in filteredRequests"
          :key="request.id"
          class="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors cursor-pointer"
          @click="viewRequest(request)"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-2">
                <h3 class="text-lg font-semibold text-slate-800">{{ request.patientName }}</h3>
                <span 
                  class="text-xs px-2 py-1 rounded-full font-medium"
                  :class="getStatusClasses(request.status)"
                >
                  {{ request.status }}
                </span>
                <span 
                  class="text-xs px-2 py-1 rounded-full font-medium"
                  :class="getPriorityClasses(request.priority)"
                >
                  {{ request.priority }}
                </span>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600 mb-3">
                <div>
                  <p class="flex items-center space-x-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{{ request.phone }}</span>
                  </p>
                  <p class="flex items-center space-x-1 mt-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{{ request.email }}</span>
                  </p>
                </div>
                <div>
                  <p class="flex items-center space-x-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{{ formatDate(request.submittedAt) }}</span>
                  </p>
                  <p class="flex items-center space-x-1 mt-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{{ request.images.length }} image{{ request.images.length !== 1 ? 's' : '' }}</span>
                  </p>
                </div>
              </div>

              <p class="text-sm text-slate-700 bg-gray-50 p-3 rounded-lg">
                <span class="font-medium">Problem:</span> {{ truncateText(request.problemDescription, 150) }}
              </p>
            </div>
            
            <div class="ml-4">
              <button 
                @click.stop="viewRequest(request)"
                class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                View Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Request Detail Modal -->
    <div 
      v-if="selectedRequest"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      @click="closeRequestModal"
    >
      <div 
        class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div class="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-xl font-semibold text-slate-800">Treatment Plan Request</h3>
              <p class="text-slate-600">{{ selectedRequest.patientName }}</p>
            </div>
            <button 
              @click="closeRequestModal"
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div class="p-6 space-y-6">
          <!-- Request Info -->
          <div class="flex items-center space-x-4">
            <span 
              class="px-3 py-1 rounded-full text-sm font-medium"
              :class="getStatusClasses(selectedRequest.status)"
            >
              {{ selectedRequest.status }}
            </span>
            <span 
              class="px-3 py-1 rounded-full text-sm font-medium"
              :class="getPriorityClasses(selectedRequest.priority)"
            >
              {{ selectedRequest.priority }}
            </span>
            <span class="text-sm text-slate-500">
              Submitted {{ formatDate(selectedRequest.submittedAt) }}
            </span>
          </div>

          <!-- Patient Information -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-lg font-semibold text-slate-800 mb-3">Patient Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div class="space-y-2">
                <p><span class="font-medium">Name:</span> {{ selectedRequest.patientName }}</p>
                <p><span class="font-medium">Age:</span> {{ selectedRequest.age }} years old</p>
                <p><span class="font-medium">Phone:</span> {{ selectedRequest.phone }}</p>
                <p><span class="font-medium">Email:</span> {{ selectedRequest.email }}</p>
              </div>
              <div class="space-y-2">
                <p><span class="font-medium">Address:</span> {{ selectedRequest.address }}</p>
              </div>
            </div>
          </div>

          <!-- Medical History -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-lg font-semibold text-slate-800 mb-3">Medical History</h4>
            <div class="space-y-3 text-sm">
              <div>
                <p class="font-medium text-slate-700 mb-1">Previous Treatments:</p>
                <p class="text-slate-600">{{ selectedRequest.previousTreatments || 'None reported' }}</p>
              </div>
              <div>
                <p class="font-medium text-slate-700 mb-1">Allergies:</p>
                <p class="text-slate-600">{{ selectedRequest.allergies || 'None reported' }}</p>
              </div>
              <div>
                <p class="font-medium text-slate-700 mb-1">Medical Conditions:</p>
                <p class="text-slate-600">{{ selectedRequest.medicalConditions || 'None reported' }}</p>
              </div>
            </div>
          </div>

          <!-- Problem Description -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-lg font-semibold text-slate-800 mb-3">Problem Description</h4>
            <p class="text-slate-700">{{ selectedRequest.problemDescription }}</p>
          </div>

          <!-- Medical Images -->
          <div v-if="selectedRequest.images.length > 0" class="bg-gray-50 rounded-lg p-4">
            <h4 class="text-lg font-semibold text-slate-800 mb-3">Medical Images</h4>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div
                v-for="(image, index) in selectedRequest.images"
                :key="index"
                class="relative group"
              >
                <img 
                  :src="image.url" 
                  :alt="`Medical image ${index + 1}`"
                  class="w-full h-32 object-cover rounded-lg border border-gray-200"
                >
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg"></div>
                <p class="text-xs text-slate-500 mt-1">{{ image.filename }}</p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex space-x-3 pt-4 border-t border-gray-200">
            <button 
              @click="createTreatmentPlan(selectedRequest)"
              class="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              :disabled="selectedRequest.status === 'completed'"
            >
              Create Treatment Plan
            </button>
            <button 
              @click="closeRequestModal"
              class="flex-1 border border-gray-300 text-slate-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Close
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
  name: 'TreatmentPlanRequests',
  emits: ['show-toast', 'show-error', 'show-success'],
  setup(props, { emit }) {
    const router = useRouter()
    
    // ==========================================
    // REACTIVE STATE
    // ==========================================
    
    const isLoading = ref(false)
    const selectedRequest = ref(null)
    
    // Filter states
    const searchQuery = ref('')
    const filterStatus = ref('')
    const filterPriority = ref('')
    const sortBy = ref('newest')
    
    // Mock data - replace with API calls
    const requestStats = ref({
      total: 23,
      pending: 15,
      urgent: 4,
      completedToday: 3
    })
    
    const requests = ref([
      {
        id: 1,
        patientName: 'Sarah Johnson',
        age: 34,
        phone: '+1 (555) 123-4567',
        email: 'sarah.johnson@email.com',
        address: '123 Main Street, Springfield, IL 62701',
        status: 'pending',
        priority: 'urgent',
        submittedAt: '2024-01-15T09:30:00Z',
        problemDescription: 'I have severe tooth pain in my upper right molar that started 3 days ago. The pain is constant and gets worse when I eat or drink anything cold. I can see a dark spot on the tooth and I think it might be a cavity that needs immediate attention.',
        previousTreatments: 'Root canal on tooth #14 in 2022, Regular cleanings every 6 months',
        allergies: 'Penicillin',
        medicalConditions: 'Diabetes Type 2, High Blood Pressure',
        images: [
          { url: '/api/placeholder/300/200', filename: 'tooth_pain_1.jpg' },
          { url: '/api/placeholder/300/200', filename: 'tooth_pain_2.jpg' }
        ]
      },
      {
        id: 2,
        patientName: 'Michael Chen',
        age: 28,
        phone: '+1 (555) 234-5678',
        email: 'michael.chen@email.com',
        address: '456 Oak Avenue, Springfield, IL 62702',
        status: 'pending',
        priority: 'normal',
        submittedAt: '2024-01-15T08:15:00Z',
        problemDescription: 'I need a consultation for teeth whitening and possibly some cosmetic work. My teeth have been yellowing and I have a small gap between my front teeth that I would like to address.',
        previousTreatments: 'Braces removed 5 years ago, Regular cleanings',
        allergies: 'None',
        medicalConditions: 'None',
        images: [
          { url: '/api/placeholder/300/200', filename: 'smile_consultation.jpg' }
        ]
      },
      {
        id: 3,
        patientName: 'Emma Wilson',
        age: 45,
        phone: '+1 (555) 345-6789',
        email: 'emma.wilson@email.com',
        address: '789 Pine Street, Springfield, IL 62703',
        status: 'completed',
        priority: 'routine',
        submittedAt: '2024-01-14T14:20:00Z',
        problemDescription: 'Routine check-up and cleaning. I have been experiencing some sensitivity in my lower teeth and would like a comprehensive examination.',
        previousTreatments: 'Crown on tooth #19 in 2020, Fillings on multiple teeth',
        allergies: 'Latex',
        medicalConditions: 'Osteoporosis',
        images: []
      },
      {
        id: 4,
        patientName: 'James Rodriguez',
        age: 52,
        phone: '+1 (555) 456-7890',
        email: 'james.rodriguez@email.com',
        address: '321 Elm Street, Springfield, IL 62704',
        status: 'pending',
        priority: 'urgent',
        submittedAt: '2024-01-15T11:45:00Z',
        problemDescription: 'I broke my front tooth in an accident yesterday. Part of the tooth is missing and I am in significant pain. I need emergency treatment as soon as possible.',
        previousTreatments: 'Multiple fillings, Wisdom teeth removal in 2015',
        allergies: 'Codeine',
        medicalConditions: 'Heart disease, takes blood thinners',
        images: [
          { url: '/api/placeholder/300/200', filename: 'broken_tooth_1.jpg' },
          { url: '/api/placeholder/300/200', filename: 'broken_tooth_2.jpg' },
          { url: '/api/placeholder/300/200', filename: 'broken_tooth_3.jpg' }
        ]
      },
      {
        id: 5,
        patientName: 'Lisa Thompson',
        age: 29,
        phone: '+1 (555) 567-8901',
        email: 'lisa.thompson@email.com',
        address: '654 Maple Drive, Springfield, IL 62705',
        status: 'pending',
        priority: 'normal',
        submittedAt: '2024-01-15T07:30:00Z',
        problemDescription: 'I would like to get my wisdom teeth evaluated. I have been experiencing some discomfort and my dentist mentioned they might need to be removed.',
        previousTreatments: 'Regular cleanings, No major dental work',
        allergies: 'None',
        medicalConditions: 'None',
        images: [
          { url: '/api/placeholder/300/200', filename: 'wisdom_teeth_xray.jpg' }
        ]
      }
    ])
    
    // ==========================================
    // COMPUTED PROPERTIES
    // ==========================================
    
    const filteredRequests = computed(() => {
      let filtered = requests.value
      
      // Search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(request => 
          request.patientName.toLowerCase().includes(query) ||
          request.email.toLowerCase().includes(query) ||
          request.phone.includes(query)
        )
      }
      
      // Status filter
      if (filterStatus.value) {
        filtered = filtered.filter(request => request.status === filterStatus.value)
      }
      
      // Priority filter
      if (filterPriority.value) {
        filtered = filtered.filter(request => request.priority === filterPriority.value)
      }
      
      // Sort
      filtered.sort((a, b) => {
        switch (sortBy.value) {
          case 'oldest':
            return new Date(a.submittedAt) - new Date(b.submittedAt)
          case 'priority':
            const priorityOrder = { urgent: 3, normal: 2, routine: 1 }
            return priorityOrder[b.priority] - priorityOrder[a.priority]
          case 'newest':
          default:
            return new Date(b.submittedAt) - new Date(a.submittedAt)
        }
      })
      
      return filtered
    })
    
    // ==========================================
    // UTILITY METHODS
    // ==========================================
    
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    const truncateText = (text, length) => {
      if (text.length <= length) return text
      return text.substring(0, length) + '...'
    }
    
    const getStatusClasses = (status) => {
      switch (status) {
        case 'pending':
          return 'bg-yellow-100 text-yellow-800'
        case 'completed':
          return 'bg-green-100 text-green-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }
    
    const getPriorityClasses = (priority) => {
      switch (priority) {
        case 'urgent':
          return 'bg-red-100 text-red-800'
        case 'normal':
          return 'bg-blue-100 text-blue-800'
        case 'routine':
          return 'bg-gray-100 text-gray-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }
    
    // ==========================================
    // ACTION METHODS
    // ==========================================
    
    const refreshRequests = async () => {
      isLoading.value = true
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        emit('show-success', 'Requests refreshed successfully')
      } catch (error) {
        console.error('Error refreshing requests:', error)
        emit('show-error', 'Failed to refresh requests')
      } finally {
        isLoading.value = false
      }
    }
    
    const viewRequest = (request) => {
      selectedRequest.value = request
    }
    
    const closeRequestModal = () => {
      selectedRequest.value = null
    }
    
    const createTreatmentPlan = (request) => {
      // Mark request as completed
      const requestIndex = requests.value.findIndex(r => r.id === request.id)
      if (requestIndex !== -1) {
        requests.value[requestIndex].status = 'completed'
      }
      
      // Close modal
      closeRequestModal()
      
      // Navigate to treatment plan generator with patient data
      router.push({
        name: 'TreatmentPlanGenerator',
        query: {
          patientId: request.id,
          patientName: request.patientName,
          fromRequest: 'true'
        }
      })
      
      emit('show-success', `Creating treatment plan for ${request.patientName}`)
    }
    
    // Data loading method
    const loadRequests = async () => {
      isLoading.value = true
      try {
        // TODO: Replace with actual API calls
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (error) {
        console.error('Error loading requests:', error)
        emit('show-error', 'Failed to load treatment plan requests')
      } finally {
        isLoading.value = false
      }
    }
    
    // ==========================================
    // LIFECYCLE
    // ==========================================
    
    onMounted(() => {
      loadRequests()
    })
    
    // ==========================================
    // RETURN FOR TEMPLATE
    // ==========================================
    
    return {
      // State
      isLoading,
      selectedRequest,
      searchQuery,
      filterStatus,
      filterPriority,
      sortBy,
      requestStats,
      requests,
      
      // Computed
      filteredRequests,
      
      // Methods
      formatDate,
      truncateText,
      getStatusClasses,
      getPriorityClasses,
      refreshRequests,
      viewRequest,
      closeRequestModal,
      createTreatmentPlan,
      loadRequests
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

.grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.grid-cols-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

@media (min-width: 768px) {
  .md\\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  
  .md\\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  
  .md\\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

/* Custom color classes */
.bg-primary-600 { background-color: #0066CC; }
.bg-primary-700 { background-color: #0052a3; }
.text-primary-600 { color: #0066CC; }
.text-primary-700 { color: #0052a3; }

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

.hover\\:border-gray-300:hover {
  border-color: #d1d5db;
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

/* Loading animation */
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

/* Modal styling */
.fixed.inset-0 {
  backdrop-filter: blur(2px);
}

/* Image hover effects */
.group:hover .group-hover\\:bg-opacity-20 {
  background-color: rgba(0, 0, 0, 0.2);
}

/* Focus styles */
input:focus,
select:focus {
  outline: none;
  border-color: #0066CC;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

/* Button disabled states */
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Scrollbar styling for modal */
[class*="max-h-[90vh]"]::-webkit-scrollbar {
  width: 6px;
}

[class*="max-h-[90vh]"]::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

[class*="max-h-[90vh]"]::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

[class*="max-h-[90vh]"]::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Responsive text adjustments */
@media (max-width: 640px) {
  .text-2xl {
    font-size: 1.5rem;
    line-height: 2rem;
  }
  
  .text-xl {
    font-size: 1.25rem;
    line-height: 1.75rem;
  }
}
</style>
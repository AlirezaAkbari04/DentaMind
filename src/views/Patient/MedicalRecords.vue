<!-- Patient Medical Records Page - Responsive Fixed -->
<template>
  <div class="min-h-screen bg-neutral-50 pb-20">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-100 px-3 sm:px-4 py-3 sm:py-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div class="flex-1 min-w-0">
          <h1 class="text-lg sm:text-xl font-semibold text-slate-800 truncate">Medical Records</h1>
          <p class="text-xs sm:text-sm text-slate-600 mt-1">Your complete dental health history</p>
        </div>
        <button 
          @click="showUploadModal = true"
          class="bg-primary-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-primary-700 transition-colors flex-shrink-0"
        >
          <svg class="w-4 h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          <span class="hidden sm:inline">Upload Document</span>
          <span class="sm:hidden">Upload</span>
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
      <!-- Quick Stats -->
      <div class="grid grid-cols-2 gap-3 sm:gap-4">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
          <div class="flex items-center space-x-2 sm:space-x-3">
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-lg sm:text-2xl font-bold text-slate-800">{{ totalRecords }}</div>
              <div class="text-xs sm:text-sm text-slate-600">Total Records</div>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
          <div class="flex items-center space-x-2 sm:space-x-3">
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-lg sm:text-2xl font-bold text-slate-800">{{ lastVisitDays }}</div>
              <div class="text-xs sm:text-sm text-slate-600">Days Since Last Visit</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Current Treatment Plans -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 mb-4">
          <h2 class="text-base sm:text-lg font-semibold text-slate-800">Treatment Plans</h2>
          <span class="text-xs sm:text-sm text-slate-500 self-start sm:self-auto">{{ activeTreatmentPlans.length }} active</span>
        </div>
        
        <div v-if="activeTreatmentPlans.length === 0" class="text-center py-6 sm:py-8">
          <svg class="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          <p class="text-sm sm:text-base text-gray-500">No active treatment plans</p>
        </div>

        <div v-else class="space-y-3 sm:space-y-4">
          <div
            v-for="plan in activeTreatmentPlans"
            :key="plan.id"
            class="border border-gray-100 rounded-lg p-3 sm:p-4 hover:shadow-sm transition-shadow"
          >
            <div class="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-start sm:justify-between">
              <div class="flex-1 min-w-0">
                <div class="font-medium text-sm sm:text-base text-slate-800">{{ plan.title }}</div>
                <div class="text-xs sm:text-sm text-slate-600 mt-1">{{ plan.description }}</div>
                <div class="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 mt-2 sm:mt-3">
                  <span class="text-xs text-slate-500">Created: {{ formatDate(plan.createdAt) }}</span>
                  <span class="text-xs text-slate-500">By: Dr. {{ plan.doctorName }}</span>
                </div>
              </div>
              <div class="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 flex-shrink-0">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusClass(plan.status)"
                >
                  {{ plan.status }}
                </span>
                <button 
                  @click="viewTreatmentPlan(plan)"
                  class="text-primary-600 hover:text-primary-700 text-xs sm:text-sm font-medium"
                >
                  View Details
                </button>
              </div>
            </div>
            
            <!-- Progress Bar -->
            <div class="mt-3 sm:mt-4">
              <div class="flex justify-between text-xs text-slate-600 mb-1">
                <span>Progress</span>
                <span>{{ plan.progress }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-secondary-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: plan.progress + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Medical History & Documents -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div class="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 class="text-base sm:text-lg font-semibold text-slate-800">Medical History & Documents</h2>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="filter in documentFilters"
              :key="filter.id"
              @click="activeFilter = filter.id"
              class="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors"
              :class="activeFilter === filter.id ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
            >
              {{ filter.label }}
            </button>
          </div>
        </div>

        <div v-if="filteredDocuments.length === 0" class="text-center py-6 sm:py-8">
          <svg class="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
          <p class="text-sm sm:text-base text-gray-500">No documents found</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="document in filteredDocuments"
            :key="document.id"
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow space-y-3 sm:space-y-0"
          >
            <div class="flex items-center space-x-3 flex-1 min-w-0">
              <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                   :class="getDocumentIconClass(document.type)">
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path v-if="document.type === 'image'" fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
                  <path v-else-if="document.type === 'pdf'" fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"></path>
                  <path v-else fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-medium text-sm sm:text-base text-slate-800 truncate">{{ document.name }}</div>
                <div class="text-xs sm:text-sm text-slate-600 truncate">{{ document.description }}</div>
                <div class="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 mt-1">
                  <span class="text-xs text-slate-500">{{ formatDate(document.date) }}</span>
                  <span class="text-xs text-slate-500">{{ document.size }}</span>
                  <span class="text-xs text-slate-500">Dr. {{ document.doctorName }}</span>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-end space-x-2 flex-shrink-0">
              <button 
                @click="viewDocument(document)"
                class="text-primary-600 hover:text-primary-700 text-xs sm:text-sm font-medium"
              >
                View
              </button>
              <button 
                @click="downloadDocument(document)"
                class="text-slate-600 hover:text-slate-700 p-1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Dental History Timeline -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <h2 class="text-base sm:text-lg font-semibold text-slate-800 mb-4">Dental History Timeline</h2>
        
        <div class="max-h-64 overflow-y-auto">
          <div class="space-y-3 sm:space-y-4">
            <div
              v-for="event in dentalHistory"
              :key="event.id"
              class="flex items-start space-x-3"
            >
              <div class="flex-shrink-0 w-3 h-3 rounded-full mt-2"
                   :class="getTimelineColor(event.type)"></div>
              <div class="flex-1 min-w-0">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                  <p class="text-sm font-medium text-slate-800">{{ event.title }}</p>
                  <span class="text-xs text-slate-500 self-start sm:self-auto">{{ formatDate(event.date) }}</span>
                </div>
                <p class="text-xs sm:text-sm text-slate-600 mt-1">{{ event.description }}</p>
                <div class="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 mt-2">
                  <span class="text-xs text-slate-500">Dr. {{ event.doctorName }}</span>
                  <span class="text-xs text-slate-500">{{ event.clinic }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-inset">
      <div class="flex justify-around items-center">
        <!-- Task Management -->
        <router-link to="/patient/tasks" 
                     class="flex flex-col items-center space-y-1 p-3 rounded-lg transition-colors text-slate-600 hover:text-slate-800 min-h-touch">
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
          </svg>
          <span class="text-xs font-medium">Tasks</span>
        </router-link>

        <!-- Dashboard -->
        <router-link to="/patient/dashboard" 
                     class="flex flex-col items-center space-y-1 p-3 rounded-lg transition-colors text-slate-600 hover:text-slate-800 min-h-touch">
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z M3 7l9 6 9-6"></path>
          </svg>
          <span class="text-xs font-medium">Dashboard</span>
        </router-link>

        <!-- Medical Records (Active) -->
        <router-link to="/patient/medical-records" 
                     class="flex flex-col items-center space-y-1 p-3 rounded-lg transition-colors text-secondary-600 bg-secondary-50 min-h-touch">
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

    <!-- Document Upload Modal -->
    <div v-if="showUploadModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-3 sm:p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div class="p-4 sm:p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base sm:text-lg font-semibold text-slate-800">Upload Document</h3>
            <button @click="showUploadModal = false" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="uploadDocument" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Document Type</label>
              <select v-model="uploadForm.type" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm">
                <option value="">Select type...</option>
                <option value="xray">X-Ray</option>
                <option value="report">Medical Report</option>
                <option value="prescription">Prescription</option>
                <option value="insurance">Insurance</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Document Name</label>
              <input 
                v-model="uploadForm.name"
                type="text" 
                placeholder="Enter document name..."
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Description (Optional)</label>
              <textarea 
                v-model="uploadForm.description"
                rows="3"
                placeholder="Add description..."
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Choose File</label>
              <input 
                ref="fileInput"
                type="file"
                @change="handleFileSelect"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
              <p class="text-xs text-slate-500 mt-1">Supported: PDF, JPG, PNG, DOC, DOCX (Max 10MB)</p>
            </div>

            <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
              <button 
                type="button"
                @click="showUploadModal = false"
                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                :disabled="!uploadForm.type || !uploadForm.name || !uploadForm.file"
                class="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Upload
              </button>
            </div>
          </form>
        </div>
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
  name: 'MedicalRecords',
  setup() {
    const router = useRouter()
    const showUploadModal = ref(false)
    const activeFilter = ref('all')
    
    // Upload form
    const uploadForm = ref({
      type: '',
      name: '',
      description: '',
      file: null
    })

    // Sample data - replace with API calls
    const totalRecords = ref(47)
    const lastVisitDays = ref(23)

    const activeTreatmentPlans = ref([
      {
        id: 1,
        title: 'Orthodontic Treatment',
        description: 'Comprehensive braces treatment plan for teeth alignment',
        status: 'in-progress',
        progress: 65,
        createdAt: new Date('2024-06-01'),
        doctorName: 'Johnson'
      },
      {
        id: 2,
        title: 'Root Canal Follow-up',
        description: 'Post-treatment monitoring and crown placement',
        status: 'scheduled',
        progress: 25,
        createdAt: new Date('2024-06-15'),
        doctorName: 'Smith'
      }
    ])

    const documents = ref([
      {
        id: 1,
        name: 'Dental X-Ray - Full Mouth',
        description: 'Comprehensive oral examination X-ray',
        type: 'image',
        date: new Date('2024-06-20'),
        size: '2.4 MB',
        doctorName: 'Johnson',
        category: 'xray'
      },
      {
        id: 2,
        name: 'Treatment Plan Report',
        description: 'Orthodontic treatment recommendations and timeline',
        type: 'pdf',
        date: new Date('2024-06-15'),
        size: '1.8 MB',
        doctorName: 'Johnson',
        category: 'report'
      },
      {
        id: 3,
        name: 'Prescription - Antibiotics',
        description: 'Post-surgery antibiotic prescription',
        type: 'pdf',
        date: new Date('2024-06-10'),
        size: '145 KB',
        doctorName: 'Smith',
        category: 'prescription'
      },
      {
        id: 4,
        name: 'Insurance Claim Form',
        description: 'Submitted claim for orthodontic treatment',
        type: 'document',
        date: new Date('2024-06-05'),
        size: '892 KB',
        doctorName: 'Johnson',
        category: 'insurance'
      },
      {
        id: 5,
        name: 'Progress Photos',
        description: 'Monthly orthodontic progress documentation',
        type: 'image',
        date: new Date('2024-06-01'),
        size: '3.1 MB',
        doctorName: 'Johnson',
        category: 'photo'
      }
    ])

    const dentalHistory = ref([
      {
        id: 1,
        title: 'Orthodontic Adjustment',
        description: 'Monthly braces adjustment and progress check',
        type: 'treatment',
        date: new Date('2024-06-20'),
        doctorName: 'Johnson',
        clinic: 'Central Dental Clinic'
      },
      {
        id: 2,
        title: 'Root Canal Completion',
        description: 'Completed root canal treatment on tooth #14',
        type: 'surgery',
        date: new Date('2024-06-10'),
        doctorName: 'Smith',
        clinic: 'Endodontic Specialists'
      },
      {
        id: 3,
        title: 'Regular Cleaning',
        description: 'Professional teeth cleaning and fluoride treatment',
        type: 'cleaning',
        date: new Date('2024-05-15'),
        doctorName: 'Davis',
        clinic: 'Central Dental Clinic'
      },
      {
        id: 4,
        title: 'Cavity Filling',
        description: 'Composite filling placed on tooth #7',
        type: 'treatment',
        date: new Date('2024-04-22'),
        doctorName: 'Johnson',
        clinic: 'Central Dental Clinic'
      }
    ])

    const documentFilters = [
      { id: 'all', label: 'All' },
      { id: 'xray', label: 'X-Rays' },
      { id: 'report', label: 'Reports' },
      { id: 'prescription', label: 'Prescriptions' },
      { id: 'insurance', label: 'Insurance' },
      { id: 'photo', label: 'Photos' }
    ]

    // Computed properties
    const filteredDocuments = computed(() => {
      if (activeFilter.value === 'all') {
        return documents.value
      }
      return documents.value.filter(doc => doc.category === activeFilter.value)
    })

    // Methods
    const getStatusClass = (status) => {
      switch (status) {
        case 'in-progress':
          return 'bg-blue-100 text-blue-800'
        case 'scheduled':
          return 'bg-yellow-100 text-yellow-800'
        case 'completed':
          return 'bg-green-100 text-green-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }

    const getDocumentIconClass = (type) => {
      switch (type) {
        case 'image':
          return 'bg-green-100 text-green-600'
        case 'pdf':
          return 'bg-red-100 text-red-600'
        default:
          return 'bg-blue-100 text-blue-600'
      }
    }

    const getTimelineColor = (type) => {
      switch (type) {
        case 'treatment': return 'bg-blue-500'
        case 'surgery': return 'bg-red-500'
        case 'cleaning': return 'bg-green-500'
        default: return 'bg-gray-500'
      }
    }

    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const viewTreatmentPlan = (plan) => {
      // TODO: Implement treatment plan viewing
      console.log('Viewing treatment plan:', plan.id)
    }

    const viewDocument = (document) => {
      // TODO: Implement document viewing/preview
      console.log('Viewing document:', document.id)
    }

    const downloadDocument = (document) => {
      // TODO: Implement document download
      console.log('Downloading document:', document.id)
    }

    const handleFileSelect = (event) => {
      const file = event.target.files[0]
      if (file) {
        uploadForm.value.file = file
      }
    }

    const uploadDocument = () => {
      // TODO: Implement document upload API call
      console.log('Uploading document:', uploadForm.value)
      
      // Simulate successful upload
      showUploadModal.value = false
      uploadForm.value = {
        type: '',
        name: '',
        description: '',
        file: null
      }
    }

    const openChat = () => {
      // TODO: Implement chat opening logic
      console.log('Opening chat...')
    }

    onMounted(() => {
      // TODO: Fetch medical records from API
      console.log('Fetching medical records...')
    })

    return {
      showUploadModal,
      activeFilter,
      uploadForm,
      totalRecords,
      lastVisitDays,
      activeTreatmentPlans,
      documents,
      dentalHistory,
      documentFilters,
      filteredDocuments,
      getStatusClass,
      getDocumentIconClass,
      getTimelineColor,
      formatDate,
      viewTreatmentPlan,
      viewDocument,
      downloadDocument,
      handleFileSelect,
      uploadDocument,
      openChat
    }
  }
}
</script>

<style scoped>
/* Custom scrollbar for timeline */
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

/* Color classes */
.bg-primary-600 { background-color: #0066CC; }
.bg-primary-700 { background-color: #0052a3; }
.bg-primary-100 { background-color: #e6f3ff; }
.text-primary-600 { color: #0066CC; }
.text-primary-700 { color: #0052a3; }
.bg-secondary-600 { background-color: #00A86B; }
.bg-secondary-50 { background-color: #f0fdf4; }
.text-secondary-600 { color: #00A86B; }
.bg-accent-500 { background-color: #FF6B35; }
.bg-accent-600 { background-color: #e55a2b; }
.bg-neutral-50 { background-color: #F8FAFC; }

/* Focus states */
.focus\:ring-primary-500:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px #0066CC;
}

.focus\:border-primary-500:focus {
  border-color: #0066CC;
}

.focus\:border-transparent:focus {
  border-color: transparent;
}

/* Responsive utilities */
.min-h-touch {
  min-height: 44px;
}

.safe-area-inset {
  padding-bottom: env(safe-area-inset-bottom);
}

/* Text truncation */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Flexbox utilities */
.flex-1 { flex: 1 1 0%; }
.flex-shrink-0 { flex-shrink: 0; }
.min-w-0 { min-width: 0px; }

/* Modal backdrop blur effect */
.fixed.inset-0.bg-black.bg-opacity-50 {
  backdrop-filter: blur(4px);
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

/* Responsive breakpoints */
@media (max-width: 640px) {
  /* Mobile-specific adjustments */
  .space-y-3 > * + * { margin-top: 0.75rem; }
  .space-y-4 > * + * { margin-top: 1rem; }
  .space-x-2 > * + * { margin-left: 0.5rem; }
  .space-x-3 > * + * { margin-left: 0.75rem; }
  
  /* Ensure touch targets are at least 44px */
  button, input, select, textarea {
    min-height: 44px;
  }
  
  /* Better spacing for mobile cards */
  .p-3 { padding: 0.75rem; }
  .p-4 { padding: 1rem; }
  
  /* Improved text sizes */
  .text-xs { font-size: 0.7rem; }
  .text-sm { font-size: 0.8rem; }
}

@media (min-width: 640px) {
  /* Tablet and desktop spacing */
  .sm\:space-y-0 > * + * { margin-top: 0; }
  .sm\:space-x-3 > * + * { margin-left: 0.75rem; }
  .sm\:space-x-4 > * + * { margin-left: 1rem; }
  
  /* Flex direction changes */
  .sm\:flex-row { flex-direction: row; }
  .sm\:items-center { align-items: center; }
  .sm\:justify-between { justify-content: space-between; }
}

/* Grid responsive */
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }

/* Spacing utilities */
.space-y-2 > * + * { margin-top: 0.5rem; }
.space-y-3 > * + * { margin-top: 0.75rem; }
.space-y-4 > * + * { margin-top: 1rem; }
.space-y-6 > * + * { margin-top: 1.5rem; }

.space-x-2 > * + * { margin-left: 0.5rem; }
.space-x-3 > * + * { margin-left: 0.75rem; }
.space-x-4 > * + * { margin-left: 1rem; }

/* Text sizes */
.text-xs { font-size: 0.75rem; line-height: 1rem; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.text-base { font-size: 1rem; line-height: 1.5rem; }
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }

/* Font weights */
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }

/* Colors */
.bg-white { background-color: #ffffff; }
.bg-gray-50 { background-color: #f9fafb; }
.bg-gray-100 { background-color: #f3f4f6; }
.bg-gray-200 { background-color: #e5e7eb; }
.bg-gray-300 { background-color: #d1d5db; }
.bg-blue-100 { background-color: #dbeafe; }
.bg-green-100 { background-color: #dcfce7; }
.bg-red-100 { background-color: #fee2e2; }
.bg-yellow-100 { background-color: #fef3c7; }
.bg-blue-500 { background-color: #3b82f6; }
.bg-green-500 { background-color: #22c55e; }
.bg-red-500 { background-color: #ef4444; }
.bg-gray-500 { background-color: #6b7280; }

.text-slate-500 { color: #64748b; }
.text-slate-600 { color: #475569; }
.text-slate-700 { color: #334155; }
.text-slate-800 { color: #1e293b; }
.text-gray-300 { color: #d1d5db; }
.text-gray-500 { color: #6b7280; }
.text-gray-700 { color: #374151; }
.text-white { color: #ffffff; }
.text-blue-800 { color: #1e40af; }
.text-green-600 { color: #16a34a; }
.text-red-600 { color: #dc2626; }
.text-yellow-800 { color: #92400e; }
.text-green-800 { color: #166534; }
.text-gray-800 { color: #1f2937; }

/* Borders */
.border { border-width: 1px; }
.border-t { border-top-width: 1px; }
.border-gray-100 { border-color: #f3f4f6; }
.border-gray-200 { border-color: #e5e7eb; }
.border-gray-300 { border-color: #d1d5db; }

/* Border radius */
.rounded-lg { border-radius: 0.5rem; }
.rounded-xl { border-radius: 0.75rem; }
.rounded-full { border-radius: 9999px; }

/* Shadows */
.shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
.shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
.shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }

/* Width and height */
.w-3 { width: 0.75rem; }
.w-4 { width: 1rem; }
.w-5 { width: 1.25rem; }
.w-6 { width: 1.5rem; }
.w-8 { width: 2rem; }
.w-10 { width: 2.5rem; }
.w-12 { width: 3rem; }
.w-14 { width: 3.5rem; }
.w-full { width: 100%; }

.h-2 { height: 0.5rem; }
.h-3 { height: 0.75rem; }
.h-4 { height: 1rem; }
.h-5 { height: 1.25rem; }
.h-6 { height: 1.5rem; }
.h-8 { height: 2rem; }
.h-10 { height: 2.5rem; }
.h-12 { height: 3rem; }
.h-14 { height: 3.5rem; }

/* Max dimensions */
.max-w-md { max-width: 28rem; }
.max-h-64 { max-height: 16rem; }
.max-h-\[90vh\] { max-height: 90vh; }

/* Padding */
.p-1 { padding: 0.25rem; }
.p-2 { padding: 0.5rem; }
.p-3 { padding: 0.75rem; }
.p-4 { padding: 1rem; }
.p-6 { padding: 1.5rem; }

.px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
.px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
.py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }

/* Margin */
.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 0.75rem; }
.mb-4 { margin-bottom: 1rem; }
.mt-1 { margin-top: 0.25rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-3 { margin-top: 0.75rem; }
.mt-4 { margin-top: 1rem; }
.mt-6 { margin-top: 1.5rem; }
.mr-1 { margin-right: 0.25rem; }
.mr-2 { margin-right: 0.5rem; }

/* Positioning */
.fixed { position: fixed; }
.relative { position: relative; }
.absolute { position: absolute; }
.inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
.bottom-0 { bottom: 0; }
.bottom-20 { bottom: 5rem; }
.bottom-24 { bottom: 6rem; }
.left-0 { left: 0; }
.right-0 { right: 0; }
.right-3 { right: 0.75rem; }
.right-4 { right: 1rem; }
.top-2 { top: 0.5rem; }

/* Z-index */
.z-50 { z-index: 50; }

/* Display */
.flex { display: flex; }
.grid { display: grid; }
.inline-flex { display: inline-flex; }
.block { display: block; }
.hidden { display: none; }

/* Responsive display */
@media (min-width: 640px) {
  .sm\:inline { display: inline; }
  .sm\:flex { display: flex; }
  .sm\:w-6 { width: 1.5rem; }
  .sm\:h-6 { height: 1.5rem; }
  .sm\:w-10 { width: 2.5rem; }
  .sm\:h-10 { height: 2.5rem; }
  .sm\:w-12 { width: 3rem; }
  .sm\:h-12 { height: 3rem; }
  .sm\:w-14 { width: 3.5rem; }
  .sm\:h-14 { height: 3.5rem; }
  .sm\:text-sm { font-size: 0.875rem; line-height: 1.25rem; }
  .sm\:text-base { font-size: 1rem; line-height: 1.5rem; }
  .sm\:text-lg { font-size: 1.125rem; line-height: 1.75rem; }
  .sm\:text-xl { font-size: 1.25rem; line-height: 1.75rem; }
  .sm\:text-2xl { font-size: 1.5rem; line-height: 2rem; }
  .sm\:p-4 { padding: 1rem; }
  .sm\:p-6 { padding: 1.5rem; }
  .sm\:px-4 { padding-left: 1rem; padding-right: 1rem; }
  .sm\:py-4 { padding-top: 1rem; padding-bottom: 1rem; }
  .sm\:py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
  .sm\:py-8 { padding-top: 2rem; padding-bottom: 2rem; }
  .sm\:mt-3 { margin-top: 0.75rem; }
  .sm\:mr-2 { margin-right: 0.5rem; }
  .sm\:bottom-24 { bottom: 6rem; }
  .sm\:right-4 { right: 1rem; }
}

/* Flex utilities */
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.items-start { align-items: flex-start; }
.justify-between { justify-content: space-between; }
.justify-around { justify-content: space-around; }
.justify-end { justify-content: flex-end; }

/* Text alignment */
.text-center { text-align: center; }

/* Cursor */
.cursor-pointer { cursor: pointer; }

/* Overflow */
.overflow-hidden { overflow: hidden; }
.overflow-y-auto { overflow-y: auto; }

/* Transitions */
.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-shadow {
  transition-property: box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.duration-300 {
  transition-duration: 300ms;
}

/* Hover effects */
.hover\:bg-primary-700:hover { background-color: #0052a3; }
.hover\:bg-accent-600:hover { background-color: #e55a2b; }
.hover\:bg-gray-50:hover { background-color: #f9fafb; }
.hover\:bg-gray-200:hover { background-color: #e5e7eb; }
.hover\:text-primary-700:hover { color: #0052a3; }
.hover\:text-slate-700:hover { color: #334155; }
.hover\:text-slate-800:hover { color: #1e293b; }
.hover\:text-gray-700:hover { color: #374151; }
.hover\:shadow-sm:hover { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
.hover\:scale-110:hover { transform: scale(1.1); }

/* Disabled states */
.disabled\:opacity-50:disabled { opacity: 0.5; }
.disabled\:cursor-not-allowed:disabled { cursor: not-allowed; }

/* Gap utilities */
.gap-2 { gap: 0.5rem; }
.gap-3 { gap: 0.75rem; }
.gap-4 { gap: 1rem; }

/* Self alignment */
.self-start { align-self: flex-start; }
.self-auto { align-self: auto; }

/* Responsive self alignment */
@media (min-width: 640px) {
  .sm\:self-auto { align-self: auto; }
}
</style> 
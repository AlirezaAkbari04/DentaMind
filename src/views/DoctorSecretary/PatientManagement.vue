<!--
  Patient Management Component
  
  Comprehensive patient management interface with:
  - Patient list with search and filtering
  - Quick access to patient profiles
  - Clinical notes integration
  - AI diagnostics results
  - Health status overview
-->
<template>
  <div class="p-4 space-y-6">
    <!-- Header with Search and Actions -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Patient Management</h1>
          <p class="text-slate-600">Manage patient profiles, clinical notes, and health records</p>
        </div>
        
        <div class="flex items-center space-x-3">
          <button 
            v-if="userRole === 'doctor'"
            @click="addNewPatient"
            class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Patient
          </button>
          
          <button 
            @click="exportPatientData"
            class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </button>
        </div>
      </div>

      <!-- Search and Filter Bar -->
      <div class="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search Input -->
        <div class="md:col-span-2 relative">
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="Search patients by name, email, or phone..."
            class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
          <svg class="w-5 h-5 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <!-- Health Status Filter -->
        <select 
          v-model="selectedHealthStatus"
          class="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">All Health Status</option>
          <option value="Excellent">Excellent</option>
          <option value="Good">Good</option>
          <option value="Needs Attention">Needs Attention</option>
          <option value="Poor">Poor</option>
        </select>

        <!-- Sort Options -->
        <select 
          v-model="sortBy"
          class="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="name">Sort by Name</option>
          <option value="lastVisit">Sort by Last Visit</option>
          <option value="nextAppointment">Sort by Next Appointment</option>
          <option value="healthStatus">Sort by Health Status</option>
        </select>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-lg p-4 border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-600">Total Patients</p>
            <p class="text-2xl font-bold text-slate-800">{{ patientStats.total }}</p>
          </div>
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg p-4 border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-600">New This Month</p>
            <p class="text-2xl font-bold text-green-600">{{ patientStats.newThisMonth }}</p>
          </div>
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg p-4 border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-600">Need Follow-up</p>
            <p class="text-2xl font-bold text-yellow-600">{{ patientStats.needFollowUp }}</p>
          </div>
          <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg p-4 border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-600">High Priority</p>
            <p class="text-2xl font-bold text-red-600">{{ patientStats.highPriority }}</p>
          </div>
          <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Patient List -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100">
      <!-- List Header -->
      <div class="px-6 py-4 border-b border-gray-100">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-slate-800">
            Patients ({{ filteredPatients.length }})
          </h2>
          
          <!-- View Toggle -->
          <div class="flex items-center space-x-2">
            <button 
              @click="viewMode = 'grid'"
              class="p-2 rounded-lg transition-colors"
              :class="viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-slate-400 hover:text-slate-600'"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button 
              @click="viewMode = 'list'"
              class="p-2 rounded-lg transition-colors"
              :class="viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-slate-400 hover:text-slate-600'"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="p-8 text-center">
        <div class="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-slate-600">Loading patients...</p>
      </div>

      <!-- Grid View -->
      <div v-else-if="viewMode === 'grid'" class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="patient in paginatedPatients"
            :key="patient.id"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            @click="viewPatientProfile(patient.id)"
          >
            <!-- Patient Avatar and Basic Info -->
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                <span class="text-lg font-medium text-slate-600">
                  {{ patient.name.split(' ').map(n => n[0]).join('') }}
                </span>
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-slate-800">{{ patient.name }}</h3>
                <p class="text-sm text-slate-600">{{ patient.email }}</p>
              </div>
              <div class="flex items-center space-x-1">
                <!-- Health Status Indicator -->
                <div 
                  class="w-3 h-3 rounded-full"
                  :class="getHealthStatusDotColor(patient.healthStatus)"
                ></div>
              </div>
            </div>

            <!-- Patient Details -->
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-slate-600">Age:</span>
                <span class="text-slate-800">{{ patient.age }} years</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-600">Phone:</span>
                <span class="text-slate-800">{{ patient.phone }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-600">Last Visit:</span>
                <span class="text-slate-800">{{ formatDate(patient.lastVisit) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-600">Next Appointment:</span>
                <span class="text-slate-800">
                  {{ patient.nextAppointment ? formatDate(patient.nextAppointment) : 'None scheduled' }}
                </span>
              </div>
            </div>

            <!-- Health Status Badge -->
            <div class="mt-3 flex items-center justify-between">
              <span 
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                :class="getHealthStatusClasses(patient.healthStatus)"
              >
                {{ patient.healthStatus }}
              </span>
              
              <!-- Quick Actions -->
              <div class="flex items-center space-x-1">
                <button 
                  @click.stop="openChat(patient.id)"
                  class="p-1 text-slate-400 hover:text-primary-600 transition-colors"
                  title="Send Message"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>
                <button 
                  v-if="userRole === 'doctor'"
                  @click.stop="openClinicalNotes(patient.id)"
                  class="p-1 text-slate-400 hover:text-secondary-600 transition-colors"
                  title="Clinical Notes"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>
                <button 
                  @click.stop="bookAppointment(patient.id)"
                  class="p-1 text-slate-400 hover:text-accent-600 transition-colors"
                  title="Book Appointment"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a1 1 0 001 1h6a1 1 0 001-1V11a1 1 0 00-1-1H9a1 1 0 00-1 1z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Patient</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contact</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last Visit</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Next Appointment</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Health Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="patient in paginatedPatients"
              :key="patient.id"
              class="hover:bg-gray-50 cursor-pointer transition-colors"
              @click="viewPatientProfile(patient.id)"
            >
              <td class="px-6 py-4">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                    <span class="text-sm font-medium text-slate-600">
                      {{ patient.name.split(' ').map(n => n[0]).join('') }}
                    </span>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-slate-900">{{ patient.name }}</div>
                    <div class="text-sm text-slate-500">{{ patient.age }} years old</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-slate-900">{{ patient.email }}</div>
                <div class="text-sm text-slate-500">{{ patient.phone }}</div>
              </td>
              <td class="px-6 py-4 text-sm text-slate-900">
                {{ formatDate(patient.lastVisit) }}
              </td>
              <td class="px-6 py-4 text-sm text-slate-900">
                {{ patient.nextAppointment ? formatDate(patient.nextAppointment) : 'None scheduled' }}
              </td>
              <td class="px-6 py-4">
                <span 
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  :class="getHealthStatusClasses(patient.healthStatus)"
                >
                  {{ patient.healthStatus }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center space-x-2">
                  <button 
                    @click.stop="openChat(patient.id)"
                    class="text-slate-400 hover:text-primary-600 transition-colors"
                    title="Send Message"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </button>
                  <button 
                    v-if="userRole === 'doctor'"
                    @click.stop="openClinicalNotes(patient.id)"
                    class="text-slate-400 hover:text-secondary-600 transition-colors"
                    title="Clinical Notes"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                  <button 
                    @click.stop="bookAppointment(patient.id)"
                    class="text-slate-400 hover:text-accent-600 transition-colors"
                    title="Book Appointment"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a1 1 0 001 1h6a1 1 0 001-1V11a1 1 0 00-1-1H9a1 1 0 00-1 1z" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="!isLoading && filteredPatients.length === 0" class="p-12 text-center">
        <svg class="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 class="text-lg font-medium text-slate-800 mb-2">No patients found</h3>
        <p class="text-slate-600 mb-4">Try adjusting your search criteria or add a new patient.</p>
        <button 
          v-if="userRole === 'doctor'"
          @click="addNewPatient"
          class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Add First Patient
        </button>
      </div>

      <!-- Pagination -->
      <div v-if="filteredPatients.length > itemsPerPage" class="px-6 py-4 border-t border-gray-100">
        <div class="flex items-center justify-between">
          <div class="text-sm text-slate-600">
            Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredPatients.length) }} of {{ filteredPatients.length }} patients
          </div>
          
          <div class="flex items-center space-x-2">
            <button 
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-3 py-1 rounded-lg border border-gray-200 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            
            <div class="flex items-center space-x-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="currentPage = page"
                class="px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                :class="page === currentPage ? 'bg-primary-600 text-white' : 'text-slate-600 hover:bg-gray-50'"
              >
                {{ page }}
              </button>
            </div>
            
            <button 
              @click="currentPage++"
              :disabled="currentPage >= totalPages"
              class="px-3 py-1 rounded-lg border border-gray-200 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
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
  name: 'PatientManagement',
  emits: ['show-toast', 'show-error', 'show-success'],
  setup(props, { emit }) {
    const router = useRouter()
    const authStore = useAuthStore()
    
    // ==========================================
    // REACTIVE STATE
    // ==========================================
    
    const isLoading = ref(false)
    const searchQuery = ref('')
    const selectedHealthStatus = ref('')
    const sortBy = ref('name')
    const viewMode = ref('grid') // 'grid' or 'list'
    const currentPage = ref(1)
    const itemsPerPage = ref(12)
    
    // Mock data - replace with API calls
    const patientStats = ref({
      total: 245,
      newThisMonth: 18,
      needFollowUp: 32,
      highPriority: 7
    })
    
    const patients = ref([
      {
        id: 'P001',
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1 (555) 123-4567',
        age: 34,
        healthStatus: 'Good',
        lastVisit: new Date('2024-01-05'),
        nextAppointment: new Date('2024-02-15'),
        hasUnreadMessages: true,
        priority: 'medium'
      },
      {
        id: 'P002',
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+1 (555) 234-5678',
        age: 28,
        healthStatus: 'Needs Attention',
        lastVisit: new Date('2024-01-03'),
        nextAppointment: new Date('2024-01-20'),
        hasUnreadMessages: false,
        priority: 'high'
      },
      {
        id: 'P003',
        name: 'Mike Davis',
        email: 'mike.davis@email.com',
        phone: '+1 (555) 345-6789',
        age: 45,
        healthStatus: 'Excellent',
        lastVisit: new Date('2024-01-02'),
        nextAppointment: null,
        hasUnreadMessages: false,
        priority: 'low'
      },
      {
        id: 'P004',
        name: 'Emily Wilson',
        email: 'emily.w@email.com',
        phone: '+1 (555) 456-7890',
        age: 31,
        healthStatus: 'Poor',
        lastVisit: new Date('2023-12-28'),
        nextAppointment: new Date('2024-01-25'),
        hasUnreadMessages: true,
        priority: 'high'
      },
      {
        id: 'P005',
        name: 'Robert Brown',
        email: 'robert.brown@email.com',
        phone: '+1 (555) 567-8901',
        age: 52,
        healthStatus: 'Good',
        lastVisit: new Date('2023-12-25'),
        nextAppointment: new Date('2024-03-10'),
        hasUnreadMessages: false,
        priority: 'medium'
      },
      {
        id: 'P006',
        name: 'Lisa Anderson',
        email: 'lisa.anderson@email.com',
        phone: '+1 (555) 678-9012',
        age: 29,
        healthStatus: 'Excellent',
        lastVisit: new Date('2024-01-01'),
        nextAppointment: new Date('2024-04-05'),
        hasUnreadMessages: false,
        priority: 'low'
      },
      {
        id: 'P007',
        name: 'David Miller',
        email: 'david.miller@email.com',
        phone: '+1 (555) 789-0123',
        age: 38,
        healthStatus: 'Needs Attention',
        lastVisit: new Date('2023-12-20'),
        nextAppointment: new Date('2024-01-30'),
        hasUnreadMessages: true,
        priority: 'medium'
      },
      {
        id: 'P008',
        name: 'Jennifer Taylor',
        email: 'jennifer.taylor@email.com',
        phone: '+1 (555) 890-1234',
        age: 42,
        healthStatus: 'Good',
        lastVisit: new Date('2023-12-18'),
        nextAppointment: null,
        hasUnreadMessages: false,
        priority: 'low'
      }
    ])
    
    // ==========================================
    // COMPUTED PROPERTIES
    // ==========================================
    
    const userRole = computed(() => authStore.user?.role)
    
    const filteredPatients = computed(() => {
      let filtered = patients.value
      
      // Apply search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(patient =>
          patient.name.toLowerCase().includes(query) ||
          patient.email.toLowerCase().includes(query) ||
          patient.phone.includes(query)
        )
      }
      
      // Apply health status filter
      if (selectedHealthStatus.value) {
        filtered = filtered.filter(patient =>
          patient.healthStatus === selectedHealthStatus.value
        )
      }
      
      // Apply sorting
      filtered.sort((a, b) => {
        switch (sortBy.value) {
          case 'name':
            return a.name.localeCompare(b.name)
          case 'lastVisit':
            return new Date(b.lastVisit) - new Date(a.lastVisit)
          case 'nextAppointment':
            if (!a.nextAppointment) return 1
            if (!b.nextAppointment) return -1
            return new Date(a.nextAppointment) - new Date(b.nextAppointment)
          case 'healthStatus':
            const statusOrder = { 'Poor': 0, 'Needs Attention': 1, 'Good': 2, 'Excellent': 3 }
            return statusOrder[a.healthStatus] - statusOrder[b.healthStatus]
          default:
            return 0
        }
      })
      
      return filtered
    })
    
    const totalPages = computed(() => {
      return Math.ceil(filteredPatients.value.length / itemsPerPage.value)
    })
    
    const paginatedPatients = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredPatients.value.slice(start, end)
    })
    
    const visiblePages = computed(() => {
      const pages = []
      const maxVisible = 5
      let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
      let end = Math.min(totalPages.value, start + maxVisible - 1)
      
      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1)
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      return pages
    })
    
    // ==========================================
    // METHODS
    // ==========================================
    
    const formatDate = (date) => {
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
    
    const getHealthStatusDotColor = (status) => {
      switch (status) {
        case 'Excellent':
          return 'bg-green-500'
        case 'Good':
          return 'bg-blue-500'
        case 'Needs Attention':
          return 'bg-yellow-500'
        case 'Poor':
          return 'bg-red-500'
        default:
          return 'bg-gray-500'
      }
    }
    
    // Navigation methods
    const viewPatientProfile = (patientId) => {
      router.push(`/doctor-secretary/patients/${patientId}`)
    }
    
    const addNewPatient = () => {
      router.push('/doctor-secretary/patients/new')
    }
    
    const openChat = (patientId) => {
      router.push(`/doctor-secretary/chat?patient=${patientId}`)
    }
    
    const openClinicalNotes = (patientId) => {
      router.push(`/doctor-secretary/clinical-notes?patient=${patientId}`)
    }
    
    const bookAppointment = (patientId) => {
      if (userRole.value === 'secretary') {
        router.push(`/doctor-secretary/appointment-approval?patient=${patientId}`)
      } else {
        router.push(`/doctor-secretary/appointments?patient=${patientId}`)
      }
    }
    
    const exportPatientData = () => {
      // TODO: Implement export functionality
      emit('show-success', 'Patient data export initiated')
    }
    
    const loadPatients = async () => {
      isLoading.value = true
      try {
        // TODO: Replace with actual API call
        // const response = await api.get('/patients')
        // patients.value = response.data
        
        emit('show-success', 'Patients loaded successfully')
      } catch (error) {
        console.error('Error loading patients:', error)
        emit('show-error', 'Failed to load patients')
      } finally {
        isLoading.value = false
      }
    }
    
    // ==========================================
    // WATCHERS
    // ==========================================
    
    // Reset pagination when filters change
    watch([searchQuery, selectedHealthStatus], () => {
      currentPage.value = 1
    })
    
    // ==========================================
    // LIFECYCLE
    // ==========================================
    
    onMounted(() => {
      loadPatients()
    })
    
    // ==========================================
    // RETURN FOR TEMPLATE
    // ==========================================
    
    return {
      // State
      isLoading,
      searchQuery,
      selectedHealthStatus,
      sortBy,
      viewMode,
      currentPage,
      itemsPerPage,
      patientStats,
      patients,
      
      // Computed
      userRole,
      filteredPatients,
      totalPages,
      paginatedPatients,
      visiblePages,
      
      // Methods
      formatDate,
      getHealthStatusClasses,
      getHealthStatusDotColor,
      viewPatientProfile,
      addNewPatient,
      openChat,
      openClinicalNotes,
      bookAppointment,
      exportPatientData,
      loadPatients
    }
  }
}
</script>

<style scoped>
/* Custom grid responsive behavior */
@media (min-width: 768px) {
  .md\\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .md\\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .lg\\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* Hover effects */
.hover\\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.hover\\:bg-gray-50:hover {
  background-color: #f9fafb;
}

.hover\\:bg-primary-700:hover {
  background-color: #0052a3;
}

.hover\\:text-primary-600:hover {
  color: #0066CC;
}

.hover\\:text-secondary-600:hover {
  color: #00A86B;
}

.hover\\:text-accent-600:hover {
  color: #e55a2b;
}

.hover\\:text-slate-600:hover {
  color: #475569;
}

/* Transition effects */
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

/* Custom color classes */
.bg-primary-100 { background-color: #dbeafe; }
.bg-primary-600 { background-color: #0066CC; }
.bg-primary-700 { background-color: #0052a3; }
.text-primary-600 { color: #0066CC; }
.text-secondary-600 { color: #00A86B; }
.text-accent-600 { color: #e55a2b; }

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

/* Table styling */
.divide-y > :not([hidden]) ~ :not([hidden]) {
  border-top-width: 1px;
}

.divide-gray-200 > :not([hidden]) ~ :not([hidden]) {
  border-color: #e5e7eb;
}

/* Responsive table */
@media (max-width: 768px) {
  .overflow-x-auto {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 #f1f5f9;
  }
  
  .overflow-x-auto::-webkit-scrollbar {
    height: 6px;
  }
  
  .overflow-x-auto::-webkit-scrollbar-track {
    background: #f1f5f9;
  }
  
  .overflow-x-auto::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
}

/* Focus states for accessibility */
button:focus,
input:focus,
select:focus {
  outline: 2px solid #0066CC;
  outline-offset: 2px;
}

/* Disabled state */
.disabled\\:opacity-50:disabled {
  opacity: 0.5;
}

.disabled\\:cursor-not-allowed:disabled {
  cursor: not-allowed;
}
</style>
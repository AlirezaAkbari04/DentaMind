const ClinicFlowManagementTemplate = `
<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div class="px-4 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl font-semibold text-slate-800">Clinic Flow Management</h1>
            <p class="text-sm text-slate-600">Real-time patient tracking and clinic optimization</p>
          </div>
          <div class="flex items-center space-x-3">
            <div class="text-sm text-slate-600">
              Last updated: {{ formatTime(lastUpdated) }}
            </div>
            <button
              @click="refreshData"
              class="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh Data"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="px-4 py-6 space-y-6">
      <!-- Flow Status Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-2xl font-bold text-blue-600">{{ flowStats.waiting }}</div>
              <div class="text-sm text-slate-600">Waiting Room</div>
            </div>
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-2xl font-bold text-orange-600">{{ flowStats.inTreatment }}</div>
              <div class="text-sm text-slate-600">In Treatment</div>
            </div>
            <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-2xl font-bold text-green-600">{{ flowStats.checkout }}</div>
              <div class="text-sm text-slate-600">Ready for Checkout</div>
            </div>
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-2xl font-bold text-slate-800">{{ flowStats.completed }}</div>
              <div class="text-sm text-slate-600">Completed Today</div>
            </div>
            <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Patient Flow List -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Current Patients -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100">
            <div class="p-4 border-b border-gray-100">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-slate-800">Current Patient Flow</h2>
                <button
                  @click="showCheckInModal = true"
                  class="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  Check In Patient
                </button>
              </div>
            </div>

            <div v-if="currentPatients.length === 0" class="text-center py-12">
              <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
              <p class="text-gray-500">No patients currently in clinic</p>
            </div>

            <div v-else class="divide-y divide-gray-100">
              <div
                v-for="patient in currentPatients"
                :key="patient.id"
                class="p-4 hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-4">
                    <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span class="text-primary-600 font-semibold text-sm">{{ patient.initials }}</span>
                    </div>
                    <div>
                      <h3 class="font-medium text-slate-800">{{ patient.name }}</h3>
                      <p class="text-sm text-slate-600">{{ patient.appointmentType }}</p>
                      <div class="text-xs text-slate-500 mt-1">
                        {{ getPatientLocationText(patient) }} • {{ getWaitTimeText(patient) }}
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex items-center space-x-3">
                    <span 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getStatusClass(patient.status)"
                    >
                      {{ getStatusText(patient.status) }}
                    </span>
                    
                    <div class="relative">
                      <button 
                        @click="togglePatientMenu(patient.id)"
                        class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                        </svg>
                      </button>
                      
                      <!-- Patient Actions Menu -->
                      <div 
                        v-if="activePatientMenu === patient.id"
                        class="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10"
                      >
                        <button 
                          v-if="patient.status === 'waiting'"
                          @click="moveToTreatment(patient)"
                          class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-gray-100"
                        >
                          Move to Treatment
                        </button>
                        <button 
                          v-if="patient.status === 'in-treatment'"
                          @click="moveToCheckout(patient)"
                          class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-gray-100"
                        >
                          Ready for Checkout
                        </button>
                        <button 
                          v-if="patient.status === 'checkout'"
                          @click="completeVisit(patient)"
                          class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-gray-100"
                        >
                          Complete Visit
                        </button>
                        <button 
                          @click="viewPatientDetails(patient)"
                          class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-gray-100"
                        >
                          View Details
                        </button>
                        <button 
                          @click="sendNotification(patient)"
                          class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-gray-100"
                        >
                          Send Notification
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Treatment Rooms -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100">
            <div class="p-4 border-b border-gray-100">
              <h2 class="text-lg font-semibold text-slate-800">Treatment Room Status</h2>
            </div>
            
            <div class="p-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="room in treatmentRooms"
                  :key="room.id"
                  class="p-4 border border-gray-200 rounded-lg"
                  :class="getRoomClass(room.status)"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="font-medium text-slate-800">{{ room.name }}</h4>
                      <p class="text-sm text-slate-600" v-if="room.patient">
                        {{ room.patient }} • Dr. {{ room.doctor }}
                      </p>
                      <p class="text-sm text-slate-500" v-else>Available</p>
                    </div>
                    <div 
                      class="w-3 h-3 rounded-full"
                      :class="room.status === 'occupied' ? 'bg-red-400' : room.status === 'cleaning' ? 'bg-yellow-400' : 'bg-green-400'"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Quick Actions -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 class="font-semibold text-slate-800 mb-4">Quick Actions</h3>
            <div class="space-y-3">
              <button
                @click="showCheckInModal = true"
                class="w-full bg-blue-600 text-white p-3 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                </svg>
                Check In Patient
              </button>
              <button
                @click="bulkCheckout"
                class="w-full bg-green-600 text-white p-3 rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Process Checkouts
              </button>
              <button
                @click="generateFlowReport"
                class="w-full bg-purple-600 text-white p-3 rounded-lg text-sm hover:bg-purple-700 transition-colors flex items-center justify-center"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                Flow Report
              </button>
            </div>
          </div>

          <!-- Wait Time Analytics -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 class="font-semibold text-slate-800 mb-4">Wait Time Analytics</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-slate-600">Average Wait:</span>
                <span class="font-semibold text-slate-800">{{ waitTimeStats.average }} min</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-slate-600">Longest Wait:</span>
                <span class="font-semibold" :class="waitTimeStats.longest > 30 ? 'text-red-600' : 'text-slate-800'">
                  {{ waitTimeStats.longest }} min
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-slate-600">On Schedule:</span>
                <span class="font-semibold" :class="waitTimeStats.onSchedule >= 80 ? 'text-green-600' : 'text-orange-600'">
                  {{ waitTimeStats.onSchedule }}%
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-slate-600">Efficiency Score:</span>
                <span class="font-semibold" :class="getEfficiencyClass(waitTimeStats.efficiency)">
                  {{ waitTimeStats.efficiency }}%
                </span>
              </div>
            </div>
          </div>

          <!-- Doctor Availability -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 class="font-semibold text-slate-800 mb-4">Doctor Availability</h3>
            <div class="space-y-3">
              <div
                v-for="doctor in doctorAvailability"
                :key="doctor.id"
                class="flex items-center justify-between"
              >
                <div class="flex items-center space-x-2">
                  <div
                    class="w-3 h-3 rounded-full"
                    :class="doctor.available ? 'bg-green-400' : 'bg-red-400'"
                  ></div>
                  <span class="text-sm text-slate-800">Dr. {{ doctor.name }}</span>
                </div>
                <span class="text-xs text-slate-500">
                  {{ doctor.available ? 'Available' : doctor.nextAvailable }}
                </span>
              </div>
            </div>
          </div>

          <!-- Today's Performance -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 class="font-semibold text-slate-800 mb-4">Today's Performance</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-slate-600">Patients Served:</span>
                <span class="font-semibold text-slate-800">{{ dailyStats.patientsServed }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-slate-600">No-Shows:</span>
                <span class="font-semibold text-slate-800">{{ dailyStats.noShows }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-slate-600">Utilization:</span>
                <span class="font-semibold text-slate-800">{{ dailyStats.utilization }}%</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-slate-600">Revenue Target:</span>
                <span class="font-semibold" :class="dailyStats.revenueProgress >= 100 ? 'text-green-600' : 'text-orange-600'">
                  {{ dailyStats.revenueProgress }}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Check-In Modal -->
    <div v-if="showCheckInModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-slate-800">Check In Patient</h2>
            <button @click="showCheckInModal = false" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="checkInPatient" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Select Patient *</label>
              <select
                v-model="checkInForm.patientId"
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Choose patient...</option>
                <option v-for="patient in scheduledPatients" :key="patient.id" :value="patient.id">
                  {{ patient.name }} - {{ patient.appointmentTime }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Arrival Status</label>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input 
                    v-model="checkInForm.arrivalStatus"
                    type="radio" 
                    value="on-time"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <span class="ml-2 text-sm text-slate-700">On Time</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="checkInForm.arrivalStatus"
                    type="radio" 
                    value="early"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <span class="ml-2 text-sm text-slate-700">Early</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="checkInForm.arrivalStatus"
                    type="radio" 
                    value="late"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <span class="ml-2 text-sm text-slate-700">Late</span>
                </label>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Notes</label>
              <textarea
                v-model="checkInForm.notes"
                rows="3"
                placeholder="Any special notes or instructions..."
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              ></textarea>
            </div>

            <div class="flex space-x-3 pt-4">
              <button
                type="button"
                @click="showCheckInModal = false"
                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Check In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Click outside handler -->
    <div 
      v-if="activePatientMenu" 
      @click="activePatientMenu = null"
      class="fixed inset-0 z-5"
    ></div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'ClinicFlowManagement',
  setup() {
    const router = useRouter()
    
    // Reactive data
    const lastUpdated = ref(new Date())
    const activePatientMenu = ref(null)
    const showCheckInModal = ref(false)
    const refreshInterval = ref(null)

    // Form data
    const checkInForm = ref({
      patientId: '',
      arrivalStatus: 'on-time',
      notes: ''
    })

    // Sample data - replace with API calls
    const currentPatients = ref([
      {
        id: 1,
        name: 'John Smith',
        initials: 'JS',
        appointmentType: 'Routine Cleaning',
        status: 'waiting',
        checkedInAt: new Date(Date.now() - 900000), // 15 min ago
        estimatedDuration: 60,
        doctor: 'Johnson',
        room: null
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        initials: 'SJ',
        appointmentType: 'Cavity Filling',
        status: 'in-treatment',
        checkedInAt: new Date(Date.now() - 1800000), // 30 min ago
        estimatedDuration: 45,
        doctor: 'Smith',
        room: 'Room 1'
      },
      {
        id: 3,
        name: 'Mike Wilson',
        initials: 'MW',
        appointmentType: 'Consultation',
        status: 'checkout',
        checkedInAt: new Date(Date.now() - 3600000), // 1 hour ago
        estimatedDuration: 30,
        doctor: 'Brown',
        room: null
      }
    ])

    const scheduledPatients = ref([
      { id: 4, name: 'Emily Davis', appointmentTime: '2:00 PM' },
      { id: 5, name: 'Robert Chen', appointmentTime: '2:30 PM' },
      { id: 6, name: 'Lisa Brown', appointmentTime: '3:00 PM' }
    ])

    const treatmentRooms = ref([
      { id: 1, name: 'Room 1', status: 'occupied', patient: 'Sarah Johnson', doctor: 'Smith' },
      { id: 2, name: 'Room 2', status: 'available', patient: null, doctor: null },
      { id: 3, name: 'Room 3', status: 'cleaning', patient: null, doctor: null },
      { id: 4, name: 'Room 4', status: 'available', patient: null, doctor: null }
    ])

    const doctorAvailability = ref([
      { id: 1, name: 'Johnson', available: true },
      { id: 2, name: 'Smith', available: false, nextAvailable: '2:00 PM' },
      { id: 3, name: 'Brown', available: true },
      { id: 4, name: 'Davis', available: true }
    ])

    // Computed properties
    const flowStats = computed(() => ({
      waiting: currentPatients.value.filter(p => p.status === 'waiting').length,
      inTreatment: currentPatients.value.filter(p => p.status === 'in-treatment').length,
      checkout: currentPatients.value.filter(p => p.status === 'checkout').length,
      completed: 8 // Today's completed count
    }))

    const waitTimeStats = computed(() => {
      const waitingPatients = currentPatients.value.filter(p => p.status === 'waiting')
      const waitTimes = waitingPatients.map(p => Math.floor((Date.now() - p.checkedInAt) / 60000))
      
      return {
        average: waitTimes.length > 0 ? Math.round(waitTimes.reduce((a, b) => a + b, 0) / waitTimes.length) : 0,
        longest: waitTimes.length > 0 ? Math.max(...waitTimes) : 0,
        onSchedule: 85,
        efficiency: 92
      }
    })

    const dailyStats = ref({
      patientsServed: 12,
      noShows: 2,
      utilization: 87,
      revenueProgress: 94
    })

    // Methods
    const formatTime = (date) => {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const getPatientLocationText = (patient) => {
      if (patient.status === 'waiting') return 'Waiting Room'
      if (patient.status === 'in-treatment') return patient.room || 'Treatment Area'
      if (patient.status === 'checkout') return 'Checkout Area'
      return 'Unknown'
    }

    const getWaitTimeText = (patient) => {
      const waitTime = Math.floor((Date.now() - patient.checkedInAt) / 60000)
      return waitTime + ' min'
    }

    const getStatusClass = (status) => {
      const classes = {
        'waiting': 'bg-blue-100 text-blue-800',
        'in-treatment': 'bg-orange-100 text-orange-800',
        'checkout': 'bg-green-100 text-green-800',
        'completed': 'bg-gray-100 text-gray-800'
      }
      return classes[status] || classes.waiting
    }

    const getStatusText = (status) => {
      const texts = {
        'waiting': 'Waiting',
        'in-treatment': 'In Treatment',
        'checkout': 'Ready for Checkout',
        'completed': 'Completed'
      }
      return texts[status] || 'Unknown'
    }

    const getRoomClass = (status) => {
      if (status === 'occupied') return 'border-red-200 bg-red-50'
      if (status === 'cleaning') return 'border-yellow-200 bg-yellow-50'
      return 'border-green-200 bg-green-50'
    }

    const getEfficiencyClass = (efficiency) => {
      if (efficiency >= 90) return 'text-green-600'
      if (efficiency >= 80) return 'text-yellow-600'
      return 'text-red-600'
    }

    const togglePatientMenu = (patientId) => {
      activePatientMenu.value = activePatientMenu.value === patientId ? null : patientId
    }

    const moveToTreatment = (patient) => {
      patient.status = 'in-treatment'
      const availableRoom = treatmentRooms.value.find(r => r.status === 'available')
      if (availableRoom) {
        availableRoom.status = 'occupied'
        availableRoom.patient = patient.name
        availableRoom.doctor = patient.doctor
        patient.room = availableRoom.name
      }
      activePatientMenu.value = null
      console.log('Moved to treatment:', patient.name)
    }

    const moveToCheckout = (patient) => {
      patient.status = 'checkout'
      // Free up the room
      const room = treatmentRooms.value.find(r => r.patient === patient.name)
      if (room) {
        room.status = 'cleaning'
        room.patient = null
        room.doctor = null
        setTimeout(() => {
          room.status = 'available'
        }, 300000) // 5 minutes cleaning time
      }
      patient.room = null
      activePatientMenu.value = null
      console.log('Moved to checkout:', patient.name)
    }

    const completeVisit = (patient) => {
      const index = currentPatients.value.findIndex(p => p.id === patient.id)
      if (index !== -1) {
        currentPatients.value.splice(index, 1)
      }
      activePatientMenu.value = null
      console.log('Completed visit:', patient.name)
    }

    const viewPatientDetails = (patient) => {
      activePatientMenu.value = null
      router.push(`/doctor-secretary/patients/${patient.id}`)
    }

    const sendNotification = (patient) => {
      activePatientMenu.value = null
      console.log('Sending notification to:', patient.name)
      // TODO: Implement notification system
    }

    const checkInPatient = () => {
      const selectedPatient = scheduledPatients.value.find(p => p.id == checkInForm.value.patientId)
      if (selectedPatient) {
        const newPatient = {
          id: selectedPatient.id,
          name: selectedPatient.name,
          initials: selectedPatient.name.split(' ').map(n => n[0]).join(''),
          appointmentType: 'Routine Checkup', // This would come from appointment data
          status: 'waiting',
          checkedInAt: new Date(),
          estimatedDuration: 60,
          doctor: 'Johnson', // This would be assigned
          room: null
        }
        
        currentPatients.value.push(newPatient)
        // Remove from scheduled list
        const index = scheduledPatients.value.findIndex(p => p.id === selectedPatient.id)
        if (index !== -1) {
          scheduledPatients.value.splice(index, 1)
        }
      }
      
      showCheckInModal.value = false
      checkInForm.value = {
        patientId: '',
        arrivalStatus: 'on-time',
        notes: ''
      }
      console.log('Checked in patient')
    }

    const bulkCheckout = () => {
      const checkoutPatients = currentPatients.value.filter(p => p.status === 'checkout')
      checkoutPatients.forEach(patient => completeVisit(patient))
      console.log('Bulk checkout completed')
    }

    const generateFlowReport = () => {
      console.log('Generating flow report')
      // TODO: Generate and download flow report
    }

    const refreshData = () => {
      lastUpdated.value = new Date()
      console.log('Refreshing clinic flow data')
      // TODO: Refresh data from API
    }

    // Auto-refresh data every 30 seconds
    const startAutoRefresh = () => {
      refreshInterval.value = setInterval(refreshData, 30000)
    }

    const stopAutoRefresh = () => {
      if (refreshInterval.value) {
        clearInterval(refreshInterval.value)
        refreshInterval.value = null
      }
    }

    // Lifecycle
    onMounted(() => {
      console.log('ClinicFlowManagement component mounted')
      startAutoRefresh()
    })

    onUnmounted(() => {
      stopAutoRefresh()
    })

    return {
      // Reactive data
      lastUpdated,
      activePatientMenu,
      showCheckInModal,
      checkInForm,
      currentPatients,
      scheduledPatients,
      treatmentRooms,
      doctorAvailability,
      dailyStats,
      
      // Computed
      flowStats,
      waitTimeStats,
      
      // Methods
      formatTime,
      getPatientLocationText,
      getWaitTimeText,
      getStatusClass,
      getStatusText,
      getRoomClass,
      getEfficiencyClass,
      togglePatientMenu,
      moveToTreatment,
      moveToCheckout,
      completeVisit,
      viewPatientDetails,
      sendNotification,
      checkInPatient,
      bulkCheckout,
      generateFlowReport,
      refreshData
    }
  }
}
</script>

<style scoped>
/* Color definitions */
.bg-primary-600 { background-color: #0066CC; }
.bg-primary-100 { background-color: #e6f3ff; }
.text-primary-600 { color: #0066CC; }

/* Focus states */
.focus\:ring-2:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px #0066CC;
}

/* Modal backdrop */
.fixed.inset-0.bg-black.bg-opacity-50 {
  backdrop-filter: blur(4px);
}

/* Hover effects */
.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
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

/* Animation for cards */
.bg-white {
  transition: all 0.2s ease;
}

.bg-white:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
</style>`;
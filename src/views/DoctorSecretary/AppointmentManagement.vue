const AppointmentManagementTemplate = `
<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div class="px-4 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl font-semibold text-slate-800">Appointment Management</h1>
            <p class="text-sm text-slate-600">Manage your schedule and patient appointments</p>
          </div>
          <button
            @click="showBookingModal = true"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
          >
            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            New Appointment
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="px-4 py-6 space-y-6">
      <!-- Quick Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="text-2xl font-bold text-slate-800">{{ todayStats.total }}</div>
          <div class="text-sm text-slate-600">Today's Appointments</div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="text-2xl font-bold text-green-600">{{ todayStats.completed }}</div>
          <div class="text-sm text-slate-600">Completed</div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="text-2xl font-bold text-blue-600">{{ todayStats.upcoming }}</div>
          <div class="text-sm text-slate-600">Upcoming</div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="text-2xl font-bold text-orange-600">{{ todayStats.waiting }}</div>
          <div class="text-sm text-slate-600">Waiting</div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div class="flex flex-col sm:flex-row gap-4 items-center">
          <div class="flex-1 relative">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search patients or appointments..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div class="flex gap-2">
            <select 
              v-model="selectedStatus"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <input 
              v-model="selectedDate"
              type="date"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <!-- Appointments List -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100">
        <div class="p-4 border-b border-gray-100">
          <h2 class="text-lg font-semibold text-slate-800">
            {{ selectedDate === today ? "Today's Schedule" : formatSelectedDate }}
          </h2>
        </div>

        <div v-if="filteredAppointments.length === 0" class="text-center py-12">
          <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-1 12a2 2 0 002 2h6a2 2 0 002-2L13 7"></path>
          </svg>
          <p class="text-gray-500">No appointments scheduled</p>
        </div>

        <div v-else class="divide-y divide-gray-100">
          <div
            v-for="appointment in filteredAppointments"
            :key="appointment.id"
            class="p-4 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span class="text-primary-600 font-semibold text-sm">{{ appointment.patientInitials }}</span>
                </div>
                <div>
                  <h3 class="font-medium text-slate-800">{{ appointment.patientName }}</h3>
                  <p class="text-sm text-slate-600">{{ appointment.type }}</p>
                  <div class="flex items-center space-x-4 text-xs text-slate-500 mt-1">
                    <span>{{ appointment.time }} • {{ appointment.duration }}</span>
                    <span v-if="appointment.phone">{{ appointment.phone }}</span>
                  </div>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusClass(appointment.status)"
                >
                  {{ getStatusText(appointment.status) }}
                </span>
                
                <div class="relative">
                  <button 
                    @click="toggleMenu(appointment.id)"
                    class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                    </svg>
                  </button>
                  
                  <!-- Dropdown Menu -->
                  <div 
                    v-if="activeMenuId === appointment.id"
                    class="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10"
                  >
                    <button 
                      @click="startAppointment(appointment)"
                      v-if="appointment.status === 'confirmed'"
                      class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-gray-100"
                    >
                      Start Appointment
                    </button>
                    <button 
                      @click="completeAppointment(appointment)"
                      v-if="appointment.status === 'in-progress'"
                      class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-gray-100"
                    >
                      Mark Complete
                    </button>
                    <button 
                      @click="viewPatient(appointment)"
                      class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-gray-100"
                    >
                      View Patient Profile
                    </button>
                    <button 
                      @click="editAppointment(appointment)"
                      class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-gray-100"
                    >
                      Edit Appointment
                    </button>
                    <button 
                      @click="rescheduleAppointment(appointment)"
                      class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-gray-100"
                    >
                      Reschedule
                    </button>
                    <div class="border-t border-gray-200 my-1"></div>
                    <button 
                      @click="cancelAppointment(appointment)"
                      class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Cancel Appointment
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Notes if any -->
            <div v-if="appointment.notes" class="mt-3 p-2 bg-gray-50 rounded text-sm text-slate-600">
              <strong>Notes:</strong> {{ appointment.notes }}
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- New Appointment Modal -->
    <div v-if="showBookingModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-slate-800">Schedule New Appointment</h2>
            <button @click="closeBookingModal" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="createAppointment" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Patient *</label>
              <select
                v-model="appointmentForm.patientId"
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select Patient</option>
                <option v-for="patient in patients" :key="patient.id" :value="patient.id">
                  {{ patient.name }} - {{ patient.phone }}
                </option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Date *</label>
                <input
                  v-model="appointmentForm.date"
                  type="date"
                  required
                  :min="today"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Time *</label>
                <select
                  v-model="appointmentForm.time"
                  required
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select Time</option>
                  <option v-for="slot in availableTimeSlots" :key="slot" :value="slot">
                    {{ slot }}
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Appointment Type *</label>
              <select
                v-model="appointmentForm.type"
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select Type</option>
                <option value="checkup">Regular Checkup</option>
                <option value="cleaning">Dental Cleaning</option>
                <option value="filling">Filling</option>
                <option value="extraction">Extraction</option>
                <option value="consultation">Consultation</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Duration</label>
              <select
                v-model="appointmentForm.duration"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="30 min">30 minutes</option>
                <option value="45 min">45 minutes</option>
                <option value="60 min">1 hour</option>
                <option value="90 min">1.5 hours</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Notes</label>
              <textarea
                v-model="appointmentForm.notes"
                rows="3"
                placeholder="Any special instructions or notes..."
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              ></textarea>
            </div>

            <div class="flex space-x-3 pt-4">
              <button
                type="button"
                @click="closeBookingModal"
                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Create Appointment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Click outside handler -->
    <div 
      v-if="activeMenuId" 
      @click="activeMenuId = null"
      class="fixed inset-0 z-5"
    ></div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'AppointmentManagement',
  setup() {
    const router = useRouter()
    
    // Reactive data
    const searchQuery = ref('')
    const selectedStatus = ref('')
    const selectedDate = ref(new Date().toISOString().split('T')[0])
    const activeMenuId = ref(null)
    const showBookingModal = ref(false)

    // Form data
    const appointmentForm = ref({
      patientId: '',
      date: '',
      time: '',
      type: '',
      duration: '60 min',
      notes: ''
    })

    // Sample data - replace with API calls
    const appointments = ref([
      {
        id: 1,
        patientName: 'John Smith',
        patientInitials: 'JS',
        phone: '(555) 123-4567',
        type: 'Routine Cleaning',
        time: '9:00 AM',
        duration: '60 min',
        status: 'confirmed',
        date: new Date(),
        notes: 'Patient requested gentle cleaning due to sensitivity'
      },
      {
        id: 2,
        patientName: 'Sarah Johnson',
        patientInitials: 'SJ',
        phone: '(555) 234-5678',
        type: 'Cavity Filling',
        time: '10:30 AM',
        duration: '45 min',
        status: 'in-progress',
        date: new Date(),
        notes: ''
      },
      {
        id: 3,
        patientName: 'Mike Wilson',
        patientInitials: 'MW',
        phone: '(555) 345-6789',
        type: 'Consultation',
        time: '2:00 PM',
        duration: '30 min',
        status: 'confirmed',
        date: new Date(),
        notes: 'First-time patient consultation for orthodontic evaluation'
      },
      {
        id: 4,
        patientName: 'Emily Davis',
        patientInitials: 'ED',
        phone: '(555) 456-7890',
        type: 'Regular Checkup',
        time: '3:30 PM',
        duration: '45 min',
        status: 'completed',
        date: new Date(),
        notes: ''
      }
    ])

    const patients = ref([
      { id: 1, name: 'John Smith', phone: '(555) 123-4567' },
      { id: 2, name: 'Sarah Johnson', phone: '(555) 234-5678' },
      { id: 3, name: 'Mike Wilson', phone: '(555) 345-6789' },
      { id: 4, name: 'Emily Davis', phone: '(555) 456-7890' }
    ])

    // Computed properties
    const today = computed(() => new Date().toISOString().split('T')[0])
    
    const formatSelectedDate = computed(() => {
      const date = new Date(selectedDate.value)
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    })

    const filteredAppointments = computed(() => {
      let filtered = appointments.value

      // Filter by date
      if (selectedDate.value) {
        const filterDate = new Date(selectedDate.value).toDateString()
        filtered = filtered.filter(apt => apt.date.toDateString() === filterDate)
      }

      // Filter by status
      if (selectedStatus.value) {
        filtered = filtered.filter(apt => apt.status === selectedStatus.value)
      }

      // Filter by search query
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(apt => 
          apt.patientName.toLowerCase().includes(query) ||
          apt.type.toLowerCase().includes(query)
        )
      }

      // Sort by time
      return filtered.sort((a, b) => {
        const timeA = convertTimeToMinutes(a.time)
        const timeB = convertTimeToMinutes(b.time)
        return timeA - timeB
      })
    })

    const todayStats = computed(() => {
      const todayAppointments = appointments.value.filter(apt => 
        apt.date.toDateString() === new Date().toDateString()
      )
      
      return {
        total: todayAppointments.length,
        completed: todayAppointments.filter(apt => apt.status === 'completed').length,
        upcoming: todayAppointments.filter(apt => apt.status === 'confirmed').length,
        waiting: todayAppointments.filter(apt => apt.status === 'in-progress').length
      }
    })

    const availableTimeSlots = computed(() => {
      const slots = []
      for (let hour = 9; hour <= 17; hour++) {
        for (let minute of [0, 30]) {
          const time12 = formatTime24To12(hour, minute)
          slots.push(time12)
        }
      }
      return slots
    })

    // Methods
    const convertTimeToMinutes = (timeStr) => {
      const [time, period] = timeStr.split(' ')
      let [hours, minutes] = time.split(':').map(Number)
      
      if (period === 'PM' && hours !== 12) hours += 12
      if (period === 'AM' && hours === 12) hours = 0
      
      return hours * 60 + minutes
    }

    const formatTime24To12 = (hour, minute) => {
      const period = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
      return displayHour + ':' + minute.toString().padStart(2, '0') + ' ' + period
    }

    const getStatusClass = (status) => {
      const classes = {
        'confirmed': 'bg-blue-100 text-blue-800',
        'in-progress': 'bg-orange-100 text-orange-800',
        'completed': 'bg-green-100 text-green-800',
        'cancelled': 'bg-red-100 text-red-800'
      }
      return classes[status] || classes.confirmed
    }

    const getStatusText = (status) => {
      const texts = {
        'confirmed': 'Confirmed',
        'in-progress': 'In Progress',
        'completed': 'Completed',
        'cancelled': 'Cancelled'
      }
      return texts[status] || 'Unknown'
    }

    const toggleMenu = (appointmentId) => {
      activeMenuId.value = activeMenuId.value === appointmentId ? null : appointmentId
    }

    const startAppointment = (appointment) => {
      appointment.status = 'in-progress'
      activeMenuId.value = null
      console.log('Starting appointment:', appointment.id)
    }

    const completeAppointment = (appointment) => {
      appointment.status = 'completed'
      activeMenuId.value = null
      console.log('Completing appointment:', appointment.id)
    }

    const viewPatient = (appointment) => {
      activeMenuId.value = null
      router.push(`/doctor-secretary/patients/${appointment.patientName.replace(' ', '-').toLowerCase()}`)
    }

    const editAppointment = (appointment) => {
      activeMenuId.value = null
      console.log('Editing appointment:', appointment.id)
      // TODO: Open edit modal
    }

    const rescheduleAppointment = (appointment) => {
      activeMenuId.value = null
      console.log('Rescheduling appointment:', appointment.id)
      // TODO: Open reschedule modal
    }

    const cancelAppointment = (appointment) => {
      if (confirm('Are you sure you want to cancel the appointment with ' + appointment.patientName + '?')) {
        appointment.status = 'cancelled'
        console.log('Cancelled appointment:', appointment.id)
      }
      activeMenuId.value = null
    }

    const closeBookingModal = () => {
      showBookingModal.value = false
      appointmentForm.value = {
        patientId: '',
        date: '',
        time: '',
        type: '',
        duration: '60 min',
        notes: ''
      }
    }

    const createAppointment = () => {
      const newAppointment = {
        id: Date.now(),
        patientName: patients.value.find(p => p.id == appointmentForm.value.patientId)?.name || '',
        patientInitials: patients.value.find(p => p.id == appointmentForm.value.patientId)?.name.split(' ').map(n => n[0]).join('') || '',
        phone: patients.value.find(p => p.id == appointmentForm.value.patientId)?.phone || '',
        type: appointmentForm.value.type,
        time: appointmentForm.value.time,
        duration: appointmentForm.value.duration,
        status: 'confirmed',
        date: new Date(appointmentForm.value.date),
        notes: appointmentForm.value.notes
      }
      
      appointments.value.push(newAppointment)
      console.log('Created appointment:', newAppointment)
      closeBookingModal()
    }

    // Lifecycle
    onMounted(() => {
      console.log('AppointmentManagement component mounted')
    })

    return {
      // Reactive data
      searchQuery,
      selectedStatus,
      selectedDate,
      activeMenuId,
      showBookingModal,
      appointmentForm,
      appointments,
      patients,
      
      // Computed
      today,
      formatSelectedDate,
      filteredAppointments,
      todayStats,
      availableTimeSlots,
      
      // Methods
      getStatusClass,
      getStatusText,
      toggleMenu,
      startAppointment,
      completeAppointment,
      viewPatient,
      editAppointment,
      rescheduleAppointment,
      cancelAppointment,
      closeBookingModal,
      createAppointment
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
</style>`;
<!-- All Appointments Page -->
<template>
  <div class="min-h-screen bg-neutral-50 pb-20">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-100 px-4 py-4">
      <div class="flex items-center justify-between">
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
            <h1 class="text-xl font-semibold text-slate-800">All Appointments</h1>
            <p class="text-sm text-slate-600 mt-1">Manage your family's dental appointments</p>
          </div>
        </div>
        <button 
          @click="showRequestModal = true"
          class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          Request Appointment
        </button>
      </div>
    </header>

    <!-- Filters and View Toggle -->
    <div class="px-4 py-4 bg-white border-b border-gray-100">
      <div class="flex items-center justify-between">
        <!-- Family Member Filter -->
        <div class="flex items-center space-x-3">
          <label class="text-sm font-medium text-slate-700">Show appointments for:</label>
          <select 
            v-model="selectedMember" 
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Family Members</option>
            <option 
              v-for="member in familyMembers"
              :key="member.id"
              :value="member.id"
            >
              {{ member.name }}
            </option>
          </select>
        </div>

        <!-- View Toggle -->
        <div class="flex bg-gray-100 rounded-lg p-1">
          <button
            @click="viewType = 'list'"
            class="px-3 py-1 rounded-md text-sm font-medium transition-colors"
            :class="viewType === 'list' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'"
          >
            List View
          </button>
          <button
            @click="viewType = 'calendar'"
            class="px-3 py-1 rounded-md text-sm font-medium transition-colors"
            :class="viewType === 'calendar' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'"
          >
            Calendar
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="px-4 py-6 space-y-6">
      <!-- Quick Stats -->
      <div class="grid grid-cols-3 gap-4">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-primary-600">{{ upcomingCount }}</div>
            <div class="text-sm text-slate-600">Upcoming</div>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-secondary-600">{{ pendingCount }}</div>
            <div class="text-sm text-slate-600">Pending Approval</div>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-accent-500">{{ totalThisMonth }}</div>
            <div class="text-sm text-slate-600">This Month</div>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-if="viewType === 'list'">
        <!-- Pending Requests -->
        <div v-if="pendingAppointments.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div class="flex items-center mb-4">
            <svg class="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
            </svg>
            <h2 class="text-lg font-semibold text-slate-800">Pending Requests</h2>
            <span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              {{ pendingAppointments.length }}
            </span>
          </div>
          
          <div class="space-y-3">
            <div
              v-for="appointment in pendingAppointments"
              :key="appointment.id"
              class="border border-yellow-200 rounded-lg p-4 bg-yellow-50"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center"
                       :class="getMemberAvatarClass(appointment.memberId)">
                    <span class="text-white text-sm font-bold">{{ getMemberInitials(appointment.memberId) }}</span>
                  </div>
                  <div>
                    <div class="font-semibold text-slate-800">{{ appointment.type }}</div>
                    <div class="text-sm text-slate-600">For {{ getMemberName(appointment.memberId) }}</div>
                    <div class="text-sm text-slate-600">Requested: {{ formatDate(appointment.requestedDate) }} at {{ appointment.requestedTime }}</div>
                  </div>
                </div>
                <div class="text-right">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {{ appointment.status }}
                  </span>
                  <div class="text-xs text-slate-500 mt-1">Dr. {{ appointment.doctor }}</div>
                </div>
              </div>
              
              <!-- Secretary Response (if any) -->
              <div v-if="appointment.secretaryResponse" class="mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <div class="text-sm font-medium text-blue-900">Secretary Response:</div>
                <div class="text-sm text-blue-800 mt-1">{{ appointment.secretaryResponse }}</div>
                <div v-if="appointment.alternativeOptions.length > 0" class="mt-2">
                  <div class="text-sm font-medium text-blue-900">Alternative Options:</div>
                  <div class="space-y-1 mt-1">
                    <button
                      v-for="option in appointment.alternativeOptions"
                      :key="option.id"
                      @click="acceptAlternative(appointment.id, option)"
                      class="block w-full text-left text-sm text-blue-700 hover:text-blue-900 hover:bg-blue-100 p-2 rounded"
                    >
                      {{ formatDate(option.date) }} at {{ option.time }} with Dr. {{ option.doctor }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Upcoming Appointments -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-slate-800">Upcoming Appointments</h2>
            <span class="text-sm text-slate-500">{{ confirmedAppointments.length }} confirmed</span>
          </div>
          
          <div v-if="confirmedAppointments.length === 0" class="text-center py-8">
            <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <p class="text-gray-500 mb-2">No upcoming appointments</p>
            <button 
              @click="showRequestModal = true"
              class="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Request your first appointment
            </button>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="appointment in confirmedAppointments"
              :key="appointment.id"
              class="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 rounded-full flex items-center justify-center"
                       :class="getMemberAvatarClass(appointment.memberId)">
                    <span class="text-white text-sm font-bold">{{ getMemberInitials(appointment.memberId) }}</span>
                  </div>
                  <div>
                    <div class="font-semibold text-slate-800">{{ appointment.type }}</div>
                    <div class="text-sm text-slate-600">{{ getMemberName(appointment.memberId) }}</div>
                    <div class="text-sm text-slate-600">Dr. {{ appointment.doctor }} • {{ appointment.clinic }}</div>
                  </div>
                </div>
                
                <div class="text-right">
                  <div class="font-medium text-slate-800">{{ formatDate(appointment.date) }}</div>
                  <div class="text-sm text-slate-600">{{ appointment.time }}</div>
                  <div class="flex items-center space-x-1 mt-1">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                          :class="getStatusClass(appointment.status)">
                      {{ appointment.status }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Appointment Actions -->
              <div class="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
                <div class="flex items-center space-x-4">
                  <button 
                    @click="addToCalendar(appointment)"
                    class="text-sm text-slate-600 hover:text-slate-800 flex items-center space-x-1"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span>Add to Calendar</span>
                  </button>
                  
                  <button 
                    @click="getDirections(appointment)"
                    class="text-sm text-slate-600 hover:text-slate-800 flex items-center space-x-1"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span>Directions</span>
                  </button>
                </div>
                
                <div class="flex items-center space-x-2">
                  <button 
                    @click="rescheduleAppointment(appointment)"
                    class="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Reschedule
                  </button>
                  <button 
                    @click="cancelAppointment(appointment)"
                    class="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Past Appointments -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-slate-800">Past Appointments</h2>
            <button 
              @click="showAllPast = !showAllPast"
              class="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              {{ showAllPast ? 'Show Less' : 'View All' }}
            </button>
          </div>
          
          <div class="space-y-3">
            <div
              v-for="appointment in displayedPastAppointments"
              :key="appointment.id"
              class="border border-gray-100 rounded-lg p-4 bg-gray-50"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center"
                       :class="getMemberAvatarClass(appointment.memberId)">
                    <span class="text-white text-sm font-bold">{{ getMemberInitials(appointment.memberId) }}</span>
                  </div>
                  <div>
                    <div class="font-medium text-slate-800">{{ appointment.type }}</div>
                    <div class="text-sm text-slate-600">{{ getMemberName(appointment.memberId) }}</div>
                    <div class="text-sm text-slate-600">Dr. {{ appointment.doctor }}</div>
                  </div>
                </div>
                
                <div class="text-right">
                  <div class="text-sm text-slate-800">{{ formatDate(appointment.date) }}</div>
                  <div class="text-xs text-slate-500">{{ appointment.time }}</div>
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                    Completed
                  </span>
                </div>
              </div>
              
              <!-- Show notes if available -->
              <div v-if="appointment.notes" class="mt-3 p-3 bg-white rounded-lg">
                <div class="text-sm font-medium text-slate-700">Visit Notes:</div>
                <div class="text-sm text-slate-600 mt-1">{{ appointment.notes }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Calendar View -->
      <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-slate-800">Calendar View</h2>
          <div class="flex items-center space-x-2">
            <button 
              @click="navigateMonth(-1)"
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <div class="text-lg font-medium text-slate-800 min-w-[200px] text-center">
              {{ currentMonthYear }}
            </div>
            <button 
              @click="navigateMonth(1)"
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Calendar Grid -->
        <div class="grid grid-cols-7 gap-1 mb-4">
          <!-- Day Headers -->
          <div v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" 
               :key="day"
               class="p-2 text-center text-sm font-medium text-slate-500 bg-gray-50">
            {{ day }}
          </div>

          <!-- Calendar Days -->
          <div
            v-for="date in calendarDays"
            :key="date.key"
            class="min-h-[80px] p-1 border border-gray-100"
            :class="[
              date.isCurrentMonth ? 'bg-white' : 'bg-gray-50',
              date.isToday ? 'ring-2 ring-primary-500' : ''
            ]"
          >
            <div class="text-sm font-medium text-slate-700 mb-1">{{ date.day }}</div>
            <div class="space-y-1">
              <div
                v-for="appointment in date.appointments"
                :key="appointment.id"
                class="text-xs p-1 rounded text-white cursor-pointer"
                :class="getAppointmentTypeColor(appointment.type)"
                @click="viewAppointmentDetails(appointment)"
              >
                {{ appointment.time }} {{ getMemberInitials(appointment.memberId) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Calendar Legend -->
        <div class="flex flex-wrap items-center gap-4 text-xs">
          <div class="flex items-center space-x-1">
            <div class="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Checkup</span>
          </div>
          <div class="flex items-center space-x-1">
            <div class="w-3 h-3 bg-green-500 rounded"></div>
            <span>Cleaning</span>
          </div>
          <div class="flex items-center space-x-1">
            <div class="w-3 h-3 bg-purple-500 rounded"></div>
            <span>Treatment</span>
          </div>
          <div class="flex items-center space-x-1">
            <div class="w-3 h-3 bg-orange-500 rounded"></div>
            <span>Consultation</span>
          </div>
        </div>
      </div>
    </main>

    <!-- Request Appointment Modal -->
    <div v-if="showRequestModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-slate-800">Request Appointment</h3>
          <button @click="closeRequestModal" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="submitAppointmentRequest" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Family Member</label>
            <select v-model="appointmentRequest.memberId" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="">Select family member...</option>
              <option 
                v-for="member in familyMembers"
                :key="member.id"
                :value="member.id"
              >
                {{ member.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Appointment Type</label>
            <select v-model="appointmentRequest.type" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="">Select appointment type...</option>
              <option value="checkup">Regular Checkup</option>
              <option value="cleaning">Dental Cleaning</option>
              <option value="consultation">Consultation</option>
              <option value="treatment">Treatment</option>
              <option value="emergency">Emergency</option>
              <option value="followup">Follow-up</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Preferred Doctor</label>
            <select v-model="appointmentRequest.doctorId" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="">No preference</option>
              <option 
                v-for="doctor in availableDoctors"
                :key="doctor.id"
                :value="doctor.id"
              >
                Dr. {{ doctor.name }} - {{ doctor.specialty }}
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Preferred Date</label>
              <input 
                v-model="appointmentRequest.preferredDate"
                type="date" 
                :min="tomorrow"
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Preferred Time</label>
              <select v-model="appointmentRequest.preferredTime" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option value="">Select time...</option>
                <option value="09:00">9:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="16:00">4:00 PM</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Reason for Visit</label>
            <textarea 
              v-model="appointmentRequest.reason"
              rows="3"
              placeholder="Describe the reason for this appointment..."
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Urgency Level</label>
            <select v-model="appointmentRequest.urgency" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="routine">Routine</option>
              <option value="urgent">Urgent</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>

          <div class="flex space-x-3 mt-6">
            <button 
              type="button"
              @click="closeRequestModal"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>

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
/* eslint-disable no-unused-vars */
/* eslint-disable vue/no-unused-vars */
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'AllAppointments',
  setup() {
    const route = useRoute()
    
    // Reactive data
    const selectedMember = ref('all')
    const viewType = ref('list')
    const showRequestModal = ref(false)
    const showAllPast = ref(false)
    const currentDate = ref(new Date())

    // Forms
    const appointmentRequest = ref({
      memberId: '',
      type: '',
      doctorId: '',
      preferredDate: '',
      preferredTime: '',
      reason: '',
      urgency: 'routine'
    })

    // Sample data - replace with API calls
    const familyMembers = ref([
      {
        id: 0,
        name: 'Sarah Johnson',
        initials: 'SJ',
        relationship: 'self'
      },
      {
        id: 1,
        name: 'Michael Johnson',
        initials: 'MJ',
        relationship: 'spouse'
      },
      {
        id: 2,
        name: 'Emily Johnson',
        initials: 'EJ',
        relationship: 'child'
      },
      {
        id: 3,
        name: 'David Johnson',
        initials: 'DJ',
        relationship: 'child'
      }
    ])

    const availableDoctors = ref([
      {
        id: 1,
        name: 'Johnson',
        specialty: 'General Dentistry'
      },
      {
        id: 2,
        name: 'Smith',
        specialty: 'Endodontist'
      },
      {
        id: 3,
        name: 'Davis',
        specialty: 'Orthodontist'
      }
    ])

    const allAppointments = ref([
      // Pending appointments
      {
        id: 1,
        memberId: 0,
        type: 'Regular Checkup',
        doctor: 'Johnson',
        clinic: 'Central Dental Clinic',
        requestedDate: new Date('2024-07-15'),
        requestedTime: '10:00 AM',
        status: 'pending',
        secretaryResponse: 'Dr. Johnson is fully booked on your requested date. Please see alternative options below.',
        alternativeOptions: [
          {
            id: 1,
            date: new Date('2024-07-16'),
            time: '10:00 AM',
            doctor: 'Johnson'
          },
          {
            id: 2,
            date: new Date('2024-07-15'),
            time: '2:00 PM',
            doctor: 'Smith'
          }
        ]
      },
      {
        id: 2,
        memberId: 2,
        type: 'Orthodontic Consultation',
        doctor: 'Davis',
        clinic: 'Orthodontic Specialists',
        requestedDate: new Date('2024-07-20'),
        requestedTime: '3:00 PM',
        status: 'pending',
        secretaryResponse: null,
        alternativeOptions: []
      },

      // Confirmed upcoming appointments
      {
        id: 3,
        memberId: 1,
        type: 'Dental Cleaning',
        doctor: 'Johnson',
        clinic: 'Central Dental Clinic',
        date: new Date('2024-07-12'),
        time: '9:00 AM',
        status: 'confirmed'
      },
      {
        id: 4,
        memberId: 0,
        type: 'Follow-up',
        doctor: 'Smith',
        clinic: 'Endodontic Specialists',
        date: new Date('2024-07-18'),
        time: '2:30 PM',
        status: 'confirmed'
      },
      {
        id: 5,
        memberId: 3,
        type: 'Regular Checkup',
        doctor: 'Johnson',
        clinic: 'Central Dental Clinic',
        date: new Date('2024-07-25'),
        time: '11:00 AM',
        status: 'confirmed'
      },

      // Past appointments
      {
        id: 6,
        memberId: 0,
        type: 'Root Canal',
        doctor: 'Smith',
        clinic: 'Endodontic Specialists',
        date: new Date('2024-06-20'),
        time: '10:00 AM',
        status: 'completed',
        notes: 'Root canal treatment completed successfully. Follow-up scheduled.'
      },
      {
        id: 7,
        memberId: 2,
        type: 'Dental Cleaning',
        doctor: 'Johnson',
        clinic: 'Central Dental Clinic',
        date: new Date('2024-06-15'),
        time: '3:00 PM',
        status: 'completed',
        notes: 'Routine cleaning completed. Good oral hygiene maintained.'
      },
      {
        id: 8,
        memberId: 1,
        type: 'Consultation',
        doctor: 'Davis',
        clinic: 'Orthodontic Specialists',
        date: new Date('2024-06-10'),
        time: '1:00 PM',
        status: 'completed',
        notes: 'Initial consultation for teeth whitening. Treatment plan provided.'
      }
    ])

    // Computed properties
    const filteredAppointments = computed(() => {
      if (selectedMember.value === 'all') {
        return allAppointments.value
      }
      return allAppointments.value.filter(apt => apt.memberId === selectedMember.value)
    })

    const pendingAppointments = computed(() => {
      return filteredAppointments.value.filter(apt => apt.status === 'pending')
    })

    const confirmedAppointments = computed(() => {
      return filteredAppointments.value
        .filter(apt => apt.status === 'confirmed' && apt.date >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
    })

    const pastAppointments = computed(() => {
      return filteredAppointments.value
        .filter(apt => apt.status === 'completed' || (apt.date && apt.date < new Date()))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
    })

    const displayedPastAppointments = computed(() => {
      return showAllPast.value ? pastAppointments.value : pastAppointments.value.slice(0, 3)
    })

    const upcomingCount = computed(() => confirmedAppointments.value.length)
    const pendingCount = computed(() => pendingAppointments.value.length)
    const totalThisMonth = computed(() => {
      const thisMonth = new Date().getMonth()
      const thisYear = new Date().getFullYear()
      return filteredAppointments.value.filter(apt => {
        const aptDate = apt.date || apt.requestedDate
        return aptDate && aptDate.getMonth() === thisMonth && aptDate.getFullYear() === thisYear
      }).length
    })

    const tomorrow = computed(() => {
      const date = new Date()
      date.setDate(date.getDate() + 1)
      return date.toISOString().split('T')[0]
    })

    const currentMonthYear = computed(() => {
      return currentDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    })

    const calendarDays = computed(() => {
      const year = currentDate.value.getFullYear()
      const month = currentDate.value.getMonth()
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      const startDate = new Date(firstDay)
      startDate.setDate(startDate.getDate() - firstDay.getDay())
      
      const days = []
      const today = new Date()
      
      for (let i = 0; i < 42; i++) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + i)
        
        const dayAppointments = filteredAppointments.value.filter(apt => {
          const aptDate = apt.date || apt.requestedDate
          return aptDate && 
                 aptDate.getDate() === date.getDate() && 
                 aptDate.getMonth() === date.getMonth() && 
                 aptDate.getFullYear() === date.getFullYear()
        })
        
        days.push({
          key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
          day: date.getDate(),
          date: date,
          isCurrentMonth: date.getMonth() === month,
          isToday: date.toDateString() === today.toDateString(),
          appointments: dayAppointments
        })
      }
      
      return days
    })

    // Methods
    const getMemberName = (memberId) => {
      const member = familyMembers.value.find(m => m.id === memberId)
      return member ? member.name : 'Unknown'
    }

    const getMemberInitials = (memberId) => {
      const member = familyMembers.value.find(m => m.id === memberId)
      return member ? member.initials : '??'
    }

    const getMemberAvatarClass = (memberId) => {
      const member = familyMembers.value.find(m => m.id === memberId)
      if (!member) return 'bg-gray-500'
      
      const colors = {
        self: 'bg-primary-500',
        spouse: 'bg-purple-500',
        child: 'bg-green-500',
        parent: 'bg-blue-500',
        sibling: 'bg-yellow-500'
      }
      return colors[member.relationship] || 'bg-gray-500'
    }

    const getStatusClass = (status) => {
      const classes = {
        confirmed: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        cancelled: 'bg-red-100 text-red-800',
        completed: 'bg-blue-100 text-blue-800'
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    }

    const getAppointmentTypeColor = (type) => {
      const colors = {
        'Regular Checkup': 'bg-blue-500',
        'Dental Cleaning': 'bg-green-500',
        'Treatment': 'bg-purple-500',
        'Consultation': 'bg-orange-500',
        'Follow-up': 'bg-indigo-500',
        'Emergency': 'bg-red-500'
      }
      return colors[type] || 'bg-gray-500'
    }

    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    }

    const navigateMonth = (direction) => {
      const newDate = new Date(currentDate.value)
      newDate.setMonth(newDate.getMonth() + direction)
      currentDate.value = newDate
    }

    const submitAppointmentRequest = () => {
      // TODO: Send API request to submit appointment request
      console.log('Submitting appointment request:', appointmentRequest.value)
      
      // Create new pending appointment
      const newAppointment = {
        id: Date.now(),
        memberId: parseInt(appointmentRequest.value.memberId),
        type: appointmentRequest.value.type,
        doctor: appointmentRequest.value.doctorId ? availableDoctors.value.find(d => d.id === parseInt(appointmentRequest.value.doctorId))?.name : 'Any Available',
        clinic: 'Central Dental Clinic',
        requestedDate: new Date(appointmentRequest.value.preferredDate),
        requestedTime: appointmentRequest.value.preferredTime,
        status: 'pending',
        reason: appointmentRequest.value.reason,
        urgency: appointmentRequest.value.urgency,
        secretaryResponse: null,
        alternativeOptions: []
      }
      
      allAppointments.value.unshift(newAppointment)
      closeRequestModal()
    }

    const closeRequestModal = () => {
      showRequestModal.value = false
      appointmentRequest.value = {
        memberId: '',
        type: '',
        doctorId: '',
        preferredDate: '',
        preferredTime: '',
        reason: '',
        urgency: 'routine'
      }
    }

    const acceptAlternative = (appointmentId, option) => {
      // TODO: Send API request to accept alternative
      console.log('Accepting alternative:', appointmentId, option)
      
      const appointment = allAppointments.value.find(apt => apt.id === appointmentId)
      if (appointment) {
        appointment.status = 'confirmed'
        appointment.date = option.date
        appointment.time = option.time
        appointment.doctor = option.doctor
        delete appointment.requestedDate
        delete appointment.requestedTime
        delete appointment.secretaryResponse
        delete appointment.alternativeOptions
      }
    }

    const rescheduleAppointment = (appointment) => {
      // TODO: Implement reschedule functionality
      console.log('Reschedule appointment:', appointment.id)
    }

    const cancelAppointment = (appointment) => {
      if (confirm(`Are you sure you want to cancel the ${appointment.type} appointment for ${getMemberName(appointment.memberId)}?`)) {
        // TODO: Send API request to cancel appointment
        console.log('Cancel appointment:', appointment.id)
        appointment.status = 'cancelled'
      }
    }

    const addToCalendar = (appointment) => {
      // TODO: Generate calendar event
      console.log('Add to calendar:', appointment.id)
    }

    const getDirections = (appointment) => {
      // TODO: Open maps/directions
      console.log('Get directions to:', appointment.clinic)
    }

    const viewAppointmentDetails = (appointment) => {
      // TODO: Show appointment details modal
      console.log('View appointment details:', appointment.id)
    }

    const openChat = () => {
      // TODO: Open chat interface
      console.log('Opening chat...')
    }

    onMounted(() => {
      // Check if member ID is passed via route query
      const memberId = route.query.member
      if (memberId) {
        selectedMember.value = parseInt(memberId)
      }
      
      // TODO: Fetch appointments from API
      console.log('Fetching appointments...')
    })

    return {
      // Reactive data
      selectedMember,
      viewType,
      showRequestModal,
      showAllPast,
      currentDate,
      appointmentRequest,
      familyMembers,
      availableDoctors,
      allAppointments,
      
      // Computed
      filteredAppointments,
      pendingAppointments,
      confirmedAppointments,
      pastAppointments,
      displayedPastAppointments,
      upcomingCount,
      pendingCount,
      totalThisMonth,
      tomorrow,
      currentMonthYear,
      calendarDays,
      
      // Methods
      getMemberName,
      getMemberInitials,
      getMemberAvatarClass,
      getStatusClass,
      getAppointmentTypeColor,
      formatDate,
      navigateMonth,
      submitAppointmentRequest,
      closeRequestModal,
      acceptAlternative,
      rescheduleAppointment,
      cancelAppointment,
      addToCalendar,
      getDirections,
      viewAppointmentDetails,
      openChat
    }
  }
}
</script>

<style scoped>
/* Ensure proper color classes */
.bg-primary-500 { background-color: #0066CC; }
.bg-primary-600 { background-color: #0052a3; }
.bg-primary-700 { background-color: #004085; }
.text-primary-600 { color: #0066CC; }
.text-primary-700 { color: #0052a3; }
.bg-secondary-600 { background-color: #00A86B; }
.text-secondary-600 { color: #00A86B; }
.bg-accent-500 { background-color: #FF6B35; }
.bg-accent-600 { background-color: #e55a2b; }
.bg-neutral-50 { background-color: #F8FAFC; }

/* Additional avatar colors */
.bg-purple-500 { background-color: #8b5cf6; }
.bg-green-500 { background-color: #10b981; }
.bg-blue-500 { background-color: #3b82f6; }
.bg-yellow-500 { background-color: #f59e0b; }
.bg-orange-500 { background-color: #f97316; }
.bg-indigo-500 { background-color: #6366f1; }
.bg-red-500 { background-color: #ef4444; }
.bg-gray-500 { background-color: #6b7280; }

/* Modal backdrop blur */
.fixed.inset-0.bg-black.bg-opacity-50 {
  backdrop-filter: blur(4px);
}

/* Custom scrollbar for modal content */
.max-h-\[90vh\]::-webkit-scrollbar {
  width: 4px;
}

.max-h-\[90vh\]::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.max-h-\[90vh\]::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.max-h-\[90vh\]::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Calendar grid responsive */
@media (max-width: 640px) {
  .min-h-\[80px\] {
    min-height: 60px;
  }
  
  .grid-cols-7 {
    gap: 1px;
  }
  
  .text-xs {
    font-size: 0.65rem;
  }
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

/* Transition effects */
.transition-shadow {
  transition: box-shadow 0.15s ease-in-out;
}

.transition-colors {
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
}

.hover\:shadow-sm:hover {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

/* Status indicators */
.bg-green-100 { background-color: #dcfce7; }
.text-green-800 { color: #166534; }
.bg-yellow-100 { background-color: #fef3c7; }
.text-yellow-800 { color: #92400e; }
.bg-red-100 { background-color: #fee2e2; }
.text-red-800 { color: #991b1b; }
.bg-blue-100 { background-color: #dbeafe; }
.text-blue-800 { color: #1e40af; }

/* Calendar today indicator */
.ring-2 {
  ring-width: 2px;
}
.ring-primary-500 {
  ring-color: #0066CC;
}
</style>
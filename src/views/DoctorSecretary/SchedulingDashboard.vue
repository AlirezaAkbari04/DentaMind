const SchedulingDashboardTemplate = `
<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div class="px-4 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl font-semibold text-slate-800">Scheduling Dashboard</h1>
            <p class="text-sm text-slate-600">Advanced appointment management and coordination</p>
          </div>
          <div class="flex items-center space-x-3">
            <button
              @click="showBulkActions = !showBulkActions"
              class="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
              </svg>
              Bulk Actions
            </button>
            <button
              @click="showBookingModal = true"
              class="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
            >
              <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              New Appointment
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="px-4 py-6 space-y-6">
      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-2xl font-bold text-slate-800">{{ todayStats.total }}</div>
              <div class="text-sm text-slate-600">Today's Appointments</div>
            </div>
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-1 12a2 2 0 002 2h6a2 2 0 002-2L13 7"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-2xl font-bold text-orange-600">{{ pendingRequests.length }}</div>
              <div class="text-sm text-slate-600">Pending Requests</div>
            </div>
            <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-2xl font-bold text-green-600">{{ todayStats.utilization }}%</div>
              <div class="text-sm text-slate-600">Utilization Rate</div>
            </div>
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-2xl font-bold text-red-600">{{ conflicts.length }}</div>
              <div class="text-sm text-slate-600">Scheduling Conflicts</div>
            </div>
            <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Bulk Actions Panel -->
      <div v-if="showBulkActions" class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-slate-800">Bulk Operations</h3>
          <button @click="showBulkActions = false" class="text-gray-500 hover:text-gray-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            @click="bulkReschedule"
            class="p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-1 12a2 2 0 002 2h6a2 2 0 002-2L13 7"></path>
            </svg>
            Bulk Reschedule
          </button>
          <button
            @click="bulkCancel"
            class="p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Bulk Cancel
          </button>
          <button
            @click="bulkReminder"
            class="p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5-5-5h5V3h0z"></path>
            </svg>
            Send Reminders
          </button>
          <button
            @click="exportSchedule"
            class="p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Export Schedule
          </button>
        </div>
      </div>

      <!-- Main Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Calendar View -->
        <div class="lg:col-span-3 space-y-6">
          <!-- Calendar Header -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-slate-800">Schedule Calendar</h3>
              <div class="flex items-center space-x-2">
                <button
                  @click="previousWeek"
                  class="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>
                <span class="text-sm font-medium text-slate-800 min-w-[120px] text-center">
                  {{ formatWeekRange(currentWeek) }}
                </span>
                <button
                  @click="nextWeek"
                  class="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
                <div class="ml-4 flex items-center space-x-2">
                  <button
                    @click="viewMode = 'week'"
                    :class="viewMode === 'week' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'"
                    class="px-3 py-1 rounded text-sm"
                  >
                    Week
                  </button>
                  <button
                    @click="viewMode = 'day'"
                    :class="viewMode === 'day' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'"
                    class="px-3 py-1 rounded text-sm"
                  >
                    Day
                  </button>
                </div>
              </div>
            </div>

            <!-- Calendar Grid -->
            <div v-if="viewMode === 'week'" class="overflow-x-auto">
              <div class="min-w-[800px]">
                <!-- Day Headers -->
                <div class="grid grid-cols-8 gap-1 mb-2">
                  <div class="p-2 text-xs font-medium text-center text-slate-600">Time</div>
                  <div
                    v-for="day in weekDays"
                    :key="day.date"
                    class="p-2 text-xs font-medium text-center"
                    :class="isToday(day.date) ? 'bg-primary-100 text-primary-700 rounded' : 'text-slate-600'"
                  >
                    <div>{{ day.name }}</div>
                    <div class="text-slate-500">{{ formatDayDate(day.date) }}</div>
                  </div>
                </div>

                <!-- Time Slots -->
                <div class="space-y-1 max-h-96 overflow-y-auto">
                  <div
                    v-for="hour in workingHours"
                    :key="hour"
                    class="grid grid-cols-8 gap-1"
                  >
                    <div class="p-2 text-xs text-slate-500 text-center border-r">
                      {{ formatHour(hour) }}
                    </div>
                    <div
                      v-for="day in weekDays"
                      :key="day.date + '-' + hour"
                      class="relative p-1 min-h-[40px] border border-gray-100 rounded cursor-pointer hover:bg-gray-50"
                      @click="openTimeSlot(day.date, hour)"
                    >
                      <div
                        v-for="appointment in getAppointmentsForSlot(day.date, hour)"
                        :key="appointment.id"
                        class="text-xs p-1 mb-1 rounded cursor-pointer"
                        :class="getAppointmentClass(appointment.status)"
                        @click.stop="editAppointment(appointment)"
                      >
                        <div class="font-medium truncate">{{ appointment.patientName }}</div>
                        <div class="text-xs opacity-75">{{ appointment.type }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Day View -->
            <div v-else class="space-y-2">
              <div class="flex items-center justify-between mb-4">
                <h4 class="font-medium text-slate-800">{{ formatDate(selectedDate) }}</h4>
                <input
                  type="date"
                  v-model="selectedDateInput"
                  class="px-3 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div class="space-y-1 max-h-96 overflow-y-auto">
                <div
                  v-for="hour in workingHours"
                  :key="hour"
                  class="flex items-center border border-gray-100 rounded"
                >
                  <div class="w-20 p-2 text-xs text-slate-500 text-center border-r">
                    {{ formatHour(hour) }}
                  </div>
                  <div
                    class="flex-1 p-2 min-h-[50px] hover:bg-gray-50 cursor-pointer"
                    @click="openTimeSlot(selectedDate, hour)"
                  >
                    <div
                      v-for="appointment in getAppointmentsForSlot(selectedDate, hour)"
                      :key="appointment.id"
                      class="p-2 mb-1 rounded cursor-pointer"
                      :class="getAppointmentClass(appointment.status)"
                      @click.stop="editAppointment(appointment)"
                    >
                      <div class="flex items-center justify-between">
                        <div>
                          <div class="font-medium">{{ appointment.patientName }}</div>
                          <div class="text-sm opacity-75">{{ appointment.type }} • Dr. {{ appointment.doctor }}</div>
                        </div>
                        <div class="text-xs opacity-75">{{ appointment.duration }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pending Requests -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-slate-800">Pending Appointment Requests</h3>
              <span class="text-sm text-slate-600">{{ pendingRequests.length }} requests</span>
            </div>

            <div v-if="pendingRequests.length === 0" class="text-center py-8">
              <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="text-gray-500">No pending requests</p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="request in pendingRequests"
                :key="request.id"
                class="border border-gray-200 rounded-lg p-4"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-3 mb-2">
                      <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span class="text-blue-600 text-sm font-semibold">{{ request.patientInitials }}</span>
                      </div>
                      <div>
                        <div class="font-medium text-slate-800">{{ request.patientName }}</div>
                        <div class="text-sm text-slate-600">{{ request.type }}</div>
                      </div>
                      <span
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                        :class="getPriorityClass(request.urgency)"
                      >
                        {{ request.urgency }}
                      </span>
                    </div>
                    
                    <div class="text-sm text-slate-600 mb-3">
                      <div><strong>Preferred:</strong> {{ formatDateTime(request.preferredDate, request.preferredTime) }}</div>
                      <div><strong>Doctor:</strong> Dr. {{ request.preferredDoctor }}</div>
                      <div v-if="request.reason"><strong>Reason:</strong> {{ request.reason }}</div>
                    </div>

                    <div class="flex items-center space-x-2">
                      <button
                        @click="approveRequest(request)"
                        class="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        @click="showAlternatives(request)"
                        class="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm hover:bg-yellow-200 transition-colors"
                      >
                        Suggest Alternatives
                      </button>
                      <button
                        @click="denyRequest(request)"
                        class="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
                      >
                        Deny
                      </button>
                    </div>
                  </div>
                  
                  <div class="text-xs text-slate-500">
                    {{ formatTimeAgo(request.submittedAt) }}
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
            <h3 class="font-semibold text-slate-800 mb-3">Quick Actions</h3>
            <div class="space-y-2">
              <button
                @click="showBookingModal = true"
                class="w-full bg-primary-600 text-white p-2 rounded-lg text-sm hover:bg-primary-700 transition-colors"
              >
                Book Appointment
              </button>
              <button
                @click="blockTimeSlot"
                class="w-full bg-secondary-600 text-white p-2 rounded-lg text-sm hover:bg-secondary-700 transition-colors"
              >
                Block Time Slot
              </button>
              <button
                @click="viewConflicts"
                class="w-full bg-orange-600 text-white p-2 rounded-lg text-sm hover:bg-orange-700 transition-colors"
              >
                Resolve Conflicts ({{ conflicts.length }})
              </button>
              <button
                @click="generateReport"
                class="w-full bg-purple-600 text-white p-2 rounded-lg text-sm hover:bg-purple-700 transition-colors"
              >
                Generate Report
              </button>
            </div>
          </div>

          <!-- Today's Overview -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 class="font-semibold text-slate-800 mb-3">Today's Overview</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center text-sm">
                <span class="text-slate-600">Total Appointments:</span>
                <span class="font-medium">{{ todayStats.total }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-slate-600">Completed:</span>
                <span class="font-medium text-green-600">{{ todayStats.completed }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-slate-600">No-shows:</span>
                <span class="font-medium text-red-600">{{ todayStats.noShows }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-slate-600">Available Slots:</span>
                <span class="font-medium text-blue-600">{{ todayStats.available }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-slate-600">Utilization:</span>
                <span class="font-medium">{{ todayStats.utilization }}%</span>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 class="font-semibold text-slate-800 mb-3">Recent Activity</h3>
            <div class="space-y-3 max-h-48 overflow-y-auto">
              <div
                v-for="activity in recentActivity"
                :key="activity.id"
                class="flex items-start space-x-2"
              >
                <div
                  class="w-2 h-2 rounded-full mt-2"
                  :class="getActivityColor(activity.type)"
                ></div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-slate-800">{{ activity.description }}</p>
                  <p class="text-xs text-slate-500">{{ formatTimeAgo(activity.timestamp) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Doctor Availability -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 class="font-semibold text-slate-800 mb-3">Doctor Availability</h3>
            <div class="space-y-2">
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
        </div>
      </div>
    </main>

    <!-- Booking Modal -->
    <div v-if="showBookingModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-slate-800">Book New Appointment</h2>
            <button @click="closeBookingModal" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="submitBooking" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Patient *</label>
              <select
                v-model="bookingForm.patientId"
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select Patient</option>
                <option v-for="patient in patients" :key="patient.id" :value="patient.id">
                  {{ patient.name }} - {{ patient.phone }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Doctor *</label>
              <select
                v-model="bookingForm.doctorId"
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select Doctor</option>
                <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.id">
                  Dr. {{ doctor.name }} - {{ doctor.specialty }}
                </option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Date *</label>
                <input
                  v-model="bookingForm.date"
                  type="date"
                  required
                  :min="today"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Time *</label>
                <select
                  v-model="bookingForm.time"
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
                v-model="bookingForm.type"
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select Type</option>
                <option value="checkup">Regular Checkup</option>
                <option value="cleaning">Dental Cleaning</option>
                <option value="filling">Filling</option>
                <option value="extraction">Extraction</option>
                <option value="emergency">Emergency</option>
                <option value="consultation">Consultation</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Duration</label>
              <select
                v-model="bookingForm.duration"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Notes</label>
              <textarea
                v-model="bookingForm.notes"
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
                Book Appointment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Alternatives Modal -->
    <div v-if="showAlternativesModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-slate-800">Suggest Alternatives</h2>
            <button @click="showAlternativesModal = false" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div v-if="selectedRequest" class="mb-4 p-3 bg-gray-50 rounded-lg">
            <div class="font-medium text-slate-800">{{ selectedRequest.patientName }}</div>
            <div class="text-sm text-slate-600">
              Requested: {{ formatDateTime(selectedRequest.preferredDate, selectedRequest.preferredTime) }}
            </div>
          </div>

          <form @submit.prevent="sendAlternatives" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Alternative Options</label>
              <div class="space-y-3">
                <div
                  v-for="(alternative, index) in alternatives"
                  :key="index"
                  class="border border-gray-200 rounded-lg p-3"
                >
                  <div class="grid grid-cols-2 gap-3 mb-2">
                    <input
                      v-model="alternative.date"
                      type="date"
                      :min="today"
                      class="p-2 border border-gray-300 rounded text-sm"
                    />
                    <select
                      v-model="alternative.time"
                      class="p-2 border border-gray-300 rounded text-sm"
                    >
                      <option value="">Select Time</option>
                      <option v-for="slot in availableTimeSlots" :key="slot" :value="slot">
                        {{ slot }}
                      </option>
                    </select>
                  </div>
                  <select
                    v-model="alternative.doctorId"
                    class="w-full p-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="">Select Doctor</option>
                    <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.id">
                      Dr. {{ doctor.name }}
                    </option>
                  </select>
                </div>
              </div>
              <button
                type="button"
                @click="addAlternative"
                class="mt-2 text-sm text-primary-600 hover:text-primary-700"
              >
                + Add Another Option
              </button>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Message to Patient</label>
              <textarea
                v-model="alternativeMessage"
                rows="3"
                placeholder="Explain why alternatives are being suggested..."
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              ></textarea>
            </div>

            <div class="flex space-x-3 pt-4">
              <button
                type="button"
                @click="showAlternativesModal = false"
                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Send Alternatives
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'SchedulingDashboard',
  setup() {
    const router = useRouter()
    
    // Reactive data
    const currentWeek = ref(new Date())
    const selectedDate = ref(new Date())
    const viewMode = ref('week')
    const showBulkActions = ref(false)
    const showBookingModal = ref(false)
    const showAlternativesModal = ref(false)
    const selectedRequest = ref(null)
    const workingHours = ref([9, 10, 11, 12, 13, 14, 15, 16, 17])

    // Form data
    const bookingForm = ref({
      patientId: '',
      doctorId: '',
      date: '',
      time: '',
      type: '',
      duration: '60',
      notes: ''
    })

    const alternatives = ref([
      { date: '', time: '', doctorId: '' }
    ])
    const alternativeMessage = ref('')

    // Sample data - replace with API calls
    const appointments = ref([
      {
        id: 1,
        patientName: 'Sarah Johnson',
        patientInitials: 'SJ',
        doctor: 'Smith',
        date: new Date(),
        time: '09:00',
        duration: '60 min',
        type: 'Checkup',
        status: 'confirmed'
      },
      {
        id: 2,
        patientName: 'Mike Wilson',
        patientInitials: 'MW',
        doctor: 'Johnson',
        date: new Date(),
        time: '10:00',
        duration: '45 min',
        type: 'Cleaning',
        status: 'confirmed'
      },
      {
        id: 3,
        patientName: 'Emily Davis',
        patientInitials: 'ED',
        doctor: 'Brown',
        date: new Date(),
        time: '14:00',
        duration: '30 min',
        type: 'Emergency',
        status: 'urgent'
      }
    ])

    const pendingRequests = ref([
      {
        id: 1,
        patientName: 'John Smith',
        patientInitials: 'JS',
        preferredDate: new Date(Date.now() + 86400000),
        preferredTime: '10:00',
        preferredDoctor: 'Johnson',
        type: 'Regular Checkup',
        reason: 'Routine 6-month checkup',
        urgency: 'routine',
        submittedAt: new Date(Date.now() - 3600000)
      },
      {
        id: 2,
        patientName: 'Lisa Brown',
        patientInitials: 'LB',
        preferredDate: new Date(Date.now() + 172800000),
        preferredTime: '14:30',
        preferredDoctor: 'Smith',
        type: 'Tooth Pain',
        reason: 'Experiencing severe tooth pain',
        urgency: 'urgent',
        submittedAt: new Date(Date.now() - 1800000)
      }
    ])

    const conflicts = ref([
      {
        id: 1,
        type: 'Double Booking',
        description: 'Dr. Smith has two appointments at 2:00 PM',
        date: new Date(),
        severity: 'high'
      }
    ])

    const patients = ref([
      { id: 1, name: 'Sarah Johnson', phone: '(555) 123-4567' },
      { id: 2, name: 'Mike Wilson', phone: '(555) 234-5678' },
      { id: 3, name: 'Emily Davis', phone: '(555) 345-6789' }
    ])

    const doctors = ref([
      { id: 1, name: 'Johnson', specialty: 'General Dentistry' },
      { id: 2, name: 'Smith', specialty: 'Endodontics' },
      { id: 3, name: 'Brown', specialty: 'Orthodontics' }
    ])

    const recentActivity = ref([
      {
        id: 1,
        type: 'appointment',
        description: 'New appointment booked for Sarah Johnson',
        timestamp: new Date(Date.now() - 900000)
      },
      {
        id: 2,
        type: 'request',
        description: 'Appointment request approved for Mike Wilson',
        timestamp: new Date(Date.now() - 1800000)
      },
      {
        id: 3,
        type: 'cancellation',
        description: 'Appointment cancelled by Emily Davis',
        timestamp: new Date(Date.now() - 3600000)
      }
    ])

    // Computed properties
    const today = computed(() => new Date().toISOString().split('T')[0])
    
    const selectedDateInput = computed({
      get: () => selectedDate.value.toISOString().split('T')[0],
      set: (value) => selectedDate.value = new Date(value)
    })

    const weekDays = computed(() => {
      const days = []
      const startOfWeek = new Date(currentWeek.value)
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1) // Monday
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek)
        date.setDate(startOfWeek.getDate() + i)
        days.push({
          name: date.toLocaleDateString('en', { weekday: 'short' }),
          date: date
        })
      }
      return days
    })

    const todayStats = computed(() => {
      const todayAppointments = appointments.value.filter(apt => 
        apt.date.toDateString() === new Date().toDateString()
      )
      const completed = todayAppointments.filter(apt => apt.status === 'completed').length
      const total = todayAppointments.length
      const available = workingHours.value.length * 7 - total // Simplified calculation
      const utilization = total > 0 ? Math.round((total / (total + available)) * 100) : 0
      
      return {
        total,
        completed,
        noShows: todayAppointments.filter(apt => apt.status === 'no-show').length,
        available,
        utilization
      }
    })

    const doctorAvailability = computed(() => {
      return doctors.value.map(doctor => ({
        ...doctor,
        available: Math.random() > 0.3, // Simplified availability
        nextAvailable: '2:00 PM'
      }))
    })

    const availableTimeSlots = computed(() => {
      const slots = []
      for (let hour = 9; hour <= 17; hour++) {
        for (let minute of ['00', '30']) {
          slots.push(`${hour.toString().padStart(2, '0')}:${minute}`)
        }
      }
      return slots
    })

    // Methods
    const formatWeekRange = (date) => {
      const start = new Date(date)
      start.setDate(start.getDate() - start.getDay() + 1)
      const end = new Date(start)
      end.setDate(start.getDate() + 6)
      
      return `${start.toLocaleDateString('en', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en', { month: 'short', day: 'numeric' })}`
    }

    const formatDayDate = (date) => {
      return date.getDate().toString()
    }

    const formatHour = (hour) => {
      const period = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour > 12 ? hour - 12 : hour
      return `${displayHour}:00 ${period}`
    }

    const formatDate = (date) => {
      return date.toLocaleDateString('en', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    }

    const formatDateTime = (date, time) => {
      return `${date.toLocaleDateString()} at ${time}`
    }

    const formatTimeAgo = (date) => {
      const now = new Date()
      const diffTime = Math.abs(now - date)
      const diffMinutes = Math.ceil(diffTime / (1000 * 60))
      
      if (diffMinutes < 60) return `${diffMinutes} min ago`
      const diffHours = Math.ceil(diffMinutes / 60)
      if (diffHours < 24) return `${diffHours} hr ago`
      const diffDays = Math.ceil(diffHours / 24)
      return `${diffDays} day ago`
    }

    const isToday = (date) => {
      return date.toDateString() === new Date().toDateString()
    }

    const previousWeek = () => {
      currentWeek.value = new Date(currentWeek.value.getTime() - 7 * 24 * 60 * 60 * 1000)
    }

    const nextWeek = () => {
      currentWeek.value = new Date(currentWeek.value.getTime() + 7 * 24 * 60 * 60 * 1000)
    }

    const getAppointmentsForSlot = (date, hour) => {
      return appointments.value.filter(apt => {
        const aptDate = apt.date.toDateString() === date.toDateString()
        const aptHour = parseInt(apt.time.split(':')[0])
        return aptDate && aptHour === hour
      })
    }

    const getAppointmentClass = (status) => {
      const classes = {
        'confirmed': 'bg-blue-100 text-blue-800 border border-blue-200',
        'urgent': 'bg-red-100 text-red-800 border border-red-200',
        'completed': 'bg-green-100 text-green-800 border border-green-200',
        'cancelled': 'bg-gray-100 text-gray-800 border border-gray-200',
        'no-show': 'bg-orange-100 text-orange-800 border border-orange-200'
      }
      return classes[status] || classes.confirmed
    }

    const getPriorityClass = (priority) => {
      const classes = {
        'emergency': 'bg-red-100 text-red-700',
        'urgent': 'bg-orange-100 text-orange-700',
        'routine': 'bg-green-100 text-green-700'
      }
      return classes[priority] || classes.routine
    }

    const getActivityColor = (type) => {
      const colors = {
        'appointment': 'bg-blue-400',
        'request': 'bg-green-400',
        'cancellation': 'bg-red-400',
        'reschedule': 'bg-yellow-400'
      }
      return colors[type] || colors.appointment
    }

    const openTimeSlot = (date, hour) => {
      showBookingModal.value = true
      bookingForm.value.date = date.toISOString().split('T')[0]
      bookingForm.value.time = `${hour.toString().padStart(2, '0')}:00`
    }

    const editAppointment = (appointment) => {
      console.log('Edit appointment:', appointment.id)
      // TODO: Open edit appointment modal
    }

    const approveRequest = (request) => {
      console.log('Approve request:', request.id)
      // TODO: Send API call to approve request
      const index = pendingRequests.value.findIndex(r => r.id === request.id)
      if (index !== -1) {
        pendingRequests.value.splice(index, 1)
      }
    }

    const showAlternatives = (request) => {
      selectedRequest.value = request
      showAlternativesModal.value = true
    }

    const denyRequest = (request) => {
      console.log('Deny request:', request.id)
      // TODO: Send API call to deny request
      const index = pendingRequests.value.findIndex(r => r.id === request.id)
      if (index !== -1) {
        pendingRequests.value.splice(index, 1)
      }
    }

    const closeBookingModal = () => {
      showBookingModal.value = false
      bookingForm.value = {
        patientId: '',
        doctorId: '',
        date: '',
        time: '',
        type: '',
        duration: '60',
        notes: ''
      }
    }

    const submitBooking = () => {
      console.log('Submit booking:', bookingForm.value)
      // TODO: Send API call to create appointment
      closeBookingModal()
    }

    const addAlternative = () => {
      alternatives.value.push({ date: '', time: '', doctorId: '' })
    }

    const sendAlternatives = () => {
      console.log('Send alternatives:', {
        request: selectedRequest.value.id,
        alternatives: alternatives.value,
        message: alternativeMessage.value
      })
      // TODO: Send API call with alternatives
      showAlternativesModal.value = false
      const index = pendingRequests.value.findIndex(r => r.id === selectedRequest.value.id)
      if (index !== -1) {
        pendingRequests.value.splice(index, 1)
      }
    }

    const blockTimeSlot = () => {
      console.log('Block time slot')
      // TODO: Open block time slot modal
    }

    const viewConflicts = () => {
      console.log('View conflicts')
      // TODO: Open conflicts resolution modal
    }

    const generateReport = () => {
      console.log('Generate report')
      // TODO: Generate and download scheduling report
    }

    const bulkReschedule = () => {
      console.log('Bulk reschedule')
      // TODO: Open bulk reschedule modal
    }

    const bulkCancel = () => {
      console.log('Bulk cancel')
      // TODO: Open bulk cancel modal
    }

    const bulkReminder = () => {
      console.log('Bulk reminder')
      // TODO: Send bulk reminders
    }

    const exportSchedule = () => {
      console.log('Export schedule')
      // TODO: Export schedule data
    }

    // Watchers
    watch(viewMode, (newMode) => {
      if (newMode === 'day') {
        selectedDate.value = new Date()
      }
    })

    // Lifecycle
    onMounted(() => {
      console.log('SchedulingDashboard component mounted')
      // TODO: Load appointments and requests from API
    })

    return {
      // Reactive data
      currentWeek,
      selectedDate,
      viewMode,
      showBulkActions,
      showBookingModal,
      showAlternativesModal,
      selectedRequest,
      workingHours,
      bookingForm,
      alternatives,
      alternativeMessage,
      appointments,
      pendingRequests,
      conflicts,
      patients,
      doctors,
      recentActivity,
      
      // Computed
      today,
      selectedDateInput,
      weekDays,
      todayStats,
      doctorAvailability,
      availableTimeSlots,
      
      // Methods
      formatWeekRange,
      formatDayDate,
      formatHour,
      formatDate,
      formatDateTime,
      formatTimeAgo,
      isToday,
      previousWeek,
      nextWeek,
      getAppointmentsForSlot,
      getAppointmentClass,
      getPriorityClass,
      getActivityColor,
      openTimeSlot,
      editAppointment,
      approveRequest,
      showAlternatives,
      denyRequest,
      closeBookingModal,
      submitBooking,
      addAlternative,
      sendAlternatives,
      blockTimeSlot,
      viewConflicts,
      generateReport,
      bulkReschedule,
      bulkCancel,
      bulkReminder,
      exportSchedule
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
.bg-secondary-600 { background-color: #00A86B; }
.bg-secondary-700 { background-color: #008c5a; }

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

/* Calendar grid styling */
.grid-cols-8 > div {
  min-height: 40px;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .lg\:col-span-3 {
    grid-column: span 1;
  }
  
  .lg\:grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .grid-cols-7 {
    font-size: 0.75rem;
  }
  
  .grid-cols-8 {
    font-size: 0.7rem;
  }
  
  .min-w-\[800px\] {
    min-width: 600px;
  }
}

/* Modal backdrop */
.fixed.inset-0.bg-black.bg-opacity-50 {
  backdrop-filter: blur(4px);
}

/* Button hover effects */
button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}

/* Focus states */
.focus\:ring-2:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px #0066CC;
}

/* Animation for stats cards */
.bg-white {
  transition: all 0.2s ease;
}

.bg-white:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}
</style>`;
  Appointment Approval Component (Secretary Only) - Responsive Fixed
  
  Professional appointment management system with:
  - Pending appointment requests with patient details
  - Quick approval/rejection actions
  - Bulk operations for multiple appointments
  - Advanced filtering and search capabilities
  - Conflict detection and scheduling optimization
  - Automated notifications to patients and doctors
  - Full responsive design for all screen sizes
-->
<template>
  <div class="p-3 sm:p-4 space-y-4 sm:space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
      <div class="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex-1 min-w-0">
          <h1 class="text-xl sm:text-2xl font-bold text-slate-800 truncate">Appointment Approval</h1>
          <p class="text-sm sm:text-base text-slate-600 mt-1">Review and manage patient appointment requests</p>
        </div>
        
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 flex-shrink-0">
          <!-- Status Summary -->
          <div class="flex items-center justify-center sm:justify-start space-x-3 sm:space-x-4 text-xs sm:text-sm">
            <div class="flex items-center space-x-1">
              <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span class="text-slate-600">{{ pendingCount }} Pending</span>
            </div>
            <div class="flex items-center space-x-1">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <span class="text-slate-600">{{ approvedToday }} Approved Today</span>
            </div>
          </div>
          
          <!-- Quick Actions -->
          <div class="flex items-center space-x-2 sm:space-x-3">
            <button 
              @click="showBulkActions = !showBulkActions"
              class="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors"
            >
              <span class="sm:hidden">Bulk</span>
              <span class="hidden sm:inline">Bulk Actions</span>
            </button>
            
            <button 
              @click="refreshAppointments"
              class="flex-1 sm:flex-none bg-primary-600 hover:bg-primary-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center justify-center"
            >
              <svg class="w-4 h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span class="sm:hidden">Refresh</span>
              <span class="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <!-- Search -->
        <div class="relative">
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="Search by patient name..."
            class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
          />
          <svg class="w-5 h-5 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <!-- Status Filter -->
        <select 
          v-model="statusFilter"
          class="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <!-- Priority Filter -->
        <select 
          v-model="priorityFilter"
          class="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
        >
          <option value="">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="normal">Normal</option>
          <option value="low">Low</option>
        </select>

        <!-- Date Filter -->
        <select 
          v-model="dateFilter"
          class="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
        >
          <option value="">All Dates</option>
          <option value="today">Today</option>
          <option value="tomorrow">Tomorrow</option>
          <option value="this-week">This Week</option>
          <option value="next-week">Next Week</option>
        </select>
      </div>

      <!-- Bulk Actions Panel -->
      <div v-if="showBulkActions" class="mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div class="flex items-center space-x-4">
            <label class="flex items-center">
              <input 
                type="checkbox"
                @change="toggleSelectAll"
                :checked="selectedAppointments.length === filteredAppointments.length && filteredAppointments.length > 0"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span class="ml-2 text-sm text-slate-700">
                Select All ({{ selectedAppointments.length }} selected)
              </span>
            </label>
          </div>
          
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <button 
              @click="bulkApprove"
              :disabled="selectedAppointments.length === 0"
              class="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Approve Selected
            </button>
            <button 
              @click="bulkReject"
              :disabled="selectedAppointments.length === 0"
              class="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reject Selected
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Appointments List -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100">
      <div class="p-4 sm:p-6 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-slate-800">
          Appointment Requests ({{ filteredAppointments.length }})
        </h2>
      </div>
      
      <div class="divide-y divide-gray-200">
        <div
          v-for="appointment in paginatedAppointments"
          :key="appointment.id"
          class="p-4 sm:p-6 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-start space-x-3 sm:space-x-4">
            <!-- Selection Checkbox -->
            <div v-if="showBulkActions" class="flex-shrink-0 pt-1">
              <input 
                type="checkbox"
                :value="appointment.id"
                v-model="selectedAppointments"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </div>

            <!-- Patient Avatar -->
            <div class="flex-shrink-0">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-slate-200 rounded-full flex items-center justify-center">
                <span class="text-xs sm:text-sm font-medium text-slate-600">
                  {{ appointment.patientName.split(' ').map(n => n[0]).join('') }}
                </span>
              </div>
            </div>

            <!-- Appointment Details -->
            <div class="flex-1 min-w-0">
              <div class="flex flex-col space-y-3">
                <!-- Patient Info and Status -->
                <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-2 sm:space-y-0">
                  <div class="flex-1 min-w-0">
                    <div class="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                      <h3 class="text-base sm:text-lg font-semibold text-slate-800 truncate">{{ appointment.patientName }}</h3>
                      <div class="flex items-center space-x-2">
                        <span 
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                          :class="getPriorityClasses(appointment.priority)"
                        >
                          {{ appointment.priority }} Priority
                        </span>
                        <span 
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                          :class="getStatusClasses(appointment.status)"
                        >
                          {{ appointment.status }}
                        </span>
                      </div>
                    </div>

                    <!-- Appointment Details Grid -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 mb-3">
                      <div class="flex items-center space-x-2">
                        <svg class="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a1 1 0 001 1h6a1 1 0 001-1V11a1 1 0 00-1-1H9a1 1 0 00-1 1z" />
                        </svg>
                        <span class="text-xs sm:text-sm text-slate-600 truncate">{{ formatDateTime(appointment.requestedDate, appointment.requestedTime) }}</span>
                      </div>

                      <div class="flex items-center space-x-2">
                        <svg class="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                        </svg>
                        <span class="text-xs sm:text-sm text-slate-600 truncate">{{ appointment.treatmentType }}</span>
                      </div>

                      <div class="flex items-center space-x-2">
                        <svg class="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span class="text-xs sm:text-sm text-slate-600">{{ appointment.estimatedDuration }} min</span>
                      </div>
                    </div>

                    <!-- Reason/Notes -->
                    <div v-if="appointment.reason" class="mb-3">
                      <p class="text-xs sm:text-sm text-slate-600">
                        <span class="font-medium">Reason:</span> {{ appointment.reason }}
                      </p>
                    </div>

                    <!-- Patient Contact -->
                    <div class="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-slate-500">
                      <span class="truncate">{{ appointment.patientPhone }}</span>
                      <span class="truncate">{{ appointment.patientEmail }}</span>
                      <span class="flex-shrink-0">Requested {{ formatTimeAgo(appointment.createdAt) }}</span>
                    </div>

                    <!-- Conflict Warning -->
                    <div v-if="appointment.hasConflict" class="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div class="flex items-start space-x-2">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <div class="flex-1 min-w-0">
                          <p class="text-xs sm:text-sm font-medium text-yellow-800">Scheduling Conflict</p>
                          <p class="text-xs sm:text-sm text-yellow-700">{{ appointment.conflictMessage }}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex sm:flex-col lg:flex-row items-stretch sm:items-end lg:items-center space-x-2 sm:space-x-0 sm:space-y-2 lg:space-y-0 lg:space-x-2 flex-shrink-0">
                    <!-- Action Icons for Mobile/Tablet -->
                    <div class="flex sm:hidden items-center space-x-2">
                      <button 
                        v-if="appointment.status === 'pending'"
                        @click="viewPatientHistory(appointment.patientId)"
                        class="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-gray-100 transition-colors"
                        title="View Patient History"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </button>

                      <button 
                        v-if="appointment.status === 'pending'"
                        @click="rescheduleAppointment(appointment)"
                        class="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Suggest Alternative Time"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a1 1 0 001 1h6a1 1 0 001-1V11a1 1 0 00-1-1H9a1 1 0 00-1 1z" />
                        </svg>
                      </button>
                    </div>

                    <!-- Desktop Action Icons -->
                    <div class="hidden sm:flex lg:hidden flex-col space-y-2">
                      <button 
                        v-if="appointment.status === 'pending'"
                        @click="viewPatientHistory(appointment.patientId)"
                        class="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-gray-100 transition-colors"
                        title="View Patient History"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </button>

                      <button 
                        v-if="appointment.status === 'pending'"
                        @click="rescheduleAppointment(appointment)"
                        class="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Suggest Alternative Time"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a1 1 0 001 1h6a1 1 0 001-1V11a1 1 0 00-1-1H9a1 1 0 00-1 1z" />
                        </svg>
                      </button>
                    </div>

                    <!-- Large Desktop Action Icons -->
                    <div class="hidden lg:flex items-center space-x-2">
                      <button 
                        v-if="appointment.status === 'pending'"
                        @click="viewPatientHistory(appointment.patientId)"
                        class="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-gray-100 transition-colors"
                        title="View Patient History"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </button>

                      <button 
                        v-if="appointment.status === 'pending'"
                        @click="rescheduleAppointment(appointment)"
                        class="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Suggest Alternative Time"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a1 1 0 001 1h6a1 1 0 001-1V11a1 1 0 00-1-1H9a1 1 0 00-1 1z" />
                        </svg>
                      </button>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex flex-col sm:flex-row lg:flex-col xl:flex-row space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-0 lg:space-y-2 xl:space-y-0 xl:space-x-2">
                      <button 
                        v-if="appointment.status === 'pending'"
                        @click="rejectAppointment(appointment)"
                        class="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-xs sm:text-sm font-medium"
                      >
                        Reject
                      </button>

                      <button 
                        v-if="appointment.status === 'pending'"
                        @click="approveAppointment(appointment)"
                        class="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-xs sm:text-sm font-medium"
                      >
                        Approve
                      </button>

                      <!-- Status Display for non-pending -->
                      <div v-else class="text-xs sm:text-sm">
                        <span v-if="appointment.status === 'approved'" class="text-green-600 font-medium">
                          ✓ Approved {{ formatTimeAgo(appointment.updatedAt) }}
                        </span>
                        <span v-else-if="appointment.status === 'rejected'" class="text-red-600 font-medium">
                          ✗ Rejected {{ formatTimeAgo(appointment.updatedAt) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredAppointments.length === 0" class="p-8 sm:p-12 text-center">
          <svg class="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a1 1 0 001 1h6a1 1 0 001-1V11a1 1 0 00-1-1H9a1 1 0 00-1 1z" />
          </svg>
          <h3 class="text-base sm:text-lg font-medium text-slate-800 mb-2">No Appointment Requests</h3>
          <p class="text-sm sm:text-base text-slate-600">No appointments match your current filters.</p>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="filteredAppointments.length > itemsPerPage" class="p-4 sm:p-6 border-t border-gray-200">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div class="text-xs sm:text-sm text-slate-600 text-center sm:text-left">
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredAppointments.length) }} of {{ filteredAppointments.length }} appointments
          </div>
          
          <div class="flex items-center justify-center space-x-2">
            <button 
              @click="currentPage = Math.max(1, currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-2 text-xs sm:text-sm text-slate-600 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <span class="px-3 py-2 text-xs sm:text-sm text-slate-600">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            
            <button 
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-2 text-xs sm:text-sm text-slate-600 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Reschedule Modal -->
    <div v-if="showRescheduleModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="closeRescheduleModal">
      <div @click.stop class="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div class="p-4 sm:p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-slate-800">Suggest Alternative Time</h3>
          <p class="text-sm text-slate-600 mt-1">Patient: {{ selectedAppointment?.patientName }}</p>
        </div>
        
        <div class="p-4 sm:p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Alternative Date</label>
            <input 
              v-model="rescheduleForm.date"
              type="date"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Alternative Time</label>
            <select 
              v-model="rescheduleForm.time"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select time...</option>
              <option value="09:00">9:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="14:00">2:00 PM</option>
              <option value="15:00">3:00 PM</option>
              <option value="16:00">4:00 PM</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Message to Patient</label>
            <textarea
              v-model="rescheduleForm.message"
              placeholder="Optional message explaining the reschedule..."
              rows="3"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            ></textarea>
          </div>
        </div>
        <div class="p-4 sm:p-6 border-t border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-3 sm:space-y-0 sm:space-x-3">
          <button 
            @click="closeRescheduleModal"
            class="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="sendRescheduleRequest"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Send Alternative
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'AppointmentApproval',
  emits: ['show-toast', 'show-error', 'show-success'],
  setup(_, { emit }) {
    const router = useRouter()
    
    // ==========================================
    // REACTIVE STATE
    // ==========================================
    
    const searchQuery = ref('')
    const statusFilter = ref('')
    const priorityFilter = ref('')
    const dateFilter = ref('')
    const showBulkActions = ref(false)
    const selectedAppointments = ref([])
    const currentPage = ref(1)
    const itemsPerPage = ref(10)
    const showRescheduleModal = ref(false)
    const selectedAppointment = ref(null)
    
    const rescheduleForm = ref({
      date: '',
      time: '',
      message: ''
    })
    
    // Mock data - replace with API calls
    const appointments = ref([
      {
        id: 'APT001',
        patientId: 'P001',
        patientName: 'John Smith',
        patientPhone: '+1 (555) 123-4567',
        patientEmail: 'john.smith@email.com',
        requestedDate: '2024-01-15',
        requestedTime: '10:00',
        treatmentType: 'Routine Cleaning',
        estimatedDuration: 30,
        priority: 'normal',
        status: 'pending',
        reason: 'Regular dental checkup and cleaning',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        hasConflict: false,
        conflictMessage: ''
      },
      {
        id: 'APT002',
        patientId: 'P002',
        patientName: 'Sarah Johnson',
        patientPhone: '+1 (555) 234-5678',
        patientEmail: 'sarah.j@email.com',
        requestedDate: '2024-01-15',
        requestedTime: '10:00',
        treatmentType: 'Emergency Check',
        estimatedDuration: 45,
        priority: 'urgent',
        status: 'pending',
        reason: 'Severe tooth pain, needs urgent attention',
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
        hasConflict: true,
        conflictMessage: 'Time slot conflicts with another appointment'
      },
      {
        id: 'APT003',
        patientId: 'P003',
        patientName: 'Mike Davis',
        patientPhone: '+1 (555) 345-6789',
        patientEmail: 'mike.davis@email.com',
        requestedDate: '2024-01-16',
        requestedTime: '14:00',
        treatmentType: 'Cavity Filling',
        estimatedDuration: 60,
        priority: 'high',
        status: 'approved',
        reason: 'Follow-up for cavity treatment',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        hasConflict: false
      },
      {
        id: 'APT004',
        patientId: 'P004',
        patientName: 'Emily Wilson',
        patientPhone: '+1 (555) 456-7890',
        patientEmail: 'emily.w@email.com',
        requestedDate: '2024-01-17',
        requestedTime: '11:00',
        treatmentType: 'Consultation',
        estimatedDuration: 30,
        priority: 'low',
        status: 'rejected',
        reason: 'Initial consultation for braces',
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        hasConflict: false
      }
    ])
    
    // ==========================================
    // COMPUTED PROPERTIES
    // ==========================================
    
    const filteredAppointments = computed(() => {
      let filtered = appointments.value
      
      // Search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(apt =>
          apt.patientName.toLowerCase().includes(query) ||
          apt.patientEmail.toLowerCase().includes(query) ||
          apt.treatmentType.toLowerCase().includes(query)
        )
      }
      
      // Status filter
      if (statusFilter.value) {
        filtered = filtered.filter(apt => apt.status === statusFilter.value)
      }
      
      // Priority filter
      if (priorityFilter.value) {
        filtered = filtered.filter(apt => apt.priority === priorityFilter.value)
      }
      
      // Date filter
      if (dateFilter.value) {
        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        
        filtered = filtered.filter(apt => {
          const aptDate = new Date(apt.requestedDate)
          
          switch (dateFilter.value) {
            case 'today':
              return aptDate.toDateString() === today.toDateString()
            case 'tomorrow':
              return aptDate.toDateString() === tomorrow.toDateString()
            case 'this-week':
              const weekStart = new Date(today)
              weekStart.setDate(today.getDate() - today.getDay())
              const weekEnd = new Date(weekStart)
              weekEnd.setDate(weekStart.getDate() + 6)
              return aptDate >= weekStart && aptDate <= weekEnd
            case 'next-week':
              const nextWeekStart = new Date(today)
              nextWeekStart.setDate(today.getDate() - today.getDay() + 7)
              const nextWeekEnd = new Date(nextWeekStart)
              nextWeekEnd.setDate(nextWeekStart.getDate() + 6)
              return aptDate >= nextWeekStart && aptDate <= nextWeekEnd
            default:
              return true
          }
        })
      }
      
      return filtered.sort((a, b) => {
        // Sort by priority (urgent first), then by creation date
        const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 }
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
        if (priorityDiff !== 0) return priorityDiff
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
    })
    
    const paginatedAppointments = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredAppointments.value.slice(start, end)
    })
    
    const totalPages = computed(() => {
      return Math.ceil(filteredAppointments.value.length / itemsPerPage.value)
    })
    
    const pendingCount = computed(() => {
      return appointments.value.filter(apt => apt.status === 'pending').length
    })
    
    const approvedToday = computed(() => {
      const today = new Date().toDateString()
      return appointments.value.filter(apt => 
        apt.status === 'approved' && 
        apt.updatedAt && 
        new Date(apt.updatedAt).toDateString() === today
      ).length
    })
    
    // ==========================================
    // METHODS
    // ==========================================
    
    const formatDateTime = (date, time) => {
      const dateObj = new Date(date)
      const options = { month: 'short', day: 'numeric', year: 'numeric' }
      const formattedDate = dateObj.toLocaleDateString('en-US', options)
      
      // Convert 24h to 12h format
      const [hours, minutes] = time.split(':')
      const hour12 = parseInt(hours) > 12 ? parseInt(hours) - 12 : parseInt(hours)
      const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM'
      const displayHour = hour12 === 0 ? 12 : hour12
      
      return `${formattedDate} at ${displayHour}:${minutes} ${ampm}`
    }
    
    const formatTimeAgo = (date) => {
      const now = new Date()
      const diffInMinutes = Math.floor((now - new Date(date)) / (1000 * 60))
      
      if (diffInMinutes < 1) return 'Just now'
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
      return `${Math.floor(diffInMinutes / 1440)}d ago`
    }
    
    const getPriorityClasses = (priority) => {
      switch (priority) {
        case 'urgent':
          return 'bg-red-100 text-red-800'
        case 'high':
          return 'bg-orange-100 text-orange-800'
        case 'normal':
          return 'bg-blue-100 text-blue-800'
        case 'low':
          return 'bg-gray-100 text-gray-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }
    
    const getStatusClasses = (status) => {
      switch (status) {
        case 'pending':
          return 'bg-yellow-100 text-yellow-800'
        case 'approved':
          return 'bg-green-100 text-green-800'
        case 'rejected':
          return 'bg-red-100 text-red-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }
    
    // Selection methods
    const toggleSelectAll = () => {
      if (selectedAppointments.value.length === filteredAppointments.value.length) {
        selectedAppointments.value = []
      } else {
        selectedAppointments.value = filteredAppointments.value.map(apt => apt.id)
      }
    }
    
    // Appointment actions
    const approveAppointment = async (appointment) => {
      try {
        // TODO: Replace with actual API call
        // await api.put(`/appointments/${appointment.id}/approve`)
        
        const index = appointments.value.findIndex(apt => apt.id === appointment.id)
        if (index !== -1) {
          appointments.value[index].status = 'approved'
          appointments.value[index].updatedAt = new Date()
        }
        
        emit('show-success', `Appointment for ${appointment.patientName} has been approved`)
        
        // Send notification to patient
        await sendNotification(appointment, 'approved')
        
      } catch (error) {
        console.error('Error approving appointment:', error)
        emit('show-error', 'Failed to approve appointment')
      }
    }
    
    const rejectAppointment = async (appointment) => {
      try {
        // TODO: Replace with actual API call
        // await api.put(`/appointments/${appointment.id}/reject`)
        
        const index = appointments.value.findIndex(apt => apt.id === appointment.id)
        if (index !== -1) {
          appointments.value[index].status = 'rejected'
          appointments.value[index].updatedAt = new Date()
        }
        
        emit('show-success', `Appointment for ${appointment.patientName} has been rejected`)
        
        // Send notification to patient
        await sendNotification(appointment, 'rejected')
        
      } catch (error) {
        console.error('Error rejecting appointment:', error)
        emit('show-error', 'Failed to reject appointment')
      }
    }
    
    const bulkApprove = async () => {
      if (selectedAppointments.value.length === 0) return
      
      try {
        // TODO: Replace with actual API call
        // await api.put('/appointments/bulk-approve', { ids: selectedAppointments.value })
        
        selectedAppointments.value.forEach(id => {
          const index = appointments.value.findIndex(apt => apt.id === id)
          if (index !== -1 && appointments.value[index].status === 'pending') {
            appointments.value[index].status = 'approved'
            appointments.value[index].updatedAt = new Date()
          }
        })
        
        emit('show-success', `${selectedAppointments.value.length} appointments have been approved`)
        selectedAppointments.value = []
        
      } catch (error) {
        console.error('Error bulk approving appointments:', error)
        emit('show-error', 'Failed to approve appointments')
      }
    }
    
    const bulkReject = async () => {
      if (selectedAppointments.value.length === 0) return
      
      try {
        // TODO: Replace with actual API call
        // await api.put('/appointments/bulk-reject', { ids: selectedAppointments.value })
        
        selectedAppointments.value.forEach(id => {
          const index = appointments.value.findIndex(apt => apt.id === id)
          if (index !== -1 && appointments.value[index].status === 'pending') {
            appointments.value[index].status = 'rejected'
            appointments.value[index].updatedAt = new Date()
          }
        })
        
        emit('show-success', `${selectedAppointments.value.length} appointments have been rejected`)
        selectedAppointments.value = []
        
      } catch (error) {
        console.error('Error bulk rejecting appointments:', error)
        emit('show-error', 'Failed to reject appointments')
      }
    }
    
    // Modal and navigation methods
    const rescheduleAppointment = (appointment) => {
      selectedAppointment.value = appointment
      rescheduleForm.value.date = ''
      rescheduleForm.value.time = ''
      rescheduleForm.value.message = `We need to reschedule your ${appointment.treatmentType} appointment. Please let us know if the suggested time works for you.`
      showRescheduleModal.value = true
    }
    
    const closeRescheduleModal = () => {
      showRescheduleModal.value = false
      selectedAppointment.value = null
      rescheduleForm.value = { date: '', time: '', message: '' }
    }
    
    const sendRescheduleRequest = async () => {
      if (!rescheduleForm.value.date || !rescheduleForm.value.time) {
        emit('show-error', 'Please select both date and time')
        return
      }
      
      try {
        // TODO: Replace with actual API call
        // await api.post(`/appointments/${selectedAppointment.value.id}/reschedule`, {
        //   newDate: rescheduleForm.value.date,
        //   newTime: rescheduleForm.value.time,
        //   message: rescheduleForm.value.message
        // })
        
        emit('show-success', `Reschedule request sent to ${selectedAppointment.value.patientName}`)
        closeRescheduleModal()
        
      } catch (error) {
        console.error('Error sending reschedule request:', error)
        emit('show-error', 'Failed to send reschedule request')
      }
    }
    
    const viewPatientHistory = (patientId) => {
      router.push(`/doctor-secretary/patient/${patientId}`)
    }
    
    const refreshAppointments = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await api.get('/appointments/pending')
        // appointments.value = response.data
        
        emit('show-success', 'Appointments refreshed')
        
      } catch (error) {
        console.error('Error refreshing appointments:', error)
        emit('show-error', 'Failed to refresh appointments')
      }
    }
    
    // Notification helper
    const sendNotification = async (appointment, action) => {
      try {
        // TODO: Replace with actual API call
        // await api.post('/notifications/send', {
        //   patientId: appointment.patientId,
        //   type: 'appointment_update',
        //   message: `Your appointment request has been ${action}`
        // })
        
        console.log(`Notification sent to ${appointment.patientName}: appointment ${action}`)
        
      } catch (error) {
        console.error('Error sending notification:', error)
      }
    }
    
    // Data loading
    const loadAppointments = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await api.get('/appointments/all')
        // appointments.value = response.data
        
        console.log('Appointments loaded successfully')
        
      } catch (error) {
        console.error('Error loading appointments:', error)
        emit('show-error', 'Failed to load appointments')
      }
    }
    
    // ==========================================
    // LIFECYCLE
    // ==========================================
    
    onMounted(() => {
      loadAppointments()
    })
    
    // ==========================================
    // RETURN FOR TEMPLATE
    // ==========================================
    
    return {
      // State
      searchQuery,
      statusFilter,
      priorityFilter,
      dateFilter,
      showBulkActions,
      selectedAppointments,
      currentPage,
      itemsPerPage,
      showRescheduleModal,
      selectedAppointment,
      rescheduleForm,
      appointments,
      
      // Computed
      filteredAppointments,
      paginatedAppointments,
      totalPages,
      pendingCount,
      approvedToday,
      
      // Methods
      formatDateTime,
      formatTimeAgo,
      getPriorityClasses,
      getStatusClasses,
      toggleSelectAll,
      approveAppointment,
      rejectAppointment,
      bulkApprove,
      bulkReject,
      rescheduleAppointment,
      closeRescheduleModal,
      sendRescheduleRequest,
      viewPatientHistory,
      refreshAppointments,
      loadAppointments
    }
  }
}
</script>

<style scoped>
/* Custom color classes */
.bg-primary-600 { background-color: #0066CC; }
.bg-primary-700 { background-color: #0052a3; }
.text-primary-600 { color: #0066CC; }
.border-primary-500 { border-color: #0066CC; }
.focus\:ring-primary-500:focus { box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1); }
.focus\:border-primary-500:focus { border-color: #0066CC; }

/* Responsive Grid Fixes */
@media (max-width: 640px) {
  .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
  .sm\:grid-cols-2 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
  .lg\:grid-cols-3 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
  .lg\:grid-cols-4 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
  
  /* Mobile Touch Targets */
  button {
    min-height: 44px;
    padding: 0.5rem 0.75rem;
  }
  
  input, select, textarea {
    min-height: 44px;
    padding: 0.5rem 0.75rem;
  }
  
  /* Better spacing on mobile */
  .space-y-3 > * + * { margin-top: 0.75rem; }
  .space-y-4 > * + * { margin-top: 1rem; }
  .space-x-2 > * + * { margin-left: 0.5rem; }
  .space-x-3 > * + * { margin-left: 0.75rem; }
  
  /* Mobile text adjustments */
  .text-xs { font-size: 0.7rem; }
  .text-sm { font-size: 0.8rem; }
}

@media (min-width: 640px) {
  .sm\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (min-width: 1024px) {
  .lg\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .lg\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

/* Flex Layout Improvements */
.flex { display: flex; }
.flex-1 { flex: 1 1 0%; }
.flex-shrink-0 { flex-shrink: 0; }
.min-w-0 { min-width: 0px; }
.items-start { align-items: flex-start; }
.items-center { align-items: center; }
.items-end { align-items: flex-end; }
.items-stretch { align-items: stretch; }
.justify-between { justify-content: space-between; }
.justify-center { justify-content: center; }
.justify-end { justify-content: flex-end; }

/* Flex Direction */
.flex-col { flex-direction: column; }
.flex-row { flex-direction: row; }

/* Text Truncation */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Hover effects */
.hover\:bg-gray-50:hover { background-color: #f9fafb; }
.hover\:bg-gray-100:hover { background-color: #f3f4f6; }
.hover\:bg-gray-200:hover { background-color: #e5e7eb; }
.hover\:bg-primary-700:hover { background-color: #0052a3; }
.hover\:text-slate-600:hover { color: #475569; }
.hover\:text-slate-800:hover { color: #1e293b; }
.hover\:bg-green-200:hover { background-color: #bbf7d0; }
.hover\:bg-red-200:hover { background-color: #fecaca; }
.hover\:bg-green-700:hover { background-color: #15803d; }
.hover\:bg-red-700:hover { background-color: #b91c1c; }

/* Transition effects */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Disabled states */
.disabled\:opacity-50:disabled { opacity: 0.5; }
.disabled\:cursor-not-allowed:disabled { cursor: not-allowed; }

/* Modal Responsiveness */
.fixed { position: fixed; }
.inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
.z-50 { z-index: 50; }

@media (max-width: 640px) {
  .max-h-\[90vh\] { max-height: calc(100vh - 2rem); }
}

/* Spacing Utilities */
.space-x-2 > * + * { margin-left: 0.5rem; }
.space-x-3 > * + * { margin-left: 0.75rem; }
.space-x-4 > * + * { margin-left: 1rem; }
.space-y-2 > * + * { margin-top: 0.5rem; }
.space-y-3 > * + * { margin-top: 0.75rem; }
.space-y-4 > * + * { margin-top: 1rem; }
.space-y-6 > * + * { margin-top: 1.5rem; }

/* Text Sizes */
.text-xs { font-size: 0.75rem; line-height: 1rem; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.text-base { font-size: 1rem; line-height: 1.5rem; }
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.text-2xl { font-size: 1.5rem; line-height: 2rem; }

/* Font weights */
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }

/* Background Colors */
.bg-white { background-color: #ffffff; }
.bg-gray-50 { background-color: #f9fafb; }
.bg-gray-100 { background-color: #f3f4f6; }
.bg-slate-200 { background-color: #e2e8f0; }
.bg-yellow-50 { background-color: #fefce8; }
.bg-yellow-100 { background-color: #fef3c7; }
.bg-green-100 { background-color: #dcfce7; }
.bg-red-100 { background-color: #fee2e2; }
.bg-blue-100 { background-color: #dbeafe; }
.bg-orange-100 { background-color: #fed7aa; }
.bg-green-600 { background-color: #16a34a; }
.bg-red-600 { background-color: #dc2626; }
.bg-yellow-500 { background-color: #eab308; }
.bg-green-500 { background-color: #22c55e; }
.bg-black { background-color: #000000; }
.bg-opacity-50 { background-color: rgba(0, 0, 0, 0.5); }

/* Text Colors */
.text-slate-300 { color: #cbd5e1; }
.text-slate-400 { color: #94a3b8; }
.text-slate-500 { color: #64748b; }
.text-slate-600 { color: #475569; }
.text-slate-700 { color: #334155; }
.text-slate-800 { color: #1e293b; }
.text-white { color: #ffffff; }
.text-gray-700 { color: #374151; }
.text-yellow-600 { color: #ca8a04; }
.text-yellow-700 { color: #a16207; }
.text-yellow-800 { color: #854d0e; }
.text-green-600 { color: #16a34a; }
.text-green-700 { color: #15803d; }
.text-green-800 { color: #166534; }
.text-red-600 { color: #dc2626; }
.text-red-700 { color: #b91c1c; }
.text-red-800 { color: #991b1b; }
.text-blue-800 { color: #1e40af; }
.text-orange-800 { color: #9a3412; }

/* Borders */
.border { border-width: 1px; }
.border-t { border-top-width: 1px; }
.border-b { border-bottom-width: 1px; }
.border-gray-100 { border-color: #f3f4f6; }
.border-gray-200 { border-color: #e5e7eb; }
.border-gray-300 { border-color: #d1d5db; }
.border-yellow-200 { border-color: #fde047; }

/* Border radius */
.rounded { border-radius: 0.25rem; }
.rounded-lg { border-radius: 0.5rem; }
.rounded-xl { border-radius: 0.75rem; }
.rounded-full { border-radius: 9999px; }

/* Shadows */
.shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
.shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }

/* Width and height */
.w-3 { width: 0.75rem; }
.w-4 { width: 1rem; }
.w-5 { width: 1.25rem; }
.w-10 { width: 2.5rem; }
.w-12 { width: 3rem; }
.w-16 { width: 4rem; }
.w-full { width: 100%; }
.h-3 { height: 0.75rem; }
.h-4 { height: 1rem; }
.h-5 { height: 1.25rem; }
.h-10 { height: 2.5rem; }
.h-12 { height: 3rem; }
.h-16 { height: 4rem; }

/* Max width/height */
.max-w-md { max-width: 28rem; }
.max-h-\[90vh\] { max-height: 90vh; }

/* Padding */
.p-2 { padding: 0.5rem; }
.p-3 { padding: 0.75rem; }
.p-4 { padding: 1rem; }
.p-6 { padding: 1.5rem; }
.p-8 { padding: 2rem; }
.p-12 { padding: 3rem; }

.px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
.py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }

.pl-10 { padding-left: 2.5rem; }
.pr-4 { padding-right: 1rem; }

/* Margin */
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 0.75rem; }
.mb-4 { margin-bottom: 1rem; }
.mt-1 { margin-top: 0.25rem; }
.mt-3 { margin-top: 0.75rem; }
.mt-4 { margin-top: 1rem; }
.ml-1 { margin-left: 0.25rem; }
.ml-2 { margin-left: 0.5rem; }
.mr-1 { margin-left: 0.25rem; }
.mr-2 { margin-right: 0.5rem; }

/* Positioning */
.relative { position: relative; }
.absolute { position: absolute; }
.top-2\.5 { top: 0.625rem; }
.left-3 { left: 0.75rem; }
.mt-0\.5 { margin-top: 0.125rem; }

/* Display */
.block { display: block; }
.inline-flex { display: inline-flex; }
.hidden { display: none; }

/* Responsive Display */
@media (max-width: 640px) {
  .sm\:hidden { display: none; }
  .hidden.sm\:flex { display: none; }
}

@media (min-width: 640px) {
  .sm\:flex { display: flex; }
  .sm\:hidden { display: none; }
  .sm\:inline { display: inline; }
  .sm\:block { display: block; }
  .sm\:flex-row { flex-direction: row; }
  .sm\:items-center { align-items: center; }
  .sm\:justify-between { justify-content: space-between; }
  .sm\:justify-start { justify-content: flex-start; }
  .sm\:space-y-0 > * + * { margin-top: 0; }
  .sm\:space-x-3 > * + * { margin-left: 0.75rem; }
  .sm\:text-left { text-align: left; }
}

@media (min-width: 1024px) {
  .lg\:flex { display: flex; }
  .lg\:hidden { display: none; }
  .lg\:flex-row { flex-direction: row; }
  .lg\:flex-col { flex-direction: column; }
  .lg\:items-center { align-items: center; }
  .lg\:space-y-0 > * + * { margin-top: 0; }
  .lg\:space-x-2 > * + * { margin-left: 0.5rem; }
}

@media (min-width: 1280px) {
  .xl\:flex-row { flex-direction: row; }
  .xl\:space-y-0 > * + * { margin-top: 0; }
  .xl\:space-x-2 > * + * { margin-left: 0.5rem; }
}

/* Text alignment */
.text-center { text-align: center; }
.text-left { text-align: left; }

/* Cursor */
.cursor-pointer { cursor: pointer; }

/* Overflow */
.overflow-hidden { overflow: hidden; }
.overflow-y-auto { overflow-y: auto; }

/* Divide utilities */
.divide-y > * + * { border-top-width: 1px; }
.divide-gray-200 > * + * { border-color: #e5e7eb; }

/* Focus states */
.focus\:ring-2:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px #0066CC;
}

/* Scrollbar styling */
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

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .transition-colors {
    transition: none;
  }
  
  .hover\:bg-gray-50:hover,
  button:hover {
    transition: none;
    transform: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .border-gray-100 {
    border-color: #6b7280;
  }
  
  .text-slate-600 {
    color: #374151;
  }
  
  .bg-gray-50 {
    background-color: #f9fafb;
  }
}

/* Print styles */
@media print {
  .fixed,
  button {
    display: none !important;
  }
  
  .bg-white {
    box-shadow: none;
    border: 1px solid #e5e7eb;
  }
}
</style>

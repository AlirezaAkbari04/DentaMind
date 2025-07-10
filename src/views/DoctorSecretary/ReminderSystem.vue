<!--
  Reminder System Component (Secretary Only)
  
  Simplified automated reminder management system
-->
<template>
  <div class="p-4 space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Reminder System</h1>
          <p class="text-slate-600">Manage automated reminders and patient communications</p>
        </div>
        
        <div class="flex items-center space-x-3">
          <div class="flex items-center space-x-4 text-sm">
            <div class="flex items-center space-x-1">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <span class="text-slate-600">{{ stats.sent }} Sent</span>
            </div>
            <div class="flex items-center space-x-1">
              <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span class="text-slate-600">{{ stats.pending }} Pending</span>
            </div>
          </div>
          
          <button 
            @click="showCreateModal = true"
            class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Create Reminder
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button 
          @click="activeTab = 'scheduled'"
          class="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors"
          :class="activeTab === 'scheduled' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-800'"
        >
          Scheduled ({{ reminders.length }})
        </button>
        
        <button 
          @click="activeTab = 'templates'"
          class="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors"
          :class="activeTab === 'templates' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-800'"
        >
          Templates
        </button>
        
        <button 
          @click="activeTab = 'analytics'"
          class="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors"
          :class="activeTab === 'analytics' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-800'"
        >
          Analytics
        </button>
      </div>
    </div>

    <!-- Scheduled Reminders -->
    <div v-if="activeTab === 'scheduled'" class="bg-white rounded-xl shadow-sm border border-gray-100">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-slate-800">Scheduled Reminders</h2>
      </div>
      
      <div class="divide-y divide-gray-200">
        <div
          v-for="reminder in reminders"
          :key="reminder.id"
          class="p-6 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-2">
                <h3 class="text-lg font-semibold text-slate-800">{{ reminder.patientName }}</h3>
                <span 
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  :class="getTypeClasses(reminder.type)"
                >
                  {{ reminder.type }}
                </span>
                <span 
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  :class="getStatusClasses(reminder.status)"
                >
                  {{ reminder.status }}
                </span>
              </div>

              <p class="text-sm text-slate-600 mb-2">{{ reminder.message }}</p>
              
              <div class="flex items-center space-x-4 text-sm text-slate-500">
                <span>{{ reminder.channel.toUpperCase() }}</span>
                <span>{{ formatDateTime(reminder.scheduledFor) }}</span>
                <span>{{ reminder.phone }}</span>
              </div>
            </div>

            <div class="flex items-center space-x-2">
              <button 
                v-if="reminder.status === 'pending'"
                @click="sendNow(reminder)"
                class="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
              >
                Send Now
              </button>
              
              <button 
                v-if="reminder.status === 'pending'"
                @click="cancelReminder(reminder)"
                class="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
              >
                Cancel
              </button>
              
              <button 
                v-if="reminder.status === 'failed'"
                @click="retryReminder(reminder)"
                class="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
              >
                Retry
              </button>
            </div>
          </div>
        </div>

        <div v-if="reminders.length === 0" class="p-12 text-center">
          <h3 class="text-lg font-medium text-slate-800 mb-2">No Reminders</h3>
          <p class="text-slate-600 mb-4">Create your first reminder to get started.</p>
          <button 
            @click="showCreateModal = true"
            class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Create Reminder
          </button>
        </div>
      </div>
    </div>

    <!-- Templates -->
    <div v-if="activeTab === 'templates'" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 class="text-lg font-semibold text-slate-800 mb-4">Message Templates</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="template in templates"
          :key="template.id"
          class="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 cursor-pointer transition-colors"
          @click="useTemplate(template)"
        >
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-medium text-slate-800">{{ template.name }}</h4>
            <span 
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
              :class="getTypeClasses(template.type)"
            >
              {{ template.type }}
            </span>
          </div>
          <p class="text-sm text-slate-600">{{ template.message }}</p>
        </div>
      </div>
    </div>

    <!-- Analytics -->
    <div v-if="activeTab === 'analytics'" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm text-slate-600">Total Sent</p>
              <p class="text-2xl font-bold text-slate-800">{{ analytics.totalSent }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm text-slate-600">Success Rate</p>
              <p class="text-2xl font-bold text-slate-800">{{ analytics.successRate }}%</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm text-slate-600">Open Rate</p>
              <p class="text-2xl font-bold text-slate-800">{{ analytics.openRate }}%</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm text-slate-600">Response Rate</p>
              <p class="text-2xl font-bold text-slate-800">{{ analytics.responseRate }}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Reminder Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="showCreateModal = false">
      <div @click.stop class="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-slate-800">Create New Reminder</h3>
        </div>
        
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Patient Name</label>
            <input 
              v-model="newReminder.patientName"
              type="text"
              placeholder="Enter patient name..."
              class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
            <input 
              v-model="newReminder.phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Reminder Type</label>
            <select 
              v-model="newReminder.type"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="appointment">Appointment</option>
              <option value="follow-up">Follow-up</option>
              <option value="medication">Medication</option>
              <option value="cleaning">Cleaning</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Message</label>
            <textarea
              v-model="newReminder.message"
              placeholder="Enter reminder message..."
              rows="3"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Channel</label>
              <select 
                v-model="newReminder.channel"
                class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="sms">SMS</option>
                <option value="email">Email</option>
                <option value="call">Phone Call</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">When</label>
              <select 
                v-model="newReminder.timing"
                class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="now">Send Now</option>
                <option value="1hour">In 1 Hour</option>
                <option value="1day">In 1 Day</option>
                <option value="1week">In 1 Week</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
          <button 
            @click="showCreateModal = false"
            class="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="createReminder"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'ReminderSystem',
  emits: ['show-success', 'show-error'],
  setup(_, { emit }) {
    
    // State
    const activeTab = ref('scheduled')
    const showCreateModal = ref(false)
    
    const stats = ref({
      sent: 23,
      pending: 8
    })
    
    const analytics = ref({
      totalSent: 247,
      successRate: 94,
      openRate: 87,
      responseRate: 24
    })
    
    const newReminder = ref({
      patientName: '',
      phone: '',
      type: 'appointment',
      message: '',
      channel: 'sms',
      timing: 'now'
    })
    
    const reminders = ref([
      {
        id: 1,
        patientName: 'John Smith',
        phone: '+1 (555) 123-4567',
        type: 'appointment',
        message: 'Reminder: Your appointment is tomorrow at 10:00 AM',
        channel: 'sms',
        status: 'pending',
        scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000)
      },
      {
        id: 2,
        patientName: 'Sarah Johnson',
        phone: '+1 (555) 234-5678',
        type: 'follow-up',
        message: 'Time for your follow-up appointment',
        channel: 'email',
        status: 'sent',
        scheduledFor: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 3,
        patientName: 'Mike Davis',
        phone: '+1 (555) 345-6789',
        type: 'medication',
        message: 'Don\'t forget to take your medication',
        channel: 'sms',
        status: 'failed',
        scheduledFor: new Date(Date.now() - 1 * 60 * 60 * 1000)
      }
    ])
    
    const templates = ref([
      {
        id: 1,
        name: 'Appointment Reminder',
        type: 'appointment',
        message: 'Hi, this is a reminder about your appointment tomorrow at {time}.'
      },
      {
        id: 2,
        name: 'Follow-up Care',
        type: 'follow-up',
        message: 'It\'s time for your follow-up appointment. Please call to schedule.'
      },
      {
        id: 3,
        name: 'Medication Reminder',
        type: 'medication',
        message: 'Don\'t forget to take your prescribed medication as directed.'
      },
      {
        id: 4,
        name: 'Cleaning Reminder',
        type: 'cleaning',
        message: 'It\'s time for your routine dental cleaning. Call to schedule!'
      }
    ])
    
    // Methods
    const formatDateTime = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    const getTypeClasses = (type) => {
      const classes = {
        appointment: 'bg-blue-100 text-blue-800',
        'follow-up': 'bg-green-100 text-green-800',
        medication: 'bg-purple-100 text-purple-800',
        cleaning: 'bg-teal-100 text-teal-800'
      }
      return classes[type] || 'bg-gray-100 text-gray-800'
    }
    
    const getStatusClasses = (status) => {
      const classes = {
        pending: 'bg-yellow-100 text-yellow-800',
        sent: 'bg-green-100 text-green-800',
        failed: 'bg-red-100 text-red-800'
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    }
    
    const sendNow = (reminder) => {
      reminder.status = 'sent'
      reminder.scheduledFor = new Date()
      emit('show-success', `Reminder sent to ${reminder.patientName}`)
    }
    
    const cancelReminder = (reminder) => {
      reminder.status = 'cancelled'
      emit('show-success', 'Reminder cancelled')
    }
    
    const retryReminder = (reminder) => {
      reminder.status = 'pending'
      reminder.scheduledFor = new Date(Date.now() + 5 * 60 * 1000)
      emit('show-success', 'Reminder scheduled for retry')
    }
    
    const useTemplate = (template) => {
      newReminder.value.type = template.type
      newReminder.value.message = template.message
      showCreateModal.value = true
    }
    
    const createReminder = () => {
      if (!newReminder.value.patientName || !newReminder.value.message) {
        emit('show-error', 'Please fill in all required fields')
        return
      }
      
      const scheduledFor = new Date()
      const timing = newReminder.value.timing
      
      if (timing === '1hour') scheduledFor.setHours(scheduledFor.getHours() + 1)
      else if (timing === '1day') scheduledFor.setDate(scheduledFor.getDate() + 1)
      else if (timing === '1week') scheduledFor.setDate(scheduledFor.getDate() + 7)
      
      const reminder = {
        id: Date.now(),
        patientName: newReminder.value.patientName,
        phone: newReminder.value.phone,
        type: newReminder.value.type,
        message: newReminder.value.message,
        channel: newReminder.value.channel,
        status: timing === 'now' ? 'sent' : 'pending',
        scheduledFor: scheduledFor
      }
      
      reminders.value.push(reminder)
      
      // Reset form
      newReminder.value = {
        patientName: '',
        phone: '',
        type: 'appointment',
        message: '',
        channel: 'sms',
        timing: 'now'
      }
      
      showCreateModal.value = false
      emit('show-success', `Reminder ${timing === 'now' ? 'sent' : 'scheduled'} successfully`)
    }
    
    onMounted(() => {
      console.log('Reminder System loaded')
    })
    
    return {
      activeTab,
      showCreateModal,
      stats,
      analytics,
      newReminder,
      reminders,
      templates,
      formatDateTime,
      getTypeClasses,
      getStatusClasses,
      sendNow,
      cancelReminder,
      retryReminder,
      useTemplate,
      createReminder
    }
  }
}
</script>

<style scoped>
.bg-primary-600 { background-color: #0066CC; }
.bg-primary-700 { background-color: #0052a3; }
.border-primary-500 { border-color: #0066CC; }
.focus\:ring-primary-500:focus { box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1); }
.focus\:border-primary-500:focus { border-color: #0066CC; }
.hover\:bg-primary-700:hover { background-color: #0052a3; }
.hover\:border-primary-300:hover { border-color: #93c5fd; }
.hover\:bg-primary-50:hover { background-color: #eff6ff; }

.transition-colors {
  transition: color, background-color, border-color 150ms ease;
}
</style>
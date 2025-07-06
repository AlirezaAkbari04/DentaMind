<!-- Patient Task Management Page -->
<template>
  <div class="min-h-screen bg-neutral-50 pb-20">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-100 px-4 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-semibold text-slate-800">My Tasks</h1>
          <p class="text-sm text-slate-600 mt-1">{{ completedCount }}/{{ totalTasks }} completed today</p>
        </div>
        <div class="text-right">
          <div class="text-2xl font-bold text-secondary-600">{{ progressPercentage }}%</div>
          <div class="text-xs text-slate-500">Progress</div>
        </div>
      </div>
      
      <!-- Progress Bar -->
      <div class="mt-4 w-full bg-gray-200 rounded-full h-2">
        <div 
          class="bg-secondary-600 h-2 rounded-full transition-all duration-500"
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="px-4 py-6 space-y-6">
      <!-- Alerts & Notifications Section -->
      <div v-if="alerts.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center mb-4">
          <svg class="w-5 h-5 text-accent-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
          </svg>
          <h2 class="text-lg font-semibold text-slate-800">Alerts & Notifications</h2>
        </div>
        <div class="space-y-3">
          <div
            v-for="alert in alerts"
            :key="alert.id"
            class="flex items-start space-x-3 p-4 rounded-lg"
            :class="getAlertClass(alert.priority)"
          >
            <svg v-if="alert.priority === 'high'" class="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            <svg v-else class="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
            </svg>
            <div class="flex-1">
              <div class="font-medium text-slate-800">{{ alert.title }}</div>
              <div class="text-sm text-slate-600 mt-1">{{ alert.message }}</div>
              <div class="text-xs text-slate-500 mt-2">{{ formatTimeAgo(alert.createdAt) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Today's Tasks -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-slate-800">Today's Tasks</h2>
          <span class="text-sm text-slate-500">{{ todayTasksCompleted }}/{{ todayTasks.length }} completed</span>
        </div>
        
        <div v-if="todayTasks.length === 0" class="text-center py-8">
          <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="text-gray-500">No tasks for today</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="task in todayTasks"
            :key="task.id"
            class="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow"
            :class="{ 'bg-gray-50 opacity-75': task.completed }"
          >
            <label class="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                v-model="task.completed"
                @change="updateTask(task)"
                class="mt-1 h-4 w-4 text-secondary-600 focus:ring-secondary-500 border-gray-300 rounded"
              />
              <div class="flex-1">
                <div 
                  class="font-medium text-slate-800"
                  :class="{ 'line-through text-gray-500': task.completed }"
                >
                  {{ task.title }}
                </div>
                <div class="text-sm text-slate-600 mt-1">{{ task.description }}</div>
                <div class="flex items-center space-x-4 mt-3">
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getPriorityClass(task.priority)"
                  >
                    {{ task.priority }}
                  </span>
                  <span class="text-xs text-slate-500">{{ task.estimatedTime }}</span>
                  <span v-if="task.dueTime" class="text-xs text-slate-500">Due: {{ task.dueTime }}</span>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Upcoming Tasks -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-semibold text-slate-800 mb-4">Upcoming Tasks</h2>
        
        <div v-if="upcomingTasks.length === 0" class="text-center py-8">
          <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="text-gray-500">No upcoming tasks</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="task in upcomingTasks"
            :key="task.id"
            class="border border-gray-100 rounded-lg p-4 bg-gray-50"
          >
            <div class="flex items-start space-x-3">
              <svg class="w-5 h-5 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div class="flex-1">
                <div class="font-medium text-slate-800">{{ task.title }}</div>
                <div class="text-sm text-slate-600 mt-1">{{ task.description }}</div>
                <div class="flex items-center space-x-4 mt-3">
                  <span class="text-xs text-slate-500">Due: {{ formatDate(task.dueDate) }}</span>
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getPriorityClass(task.priority)"
                  >
                    {{ task.priority }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Completed Tasks -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-slate-800">Recently Completed</h2>
          <button 
            @click="showAllCompleted = !showAllCompleted"
            class="text-sm text-primary-600 hover:text-primary-700"
          >
            {{ showAllCompleted ? 'Show Less' : 'Show All' }}
          </button>
        </div>
        
        <div v-if="completedTasks.length === 0" class="text-center py-8">
          <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="text-gray-500">No completed tasks yet</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="task in displayedCompletedTasks"
            :key="task.id"
            class="border border-gray-100 rounded-lg p-4 bg-green-50"
          >
            <div class="flex items-start space-x-3">
              <svg class="w-5 h-5 text-secondary-600 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <div class="flex-1">
                <div class="font-medium text-slate-800 line-through">{{ task.title }}</div>
                <div class="text-sm text-slate-600 mt-1">{{ task.description }}</div>
                <div class="text-xs text-slate-500 mt-2">
                  Completed: {{ formatTimeAgo(task.completedAt) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Bottom Navigation (Same as Dashboard) -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div class="flex justify-around items-center">
        <!-- Task Management -->
        <router-link to="/patient/tasks" 
                     class="flex flex-col items-center space-y-1 p-3 rounded-lg transition-colors text-secondary-600 bg-secondary-50">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
          </svg>
          <span class="text-xs font-medium">Tasks</span>
        </router-link>

        <!-- Dashboard -->
        <router-link to="/patient/dashboard" 
                     class="flex flex-col items-center space-y-1 p-3 rounded-lg transition-colors text-slate-600 hover:text-slate-800">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z M3 7l9 6 9-6"></path>
          </svg>
          <span class="text-xs font-medium">Dashboard</span>
        </router-link>

        <!-- Medical Records -->
        <router-link to="/patient/medical-records" 
                     class="flex flex-col items-center space-y-1 p-3 rounded-lg transition-colors text-slate-600 hover:text-slate-800">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
/* eslint-disable vue/no-unused-vars */
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'TaskManagement',
  setup() {
    const router = useRouter()
    const showAllCompleted = ref(false)
    
    // Sample data - replace with API calls
    const alerts = ref([
      {
        id: 1,
        title: 'Missed Appointment',
        message: 'You missed your cleaning appointment yesterday. Please reschedule.',
        priority: 'high',
        createdAt: new Date('2024-07-05T09:00:00')
      },
      {
        id: 2,
        title: 'Photo Upload Reminder',
        message: 'Weekly oral health photo is due in 2 days.',
        priority: 'medium',
        createdAt: new Date('2024-07-04T14:30:00')
      }
    ])

    const todayTasks = ref([
      {
        id: 1,
        title: 'Morning Brushing',
        description: 'Brush teeth for 2 minutes with fluoride toothpaste',
        completed: true,
        priority: 'high',
        estimatedTime: '2 min',
        dueTime: '8:00 AM'
      },
      {
        id: 2,
        title: 'Floss Between Teeth',
        description: 'Use dental floss to clean between all teeth',
        completed: false,
        priority: 'high',
        estimatedTime: '3 min',
        dueTime: '9:00 PM'
      },
      {
        id: 3,
        title: 'Take Prescribed Medication',
        description: 'Take antibiotic as prescribed by Dr. Johnson',
        completed: false,
        priority: 'medium',
        estimatedTime: '1 min',
        dueTime: '12:00 PM'
      },
      {
        id: 4,
        title: 'Rinse with Mouthwash',
        description: 'Use antibacterial mouthwash for 30 seconds',
        completed: true,
        priority: 'low',
        estimatedTime: '1 min',
        dueTime: '10:00 PM'
      }
    ])

    const upcomingTasks = ref([
      {
        id: 5,
        title: 'Weekly Photo Upload',
        description: 'Take and upload oral health photos for AI analysis',
        priority: 'medium',
        dueDate: new Date('2024-07-08')
      },
      {
        id: 6,
        title: 'Soft Diet Day 2',
        description: 'Continue soft diet after wisdom tooth extraction',
        priority: 'high',
        dueDate: new Date('2024-07-09')
      }
    ])

    const completedTasks = ref([
      {
        id: 7,
        title: 'Post-Surgery Care',
        description: 'Apply ice pack for 15 minutes',
        completedAt: new Date('2024-07-05T16:30:00')
      },
      {
        id: 8,
        title: 'Evening Brushing',
        description: 'Gentle brushing with soft bristle toothbrush',
        completedAt: new Date('2024-07-05T21:00:00')
      },
      {
        id: 9,
        title: 'Medication Reminder',
        description: 'Take pain medication as needed',
        completedAt: new Date('2024-07-05T14:00:00')
      }
    ])

    // Computed properties
    const totalTasks = computed(() => todayTasks.value.length)
    const completedCount = computed(() => todayTasks.value.filter(task => task.completed).length)
    const todayTasksCompleted = computed(() => todayTasks.value.filter(task => task.completed).length)
    const progressPercentage = computed(() => {
      if (totalTasks.value === 0) return 0
      return Math.round((completedCount.value / totalTasks.value) * 100)
    })

    const displayedCompletedTasks = computed(() => {
      return showAllCompleted.value ? completedTasks.value : completedTasks.value.slice(0, 3)
    })

    // Methods
    const updateTask = (task) => {
      // TODO: Send API request to update task completion status
      console.log('Updating task:', task.id, 'completed:', task.completed)
      
      // Simulate API call
      if (task.completed) {
        task.completedAt = new Date()
      }
    }

    const getPriorityClass = (priority) => {
      switch (priority) {
        case 'high':
          return 'bg-red-100 text-red-800'
        case 'medium':
          return 'bg-yellow-100 text-yellow-800'
        case 'low':
          return 'bg-green-100 text-green-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }

    const getAlertClass = (priority) => {
      switch (priority) {
        case 'high':
          return 'bg-red-50 border-l-4 border-red-400'
        case 'medium':
          return 'bg-yellow-50 border-l-4 border-yellow-400'
        case 'low':
          return 'bg-blue-50 border-l-4 border-blue-400'
        default:
          return 'bg-gray-50 border-l-4 border-gray-400'
      }
    }

    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      })
    }

    const formatTimeAgo = (date) => {
      const now = new Date()
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
      
      if (diffInHours < 1) {
        return 'Just now'
      } else if (diffInHours < 24) {
        return `${diffInHours}h ago`
      } else {
        const diffInDays = Math.floor(diffInHours / 24)
        return `${diffInDays}d ago`
      }
    }

    const openChat = () => {
      // TODO: Implement chat opening logic
      console.log('Opening chat...')
    }

    onMounted(() => {
      // TODO: Fetch tasks from API
      console.log('Fetching patient tasks...')
    })

    return {
      alerts,
      todayTasks,
      upcomingTasks,
      completedTasks,
      showAllCompleted,
      totalTasks,
      completedCount,
      todayTasksCompleted,
      progressPercentage,
      displayedCompletedTasks,
      updateTask,
      getPriorityClass,
      getAlertClass,
      formatDate,
      formatTimeAgo,
      openChat
    }
  }
}
</script>

<style scoped>
/* Ensure proper color classes are available */
.bg-primary-600 { background-color: #0066CC; }
.text-primary-600 { color: #0066CC; }
.text-primary-700 { color: #0052a3; }
.bg-secondary-600 { background-color: #00A86B; }
.bg-secondary-50 { background-color: #f0fdf4; }
.text-secondary-600 { color: #00A86B; }
.bg-accent-500 { background-color: #FF6B35; }
.bg-accent-600 { background-color: #e55a2b; }
.bg-neutral-50 { background-color: #F8FAFC; }

/* Custom checkbox styling */
input[type="checkbox"]:checked {
  background-color: #00A86B;
  border-color: #00A86B;
}

input[type="checkbox"]:focus {
  ring-color: #00A86B;
  border-color: #00A86B;
}
</style>
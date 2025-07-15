<template>
  <div class="min-h-screen bg-neutral-50 pb-20">
    <!-- Page Header -->
    <div class="bg-white border-b border-gray-200 px-4 py-6">
      <h1 class="text-2xl font-bold text-slate-800">My Tasks</h1>
      <p class="text-slate-600 mt-1">Manage your daily care routine and upcoming activities</p>
    </div>

    <div class="px-4 py-6 space-y-6">
      <!-- Today's Tasks - NOW FIRST! -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-slate-800">Today's Tasks</h2>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            <span class="text-sm text-slate-600">{{ todayProgress }}% Complete</span>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            class="bg-secondary-500 h-2 rounded-full transition-all duration-300"
            :style="{ width: todayProgress + '%' }"
          ></div>
        </div>

        <!-- Task List -->
        <div v-if="todayTasks.length === 0" class="text-center py-8">
          <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="text-gray-500">All tasks completed for today! 🎉</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="task in todayTasks"
            :key="task.id"
            class="border border-gray-100 rounded-lg p-4 transition-all duration-200"
            :class="task.completed ? 'bg-gray-50 opacity-60' : 'bg-white'"
          >
            <div class="flex items-start space-x-4">
              <button 
                @click="toggleTask(task.id)"
                class="flex-shrink-0 mt-1"
              >
                <div 
                  class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200"
                  :class="task.completed 
                    ? 'bg-secondary-500 border-secondary-500' 
                    : 'border-gray-300 hover:border-secondary-400'"
                >
                  <svg v-if="task.completed" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </button>
              
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <h3 
                    class="font-medium transition-all duration-200"
                    :class="task.completed ? 'text-gray-500 line-through' : 'text-slate-800'"
                  >
                    {{ task.title }}
                  </h3>
                  <div class="flex items-center space-x-3">
                    <span class="text-xs text-slate-500">{{ task.dueTime }}</span>
                    <span 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getPriorityClass(task.priority)"
                    >
                      {{ task.priority }}
                    </span>
                  </div>
                </div>
                
                <p 
                  class="text-sm mt-1 transition-all duration-200"
                  :class="task.completed ? 'text-gray-400' : 'text-slate-600'"
                >
                  {{ task.description }}
                </p>
                
                <div class="flex items-center space-x-4 mt-3">
                  <span class="text-xs text-slate-500">⏱️ {{ task.estimatedTime }}</span>
                  <button 
                    v-if="!task.completed"
                    @click="markTaskComplete(task.id)"
                    class="text-xs text-secondary-600 hover:text-secondary-700 font-medium"
                  >
                    Mark Complete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Alerts & Notifications - SECOND -->
      <div v-if="alerts.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-slate-800">Alerts & Notifications</h2>
          <span class="bg-red-100 text-red-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {{ alerts.length }}
          </span>
        </div>

        <div class="space-y-3">
          <div
            v-for="alert in alerts"
            :key="alert.id"
            class="border-l-4 p-4 rounded-lg"
            :class="{
              'border-red-500 bg-red-50': alert.priority === 'high',
              'border-yellow-500 bg-yellow-50': alert.priority === 'medium',
              'border-blue-500 bg-blue-50': alert.priority === 'low'
            }"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="font-medium text-slate-800">{{ alert.title }}</h3>
                <p class="text-sm text-slate-600 mt-1">{{ alert.message }}</p>
                <span class="text-xs text-slate-500 mt-2 block">{{ formatTimeAgo(alert.createdAt) }}</span>
              </div>
              <button 
                @click="dismissAlert(alert.id)"
                class="text-slate-400 hover:text-slate-600 ml-4"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Upcoming Tasks - THIRD -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-semibold text-slate-800 mb-4">Upcoming Tasks</h2>

        <div v-if="upcomingTasks.length === 0" class="text-center py-8">
          <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      <!-- Completed Tasks - LAST -->
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
          <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="text-gray-500">No completed tasks yet</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="task in displayedCompletedTasks"
            :key="task.id"
            class="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-100"
          >
            <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div class="flex-1">
              <div class="font-medium text-slate-800">{{ task.title }}</div>
              <div class="text-sm text-slate-600">Completed {{ formatTimeAgo(task.completedAt) }}</div>
            </div>
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
        description: 'Take antibiotic as prescribed by Dr. Smith',
        completed: false,
        priority: 'high',
        estimatedTime: '1 min',
        dueTime: '7:00 PM'
      },
      {
        id: 4,
        title: 'Mouthwash Rinse',
        description: 'Use antibacterial mouthwash for 30 seconds',
        completed: false,
        priority: 'medium',
        estimatedTime: '1 min',
        dueTime: '9:15 PM'
      }
    ])

    const upcomingTasks = ref([
      {
        id: 5,
        title: 'Weekly Oral Photo',
        description: 'Take progress photo of your teeth for Dr. Smith',
        priority: 'high',
        dueDate: new Date('2024-07-10T10:00:00')
      },
      {
        id: 6,
        title: 'Dental Cleaning Appointment',
        description: 'Regular cleaning and checkup with Dr. Smith',
        priority: 'high',
        dueDate: new Date('2024-07-15T14:00:00')
      }
    ])

    const completedTasks = ref([
      {
        id: 7,
        title: 'Morning Brushing',
        completedAt: new Date('2024-07-08T08:15:00')
      },
      {
        id: 8,
        title: 'Evening Flossing',
        completedAt: new Date('2024-07-07T21:30:00')
      },
      {
        id: 9,
        title: 'Medication Dose',
        completedAt: new Date('2024-07-07T19:00:00')
      },
      {
        id: 10,
        title: 'Mouthwash Rinse',
        completedAt: new Date('2024-07-07T21:45:00')
      }
    ])

    // Computed
    const todayProgress = computed(() => {
      if (todayTasks.value.length === 0) return 100
      const completed = todayTasks.value.filter(task => task.completed).length
      return Math.round((completed / todayTasks.value.length) * 100)
    })

    const displayedCompletedTasks = computed(() => {
      return showAllCompleted.value ? completedTasks.value : completedTasks.value.slice(0, 3)
    })

    // Methods
    const toggleTask = (taskId) => {
      const task = todayTasks.value.find(t => t.id === taskId)
      if (task) {
        task.completed = !task.completed
        if (task.completed) {
          // Move to completed tasks
          completedTasks.value.unshift({
            id: task.id,
            title: task.title,
            completedAt: new Date()
          })
        }
      }
    }

    const markTaskComplete = (taskId) => {
      toggleTask(taskId)
    }

    const dismissAlert = (alertId) => {
      const index = alerts.value.findIndex(alert => alert.id === alertId)
      if (index > -1) {
        alerts.value.splice(index, 1)
      }
    }

    const getPriorityClass = (priority) => {
      switch (priority) {
        case 'high':
          return 'bg-red-100 text-red-700'
        case 'medium':
          return 'bg-yellow-100 text-yellow-700'
        case 'low':
          return 'bg-green-100 text-green-700'
        default:
          return 'bg-gray-100 text-gray-700'
      }
    }

    const formatDate = (date) => {
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      }).format(date)
    }

    const formatTimeAgo = (date) => {
      const now = new Date()
      const diffMs = now - date
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMins / 60)
      const diffDays = Math.floor(diffHours / 24)

      if (diffMins < 60) {
        return `${diffMins} minutes ago`
      } else if (diffHours < 24) {
        return `${diffHours} hours ago`
      } else {
        return `${diffDays} days ago`
      }
    }

    const openChat = () => {
      router.push('/patient/chat')
    }

    return {
      showAllCompleted,
      alerts,
      todayTasks,
      upcomingTasks,
      completedTasks,
      todayProgress,
      displayedCompletedTasks,
      toggleTask,
      markTaskComplete,
      dismissAlert,
      getPriorityClass,
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
  border-color: #00A86B;
}
</style>
const ComplianceReportsTemplate = `
<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div class="px-4 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl font-semibold text-slate-800">Compliance Reports</h1>
            <p class="text-sm text-slate-600">Monitor patient task completion and care plan adherence</p>
          </div>
          <div class="flex items-center space-x-3">
            <select 
              v-model="selectedTimeframe"
              class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
            <button
              @click="exportReport"
              class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
            >
              <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Export Report
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="px-4 py-6 space-y-6">
      <!-- Compliance Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-2xl font-bold text-green-600">{{ complianceStats.high.count }}</div>
              <div class="text-sm text-slate-600">High Compliance</div>
              <div class="text-xs text-green-600 mt-1">{{ complianceStats.high.percentage }}%</div>
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
              <div class="text-2xl font-bold text-yellow-600">{{ complianceStats.moderate.count }}</div>
              <div class="text-sm text-slate-600">Moderate Compliance</div>
              <div class="text-xs text-yellow-600 mt-1">{{ complianceStats.moderate.percentage }}%</div>
            </div>
            <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-2xl font-bold text-red-600">{{ complianceStats.low.count }}</div>
              <div class="text-sm text-slate-600">Low Compliance</div>
              <div class="text-xs text-red-600 mt-1">{{ complianceStats.low.percentage }}%</div>
            </div>
            <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-2xl font-bold text-slate-800">{{ complianceStats.overall }}%</div>
              <div class="text-sm text-slate-600">Overall Compliance</div>
              <div class="text-xs text-slate-500 mt-1">All patients average</div>
            </div>
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
          </div>
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
              placeholder="Search patients..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div class="flex gap-2">
            <select 
              v-model="selectedCompliance"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Compliance Levels</option>
              <option value="high">High (80%+)</option>
              <option value="moderate">Moderate (50-79%)</option>
              <option value="low">Low (<50%)</option>
            </select>
            <select 
              v-model="selectedTaskType"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Task Types</option>
              <option value="medication">Medication</option>
              <option value="hygiene">Oral Hygiene</option>
              <option value="post-procedure">Post-Procedure</option>
              <option value="follow-up">Follow-up</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Patient Compliance List -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100">
        <div class="p-4 border-b border-gray-100">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-slate-800">Patient Compliance Details</h2>
            <div class="flex items-center space-x-2">
              <button
                @click="viewMode = 'list'"
                :class="viewMode === 'list' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'"
                class="px-3 py-1 rounded text-sm"
              >
                List
              </button>
              <button
                @click="viewMode = 'cards'"
                :class="viewMode === 'cards' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'"
                class="px-3 py-1 rounded text-sm"
              >
                Cards
              </button>
            </div>
          </div>
        </div>

        <div v-if="filteredPatients.length === 0" class="text-center py-12">
          <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          <p class="text-gray-500">No patients match your filters</p>
        </div>

        <!-- List View -->
        <div v-else-if="viewMode === 'list'" class="divide-y divide-gray-100">
          <div
            v-for="patient in filteredPatients"
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
                  <p class="text-sm text-slate-600">{{ patient.activeTasks }} active tasks</p>
                  <div class="flex items-center space-x-4 text-xs text-slate-500 mt-1">
                    <span>Last activity: {{ formatTimeAgo(patient.lastActivity) }}</span>
                    <span>Assigned: {{ formatDate(patient.assignedDate) }}</span>
                  </div>
                </div>
              </div>
              
              <div class="flex items-center space-x-4">
                <div class="text-right">
                  <div class="flex items-center space-x-2">
                    <div class="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        class="h-2 rounded-full transition-all duration-300"
                        :class="getComplianceBarClass(patient.complianceRate)"
                        :style="{ width: patient.complianceRate + '%' }"
                      ></div>
                    </div>
                    <span class="text-sm font-medium" :class="getComplianceTextClass(patient.complianceRate)">
                      {{ patient.complianceRate }}%
                    </span>
                  </div>
                  <div class="text-xs text-slate-500 mt-1">
                    {{ patient.completedTasks }}/{{ patient.totalTasks }} tasks completed
                  </div>
                </div>
                
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
                      @click="viewPatientTasks(patient)"
                      class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-gray-100"
                    >
                      View Task Details
                    </button>
                    <button 
                      @click="sendReminder(patient)"
                      class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-gray-100"
                    >
                      Send Reminder
                    </button>
                    <button 
                      @click="assignNewTask(patient)"
                      class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-gray-100"
                    >
                      Assign New Task
                    </button>
                    <button 
                      @click="viewPatientProfile(patient)"
                      class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-gray-100"
                    >
                      View Patient Profile
                    </button>
                    <div class="border-t border-gray-200 my-1"></div>
                    <button 
                      @click="flagForFollowUp(patient)"
                      :class="patient.flagged ? 'text-orange-600' : 'text-slate-700'"
                      class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      {{ patient.flagged ? 'Remove Flag' : 'Flag for Follow-up' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Card View -->
        <div v-else class="p-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="patient in filteredPatients"
              :key="patient.id"
              class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
            >
              <div class="flex items-center space-x-3 mb-3">
                <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span class="text-primary-600 font-semibold">{{ patient.initials }}</span>
                </div>
                <div class="flex-1">
                  <h3 class="font-medium text-slate-800">{{ patient.name }}</h3>
                  <p class="text-sm text-slate-600">{{ patient.activeTasks }} active tasks</p>
                </div>
                <span v-if="patient.flagged" class="w-3 h-3 bg-orange-400 rounded-full"></span>
              </div>
              
              <div class="space-y-3">
                <div>
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-sm text-slate-600">Compliance Rate</span>
                    <span class="text-sm font-medium" :class="getComplianceTextClass(patient.complianceRate)">
                      {{ patient.complianceRate }}%
                    </span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      class="h-2 rounded-full transition-all duration-300"
                      :class="getComplianceBarClass(patient.complianceRate)"
                      :style="{ width: patient.complianceRate + '%' }"
                    ></div>
                  </div>
                </div>
                
                <div class="text-xs text-slate-500">
                  <div>Completed: {{ patient.completedTasks }}/{{ patient.totalTasks }} tasks</div>
                  <div>Last activity: {{ formatTimeAgo(patient.lastActivity) }}</div>
                </div>
                
                <div class="flex space-x-2">
                  <button 
                    @click="viewPatientTasks(patient)"
                    class="flex-1 px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors"
                  >
                    View Tasks
                  </button>
                  <button 
                    @click="sendReminder(patient)"
                    class="flex-1 px-3 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition-colors"
                  >
                    Send Reminder
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Task Categories Analysis -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-semibold text-slate-800 mb-4">Task Category Compliance</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="category in taskCategories"
            :key="category.type"
            class="p-4 border border-gray-200 rounded-lg"
          >
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-medium text-slate-800">{{ category.name }}</h4>
              <span class="text-sm font-medium" :class="getComplianceTextClass(category.compliance)">
                {{ category.compliance }}%
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                class="h-2 rounded-full transition-all duration-300"
                :class="getComplianceBarClass(category.compliance)"
                :style="{ width: category.compliance + '%' }"
              ></div>
            </div>
            <div class="text-xs text-slate-500">
              {{ category.completed }}/{{ category.total }} tasks completed
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Task Detail Modal -->
    <div v-if="showTaskModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-slate-800">
              Task Details - {{ selectedPatient?.name }}
            </h2>
            <button @click="showTaskModal = false" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div v-if="selectedPatient" class="space-y-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-slate-600">Compliance Rate:</span>
                  <span class="font-medium ml-2" :class="getComplianceTextClass(selectedPatient.complianceRate)">
                    {{ selectedPatient.complianceRate }}%
                  </span>
                </div>
                <div>
                  <span class="text-slate-600">Active Tasks:</span>
                  <span class="font-medium ml-2">{{ selectedPatient.activeTasks }}</span>
                </div>
                <div>
                  <span class="text-slate-600">Completed:</span>
                  <span class="font-medium ml-2">{{ selectedPatient.completedTasks }}</span>
                </div>
                <div>
                  <span class="text-slate-600">Last Activity:</span>
                  <span class="font-medium ml-2">{{ formatTimeAgo(selectedPatient.lastActivity) }}</span>
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <h3 class="font-medium text-slate-800">Recent Tasks</h3>
              <div
                v-for="task in patientTasks"
                :key="task.id"
                class="border border-gray-200 rounded-lg p-3"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-medium text-slate-800">{{ task.title }}</h4>
                    <p class="text-sm text-slate-600">{{ task.description }}</p>
                    <div class="text-xs text-slate-500 mt-1">
                      Due: {{ formatDate(task.dueDate) }} • Type: {{ task.type }}
                    </div>
                  </div>
                  <span 
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    :class="getTaskStatusClass(task.status)"
                  >
                    {{ task.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'ComplianceReports',
  setup() {
    const router = useRouter()
    
    // Reactive data
    const selectedTimeframe = ref('30')
    const searchQuery = ref('')
    const selectedCompliance = ref('')
    const selectedTaskType = ref('')
    const viewMode = ref('list')
    const activePatientMenu = ref(null)
    const showTaskModal = ref(false)
    const selectedPatient = ref(null)

    // Sample data - replace with API calls
    const patients = ref([
      {
        id: 1,
        name: 'John Smith',
        initials: 'JS',
        complianceRate: 92,
        activeTasks: 3,
        completedTasks: 12,
        totalTasks: 13,
        lastActivity: new Date(Date.now() - 86400000),
        assignedDate: new Date('2024-06-01'),
        flagged: false
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        initials: 'SJ',
        complianceRate: 68,
        activeTasks: 2,
        completedTasks: 8,
        totalTasks: 12,
        lastActivity: new Date(Date.now() - 172800000),
        assignedDate: new Date('2024-06-05'),
        flagged: true
      },
      {
        id: 3,
        name: 'Mike Wilson',
        initials: 'MW',
        complianceRate: 34,
        activeTasks: 5,
        completedTasks: 3,
        totalTasks: 9,
        lastActivity: new Date(Date.now() - 604800000),
        assignedDate: new Date('2024-06-10'),
        flagged: true
      },
      {
        id: 4,
        name: 'Emily Davis',
        initials: 'ED',
        complianceRate: 89,
        activeTasks: 1,
        completedTasks: 15,
        totalTasks: 17,
        lastActivity: new Date(Date.now() - 43200000),
        assignedDate: new Date('2024-05-28'),
        flagged: false
      }
    ])

    const patientTasks = ref([
      {
        id: 1,
        title: 'Morning Medication',
        description: 'Take prescribed antibiotics with breakfast',
        type: 'medication',
        status: 'completed',
        dueDate: new Date()
      },
      {
        id: 2,
        title: 'Post-Surgery Care',
        description: 'Apply ice pack for 20 minutes, 3 times daily',
        type: 'post-procedure',
        status: 'pending',
        dueDate: new Date(Date.now() + 86400000)
      },
      {
        id: 3,
        title: 'Daily Brushing',
        description: 'Brush teeth twice daily with fluoride toothpaste',
        type: 'hygiene',
        status: 'completed',
        dueDate: new Date()
      }
    ])

    const taskCategories = ref([
      {
        type: 'medication',
        name: 'Medication',
        compliance: 78,
        completed: 156,
        total: 200
      },
      {
        type: 'hygiene',
        name: 'Oral Hygiene',
        compliance: 85,
        completed: 340,
        total: 400
      },
      {
        type: 'post-procedure',
        name: 'Post-Procedure',
        compliance: 71,
        completed: 89,
        total: 125
      },
      {
        type: 'follow-up',
        name: 'Follow-up',
        compliance: 93,
        completed: 65,
        total: 70
      }
    ])

    // Computed properties
    const complianceStats = computed(() => {
      const total = patients.value.length
      const high = patients.value.filter(p => p.complianceRate >= 80).length
      const moderate = patients.value.filter(p => p.complianceRate >= 50 && p.complianceRate < 80).length
      const low = patients.value.filter(p => p.complianceRate < 50).length
      const overall = Math.round(patients.value.reduce((sum, p) => sum + p.complianceRate, 0) / total)

      return {
        high: { count: high, percentage: Math.round((high / total) * 100) },
        moderate: { count: moderate, percentage: Math.round((moderate / total) * 100) },
        low: { count: low, percentage: Math.round((low / total) * 100) },
        overall
      }
    })

    const filteredPatients = computed(() => {
      let filtered = patients.value

      // Filter by search query
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(p => p.name.toLowerCase().includes(query))
      }

      // Filter by compliance level
      if (selectedCompliance.value) {
        filtered = filtered.filter(p => {
          if (selectedCompliance.value === 'high') return p.complianceRate >= 80
          if (selectedCompliance.value === 'moderate') return p.complianceRate >= 50 && p.complianceRate < 80
          if (selectedCompliance.value === 'low') return p.complianceRate < 50
          return true
        })
      }

      // Sort by compliance rate (lowest first for attention)
      return filtered.sort((a, b) => a.complianceRate - b.complianceRate)
    })

    // Methods
    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }

    const formatTimeAgo = (date) => {
      const now = new Date()
      const diffTime = Math.abs(now - date)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) return '1 day ago'
      if (diffDays < 7) return `${diffDays} days ago`
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
      return `${Math.floor(diffDays / 30)} months ago`
    }

    const getComplianceBarClass = (rate) => {
      if (rate >= 80) return 'bg-green-500'
      if (rate >= 50) return 'bg-yellow-500'
      return 'bg-red-500'
    }

    const getComplianceTextClass = (rate) => {
      if (rate >= 80) return 'text-green-600'
      if (rate >= 50) return 'text-yellow-600'
      return 'text-red-600'
    }

    const getTaskStatusClass = (status) => {
      const classes = {
        'completed': 'bg-green-100 text-green-800',
        'pending': 'bg-yellow-100 text-yellow-800',
        'overdue': 'bg-red-100 text-red-800',
        'skipped': 'bg-gray-100 text-gray-800'
      }
      return classes[status] || classes.pending
    }

    const togglePatientMenu = (patientId) => {
      activePatientMenu.value = activePatientMenu.value === patientId ? null : patientId
    }

    const viewPatientTasks = (patient) => {
      selectedPatient.value = patient
      showTaskModal.value = true
      activePatientMenu.value = null
    }

    const sendReminder = (patient) => {
      console.log('Sending reminder to:', patient.name)
      activePatientMenu.value = null
      // TODO: Implement reminder functionality
    }

    const assignNewTask = (patient) => {
      console.log('Assigning new task to:', patient.name)
      activePatientMenu.value = null
      router.push('/doctor-secretary/task-templates')
    }

    const viewPatientProfile = (patient) => {
      activePatientMenu.value = null
      router.push(`/doctor-secretary/patients/${patient.id}`)
    }

    const flagForFollowUp = (patient) => {
      patient.flagged = !patient.flagged
      console.log('Toggled flag for:', patient.name, patient.flagged)
      activePatientMenu.value = null
    }

    const exportReport = () => {
      console.log('Exporting compliance report for timeframe:', selectedTimeframe.value)
      // TODO: Implement export functionality
    }

    // Lifecycle
    onMounted(() => {
      console.log('ComplianceReports component mounted')
    })

    return {
      // Reactive data
      selectedTimeframe,
      searchQuery,
      selectedCompliance,
      selectedTaskType,
      viewMode,
      activePatientMenu,
      showTaskModal,
      selectedPatient,
      patients,
      patientTasks,
      taskCategories,
      
      // Computed
      complianceStats,
      filteredPatients,
      
      // Methods
      formatDate,
      formatTimeAgo,
      getComplianceBarClass,
      getComplianceTextClass,
      getTaskStatusClass,
      togglePatientMenu,
      viewPatientTasks,
      sendReminder,
      assignNewTask,
      viewPatientProfile,
      flagForFollowUp,
      exportReport
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

/* Progress bar animations */
.transition-all {
  transition: all 0.3s ease;
}

/* Card hover effects */
.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>`;
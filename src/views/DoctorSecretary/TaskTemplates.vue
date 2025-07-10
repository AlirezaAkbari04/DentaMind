const TaskTemplatesTemplate = `
<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div class="px-4 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl font-semibold text-slate-800">Task Templates</h1>
            <p class="text-sm text-slate-600">Create and manage care task templates</p>
          </div>
          <button 
            @click="showCreateModal = true"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span>New Template</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="px-4 py-6 space-y-6">
      <!-- Stats Cards -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="text-2xl font-bold text-slate-800">{{ totalTemplates }}</div>
          <div class="text-sm text-slate-600">Total Templates</div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="text-2xl font-bold text-secondary-600">{{ activeTemplates }}</div>
          <div class="text-sm text-slate-600">Active Templates</div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div class="flex flex-wrap gap-2 mb-4">
          <button 
            v-for="filter in filters"
            :key="filter.key"
            @click="activeFilter = filter.key"
            class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            :class="activeFilter === filter.key 
              ? 'bg-primary-100 text-primary-700' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          >
            {{ filter.label }}
            <span v-if="filter.count" class="ml-1 text-xs opacity-75">({{ filter.count }})</span>
          </button>
        </div>
        
        <!-- Search -->
        <div class="relative">
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search templates..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <!-- Templates List -->
      <div class="space-y-4">
        <div v-if="filteredTemplates.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          <p class="text-gray-500 mb-2">No templates found</p>
          <p class="text-sm text-gray-400">Create your first task template to get started</p>
        </div>

        <div 
          v-for="template in filteredTemplates" 
          :key="template.id"
          class="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-2">
                <h3 class="font-semibold text-slate-800">{{ template.title }}</h3>
                <span 
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="getCategoryClass(template.category)"
                >
                  {{ template.category }}
                </span>
                <span 
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="getPriorityClass(template.priority)"
                >
                  {{ template.priority }}
                </span>
              </div>
              
              <p class="text-sm text-slate-600 mb-3">{{ template.description }}</p>
              
              <div class="flex items-center space-x-4 text-xs text-slate-500">
                <span class="flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {{ template.estimatedDuration }}
                </span>
                <span class="flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-1 12a2 2 0 002 2h6a2 2 0 002-2L13 7"></path>
                  </svg>
                  Used {{ template.usageCount }} times
                </span>
                <span>Updated {{ formatTimeAgo(template.updatedAt) }}</span>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="relative">
              <button 
                @click="toggleMenu(template.id)"
                class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                </svg>
              </button>
              
              <!-- Dropdown Menu -->
              <div 
                v-if="activeMenuId === template.id"
                class="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10"
              >
                <button 
                  @click="editTemplate(template)"
                  class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-gray-100 flex items-center"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Edit Template
                </button>
                <button 
                  @click="duplicateTemplate(template)"
                  class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-gray-100 flex items-center"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                  Duplicate
                </button>
                <button 
                  @click="assignTemplate(template)"
                  class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-gray-100 flex items-center"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                  </svg>
                  Assign to Patient
                </button>
                <div class="border-t border-gray-200 my-1"></div>
                <button 
                  @click="confirmDelete(template)"
                  class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Delete Template
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Create/Edit Template Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-slate-800">
              {{ showCreateModal ? 'Create New Template' : 'Edit Template' }}
            </h2>
            <button 
              @click="closeModal"
              class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="saveTemplate" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Template Title *</label>
              <input 
                v-model="templateForm.title"
                type="text"
                required
                placeholder="e.g., Post-Extraction Care"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Category *</label>
              <select 
                v-model="templateForm.category"
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select Category</option>
                <option value="Post-Procedure">Post-Procedure</option>
                <option value="Hygiene">Hygiene</option>
                <option value="Prevention">Prevention</option>
                <option value="Orthodontic">Orthodontic</option>
                <option value="Emergency">Emergency</option>
                <option value="Follow-up">Follow-up</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Priority *</label>
              <select 
                v-model="templateForm.priority"
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Estimated Duration *</label>
              <select 
                v-model="templateForm.estimatedDuration"
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select Duration</option>
                <option value="5 minutes">5 minutes</option>
                <option value="10 minutes">10 minutes</option>
                <option value="15 minutes">15 minutes</option>
                <option value="30 minutes">30 minutes</option>
                <option value="1 hour">1 hour</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Description *</label>
              <textarea 
                v-model="templateForm.description"
                required
                rows="3"
                placeholder="Brief description of the task..."
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Detailed Instructions</label>
              <textarea 
                v-model="templateForm.instructions"
                rows="4"
                placeholder="Step-by-step instructions for the patient..."
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              ></textarea>
            </div>

            <div class="flex items-center">
              <input 
                v-model="templateForm.isActive"
                type="checkbox"
                id="isActive"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="isActive" class="ml-2 text-sm text-slate-700">
                Active template (available for assignment)
              </label>
            </div>

            <div class="flex space-x-3 pt-4">
              <button 
                type="button"
                @click="closeModal"
                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                class="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                {{ showCreateModal ? 'Create Template' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl max-w-sm w-full p-6">
        <div class="text-center">
          <svg class="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <h3 class="text-lg font-semibold text-slate-800 mb-2">Delete Template</h3>
          <p class="text-sm text-slate-600 mb-6">
            Are you sure you want to delete "{{ templateToDelete?.title }}"? This action cannot be undone.
          </p>
          
          <div class="flex space-x-3">
            <button 
              @click="showDeleteModal = false"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              @click="deleteTemplate"
              class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Patient Assignment Modal -->
    <div v-if="showAssignModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-slate-800">Assign Template to Patient</h2>
            <button 
              @click="showAssignModal = false"
              class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="mb-4 p-3 bg-gray-50 rounded-lg">
            <h3 class="font-medium text-slate-800">{{ templateToAssign?.title }}</h3>
            <p class="text-sm text-slate-600">{{ templateToAssign?.description }}</p>
          </div>

          <form @submit.prevent="assignToPatient" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Select Patient *</label>
              <select 
                v-model="assignForm.patientId"
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Choose a patient</option>
                <option v-for="patient in patients" :key="patient.id" :value="patient.id">
                  {{ patient.name }} - {{ patient.email }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Due Date</label>
              <input 
                v-model="assignForm.dueDate"
                type="date"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Additional Notes</label>
              <textarea 
                v-model="assignForm.notes"
                rows="3"
                placeholder="Any specific instructions for this patient..."
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              ></textarea>
            </div>

            <div class="flex space-x-3 pt-4">
              <button 
                type="button"
                @click="showAssignModal = false"
                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                class="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Assign Task
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
  name: 'TaskTemplates',
  setup() {
    const router = useRouter()
    
    // Reactive data
    const activeFilter = ref('all')
    const searchQuery = ref('')
    const activeMenuId = ref(null)
    const showCreateModal = ref(false)
    const showEditModal = ref(false)
    const showDeleteModal = ref(false)
    const showAssignModal = ref(false)
    const templateToDelete = ref(null)
    const templateToAssign = ref(null)
    const editingTemplate = ref(null)

    // Form data
    const templateForm = ref({
      title: '',
      category: '',
      priority: '',
      estimatedDuration: '',
      description: '',
      instructions: '',
      isActive: true
    })

    const assignForm = ref({
      patientId: '',
      dueDate: '',
      notes: ''
    })

    // Sample data - replace with API calls
    const templates = ref([
      {
        id: 1,
        title: 'Post-Extraction Care',
        description: 'Essential care instructions following tooth extraction',
        category: 'Post-Procedure',
        priority: 'High',
        estimatedDuration: '15 minutes',
        instructions: 'Apply ice for 20 minutes, avoid spitting, take prescribed medication',
        isActive: true,
        usageCount: 45,
        updatedAt: new Date('2024-06-15'),
        createdBy: 'Dr. Johnson'
      },
      {
        id: 2,
        title: 'Daily Brushing Routine',
        description: 'Comprehensive daily oral hygiene routine',
        category: 'Hygiene',
        priority: 'Medium',
        estimatedDuration: '5 minutes',
        instructions: 'Brush for 2 minutes, use fluoride toothpaste, clean tongue',
        isActive: true,
        usageCount: 128,
        updatedAt: new Date('2024-06-10'),
        createdBy: 'Dr. Smith'
      },
      {
        id: 3,
        title: 'Orthodontic Check',
        description: 'Weekly orthodontic appliance inspection',
        category: 'Orthodontic',
        priority: 'Medium',
        estimatedDuration: '10 minutes',
        instructions: 'Check for loose brackets, clean around wires, report issues',
        isActive: true,
        usageCount: 32,
        updatedAt: new Date('2024-06-08'),
        createdBy: 'Dr. Brown'
      },
      {
        id: 4,
        title: 'Emergency Pain Management',
        description: 'Immediate steps for dental pain relief',
        category: 'Emergency',
        priority: 'High',
        estimatedDuration: '30 minutes',
        instructions: 'Take prescribed pain medication, apply cold compress, contact clinic',
        isActive: true,
        usageCount: 18,
        updatedAt: new Date('2024-06-05'),
        createdBy: 'Dr. Johnson'
      }
    ])

    const patients = ref([
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      { id: 3, name: 'Mike Wilson', email: 'mike@example.com' }
    ])

    // Computed properties
    const totalTemplates = computed(() => templates.value.length)
    const activeTemplates = computed(() => templates.value.filter(t => t.isActive).length)
    
    const filters = computed(() => [
      { key: 'all', label: 'All Templates', count: templates.value.length },
      { key: 'active', label: 'Active', count: activeTemplates.value },
      { key: 'post-procedure', label: 'Post-Procedure', count: templates.value.filter(t => t.category === 'Post-Procedure').length },
      { key: 'hygiene', label: 'Hygiene', count: templates.value.filter(t => t.category === 'Hygiene').length },
      { key: 'orthodontic', label: 'Orthodontic', count: templates.value.filter(t => t.category === 'Orthodontic').length },
      { key: 'emergency', label: 'Emergency', count: templates.value.filter(t => t.category === 'Emergency').length }
    ])

    const filteredTemplates = computed(() => {
      let filtered = templates.value

      // Apply category filter
      if (activeFilter.value !== 'all') {
        if (activeFilter.value === 'active') {
          filtered = filtered.filter(t => t.isActive)
        } else {
          const category = activeFilter.value.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join('-')
          filtered = filtered.filter(t => t.category === category)
        }
      }

      // Apply search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(t => 
          t.title.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query)
        )
      }

      return filtered
    })

    // Methods
    const toggleMenu = (templateId) => {
      activeMenuId.value = activeMenuId.value === templateId ? null : templateId
    }

    const getCategoryClass = (category) => {
      const classes = {
        'Post-Procedure': 'bg-red-100 text-red-700',
        'Hygiene': 'bg-blue-100 text-blue-700',
        'Prevention': 'bg-green-100 text-green-700',
        'Orthodontic': 'bg-purple-100 text-purple-700',
        'Emergency': 'bg-orange-100 text-orange-700',
        'Follow-up': 'bg-gray-100 text-gray-700'
      }
      return classes[category] || 'bg-gray-100 text-gray-700'
    }

    const getPriorityClass = (priority) => {
      const classes = {
        'High': 'bg-red-100 text-red-700',
        'Medium': 'bg-yellow-100 text-yellow-700',
        'Low': 'bg-green-100 text-green-700'
      }
      return classes[priority] || 'bg-gray-100 text-gray-700'
    }

    const formatTimeAgo = (date) => {
      const now = new Date()
      const diffTime = Math.abs(now - date)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) return '1 day ago'
      if (diffDays < 7) return diffDays + ' days ago'
      if (diffDays < 30) return Math.floor(diffDays / 7) + ' weeks ago'
      return Math.floor(diffDays / 30) + ' months ago'
    }

    const resetForm = () => {
      templateForm.value = {
        title: '',
        category: '',
        priority: '',
        estimatedDuration: '',
        description: '',
        instructions: '',
        isActive: true
      }
    }

    const closeModal = () => {
      showCreateModal.value = false
      showEditModal.value = false
      editingTemplate.value = null
      resetForm()
    }

    const editTemplate = (template) => {
      editingTemplate.value = template
      templateForm.value = {
        title: template.title,
        category: template.category,
        priority: template.priority,
        estimatedDuration: template.estimatedDuration,
        description: template.description,
        instructions: template.instructions,
        isActive: template.isActive
      }
      showEditModal.value = true
      activeMenuId.value = null
    }

    const saveTemplate = () => {
      if (showCreateModal.value) {
        // Create new template
        const newTemplate = {
          id: Date.now(),
          ...templateForm.value,
          usageCount: 0,
          updatedAt: new Date(),
          createdBy: 'Current Doctor'
        }
        templates.value.push(newTemplate)
        console.log('Created template:', newTemplate)
      } else {
        // Update existing template
        const index = templates.value.findIndex(t => t.id === editingTemplate.value.id)
        if (index !== -1) {
          templates.value[index] = {
            ...templates.value[index],
            ...templateForm.value,
            updatedAt: new Date()
          }
          console.log('Updated template:', templates.value[index])
        }
      }
      closeModal()
    }

    const duplicateTemplate = (template) => {
      const duplicated = {
        ...template,
        id: Date.now(),
        title: template.title + ' (Copy)',
        usageCount: 0,
        updatedAt: new Date(),
        createdBy: 'Current Doctor'
      }
      templates.value.push(duplicated)
      console.log('Duplicated template:', duplicated)
      activeMenuId.value = null
    }

    const confirmDelete = (template) => {
      templateToDelete.value = template
      showDeleteModal.value = true
      activeMenuId.value = null
    }

    const deleteTemplate = () => {
      const index = templates.value.findIndex(t => t.id === templateToDelete.value.id)
      if (index !== -1) {
        templates.value.splice(index, 1)
        console.log('Deleted template:', templateToDelete.value.title)
      }
      showDeleteModal.value = false
      templateToDelete.value = null
    }

    const assignTemplate = (template) => {
      templateToAssign.value = template
      assignForm.value = {
        patientId: '',
        dueDate: '',
        notes: ''
      }
      showAssignModal.value = true
      activeMenuId.value = null
    }

    const assignToPatient = () => {
      const assignment = {
        templateId: templateToAssign.value.id,
        patientId: assignForm.value.patientId,
        dueDate: assignForm.value.dueDate,
        notes: assignForm.value.notes,
        assignedAt: new Date()
      }
      console.log('Assigned template to patient:', assignment)
      
      // Update usage count
      const template = templates.value.find(t => t.id === templateToAssign.value.id)
      if (template) {
        template.usageCount++
      }
      
      showAssignModal.value = false
      templateToAssign.value = null
    }

    // Lifecycle
    onMounted(() => {
      // Load templates from API
      console.log('TaskTemplates component mounted')
    })

    return {
      // Reactive data
      activeFilter,
      searchQuery,
      activeMenuId,
      showCreateModal,
      showEditModal,
      showDeleteModal,
      showAssignModal,
      templateToDelete,
      templateToAssign,
      templateForm,
      assignForm,
      templates,
      patients,
      
      // Computed
      totalTemplates,
      activeTemplates,
      filters,
      filteredTemplates,
      
      // Methods
      toggleMenu,
      getCategoryClass,
      getPriorityClass,
      formatTimeAgo,
      closeModal,
      editTemplate,
      saveTemplate,
      duplicateTemplate,
      confirmDelete,
      deleteTemplate,
      assignTemplate,
      assignToPatient
    }
  }
}
</script>
`;
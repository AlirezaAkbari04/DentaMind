<!--
  Task Template Management Component
  
  Comprehensive task template management with:
  - Template creation and editing
  - Patient search and assignment
  - Template categorization
  - Bulk operations
  - Template preview and testing
-->
<template>
  <div class="p-4 space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Task Template Management</h1>
          <p class="text-slate-600">Create, edit, and assign task templates to patients</p>
        </div>
        <div class="flex items-center space-x-3">
          <button 
            @click="toggleView"
            class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {{ viewMode === 'grid' ? 'List View' : 'Grid View' }}
          </button>
          <button 
            @click="createNewTemplate"
            class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            New Template
          </button>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <!-- Search -->
        <div class="relative flex-1 max-w-md">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search templates..."
            class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
          <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <!-- Filters -->
        <div class="flex items-center space-x-3">
          <select
            v-model="selectedCategory"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Categories</option>
            <option value="daily-care">Daily Care</option>
            <option value="pre-appointment">Pre-Appointment</option>
            <option value="post-treatment">Post-Treatment</option>
            <option value="emergency">Emergency</option>
            <option value="maintenance">Maintenance</option>
          </select>

          <select
            v-model="selectedStatus"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Templates List/Grid -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-slate-800">
          Templates ({{ filteredTemplates.length }})
        </h2>
        <div class="flex items-center space-x-2">
          <button 
            @click="selectAll"
            class="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            {{ selectedTemplates.length === filteredTemplates.length ? 'Deselect All' : 'Select All' }}
          </button>
          <button 
            v-if="selectedTemplates.length > 0"
            @click="showBulkActions = true"
            class="bg-secondary-600 hover:bg-secondary-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
          >
            Actions ({{ selectedTemplates.length }})
          </button>
        </div>
      </div>

      <!-- Grid View -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="template in filteredTemplates"
          :key="template.id"
          class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
          :class="{ 'ring-2 ring-primary-500': selectedTemplates.includes(template.id) }"
          @click="selectTemplate(template)"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center space-x-2">
              <input
                v-model="selectedTemplates"
                :value="template.id"
                type="checkbox"
                class="text-primary-600 focus:ring-primary-500"
                @click.stop
              >
              <span 
                class="text-xs px-2 py-1 rounded-full font-medium"
                :class="getCategoryClasses(template.category)"
              >
                {{ template.category }}
              </span>
            </div>
            <div class="flex items-center space-x-1">
              <button 
                @click.stop="editTemplate(template)"
                class="p-1 text-gray-400 hover:text-primary-600 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button 
                @click.stop="assignTemplate(template)"
                class="p-1 text-gray-400 hover:text-secondary-600 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </button>
            </div>
          </div>
          
          <h3 class="font-semibold text-slate-800 mb-2">{{ template.title }}</h3>
          <p class="text-sm text-slate-600 mb-3 line-clamp-2">{{ template.description }}</p>
          
          <div class="flex items-center justify-between text-xs text-slate-500">
            <span>{{ template.duration }}</span>
            <span 
              class="px-2 py-1 rounded-full font-medium"
              :class="getStatusClasses(template.status)"
            >
              {{ template.status }}
            </span>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-else class="space-y-2">
        <div
          v-for="template in filteredTemplates"
          :key="template.id"
          class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          :class="{ 'ring-2 ring-primary-500': selectedTemplates.includes(template.id) }"
        >
          <div class="flex items-center space-x-4">
            <input
              v-model="selectedTemplates"
              :value="template.id"
              type="checkbox"
              class="text-primary-600 focus:ring-primary-500"
            >
            <div class="flex-1">
              <div class="flex items-center space-x-3">
                <h3 class="font-semibold text-slate-800">{{ template.title }}</h3>
                <span 
                  class="text-xs px-2 py-1 rounded-full font-medium"
                  :class="getCategoryClasses(template.category)"
                >
                  {{ template.category }}
                </span>
                <span 
                  class="text-xs px-2 py-1 rounded-full font-medium"
                  :class="getStatusClasses(template.status)"
                >
                  {{ template.status }}
                </span>
              </div>
              <p class="text-sm text-slate-600 mt-1">{{ template.description }}</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-2">
            <span class="text-sm text-slate-500">{{ template.duration }}</span>
            <button 
              @click="editTemplate(template)"
              class="p-2 text-gray-400 hover:text-primary-600 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button 
              @click="assignTemplate(template)"
              class="p-2 text-gray-400 hover:text-secondary-600 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Template Editor Modal -->
    <div v-if="showEditor" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-slate-800">
              {{ editingTemplate.id ? 'Edit Template' : 'Create New Template' }}
            </h3>
            <button @click="closeEditor" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="space-y-4">
            <!-- Template Title -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Template Title</label>
              <input
                v-model="editingTemplate.title"
                type="text"
                placeholder="e.g., Post-Surgery Care Instructions"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
            </div>

            <!-- Category and Status -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <select
                  v-model="editingTemplate.category"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="daily-care">Daily Care</option>
                  <option value="pre-appointment">Pre-Appointment</option>
                  <option value="post-treatment">Post-Treatment</option>
                  <option value="emergency">Emergency</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <select
                  v-model="editingTemplate.status"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Description</label>
              <textarea
                v-model="editingTemplate.description"
                rows="3"
                placeholder="Brief description of the template..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              ></textarea>
            </div>

            <!-- Duration and Frequency -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Duration</label>
                <input
                  v-model="editingTemplate.duration"
                  type="text"
                  placeholder="e.g., 5 minutes, 1 hour"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Frequency</label>
                <select
                  v-model="editingTemplate.frequency"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="once">Once</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            <!-- Instructions -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Instructions</label>
              <textarea
                v-model="editingTemplate.instructions"
                rows="5"
                placeholder="Detailed instructions for the patient..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              ></textarea>
            </div>

            <!-- Reminders -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Reminders</label>
              <div class="space-y-2">
                <div
                  v-for="(reminder, index) in editingTemplate.reminders"
                  :key="index"
                  class="flex items-center space-x-3"
                >
                  <input
                    v-model="reminder.text"
                    type="text"
                    placeholder="Reminder text..."
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                  <select
                    v-model="reminder.timing"
                    class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="before">Before</option>
                    <option value="after">After</option>
                    <option value="during">During</option>
                  </select>
                  <button
                    @click="removeReminder(index)"
                    class="p-2 text-red-500 hover:text-red-700"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <button
                @click="addReminder"
                class="w-full mt-2 p-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-slate-600 hover:border-primary-300 hover:text-primary-600 transition-colors"
              >
                + Add Reminder
              </button>
            </div>

            <!-- Actions -->
            <div class="flex justify-end space-x-3 pt-4">
              <button
                @click="closeEditor"
                class="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                @click="saveTemplate"
                class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {{ editingTemplate.id ? 'Update' : 'Create' }} Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Patient Assignment Modal -->
    <div v-if="showAssignmentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-slate-800">Assign Template to Patient</h3>
            <button @click="closeAssignmentModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="space-y-4">
            <!-- Template Info -->
            <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 class="font-medium text-slate-800">{{ assigningTemplate?.title }}</h4>
              <p class="text-sm text-slate-600">{{ assigningTemplate?.description }}</p>
            </div>

            <!-- Patient Search -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Search Patient</label>
              <div class="relative">
                <input
                  v-model="patientSearchQuery"
                  type="text"
                  placeholder="Search by name, ID, or phone..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  @input="searchPatientsForAssignment"
                >
                <svg class="absolute right-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <!-- Patient Results -->
            <div v-if="patientSearchResults.length > 0" class="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
              <div
                v-for="patient in patientSearchResults"
                :key="patient.id"
                class="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                @click="selectPatientForAssignment(patient)"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span class="text-sm font-medium text-slate-600">{{ patient.name.split(' ').map(n => n[0]).join('') }}</span>
                  </div>
                  <div>
                    <p class="font-medium text-slate-800">{{ patient.name }}</p>
                    <p class="text-sm text-slate-600">ID: {{ patient.id }} • {{ patient.phone }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Selected Patient -->
            <div v-if="selectedPatientForAssignment" class="p-4 bg-green-50 rounded-lg border border-green-200">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span class="text-sm font-medium text-green-600">{{ selectedPatientForAssignment.name.split(' ').map(n => n[0]).join('') }}</span>
                </div>
                <div>
                  <p class="font-medium text-slate-800">{{ selectedPatientForAssignment.name }}</p>
                  <p class="text-sm text-slate-600">{{ selectedPatientForAssignment.age }} years old</p>
                </div>
              </div>
            </div>

            <!-- Assignment Date -->
            <div v-if="selectedPatientForAssignment">
              <label class="block text-sm font-medium text-slate-700 mb-2">Assignment Date</label>
              <input
                v-model="assignmentDate"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
            </div>

            <!-- Actions -->
            <div class="flex justify-end space-x-3 pt-4">
              <button
                @click="closeAssignmentModal"
                class="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                @click="confirmAssignment"
                :disabled="!selectedPatientForAssignment"
                class="bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Assign Template
              </button>
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
  name: 'TaskTemplateManagement',
  emits: ['show-toast', 'show-error', 'show-success'],
  setup(props, { emit }) {
    const router = useRouter()
    
    // ==========================================
    // REACTIVE STATE
    // ==========================================
    
    const viewMode = ref('grid')
    const searchQuery = ref('')
    const selectedCategory = ref('')
    const selectedStatus = ref('')
    const selectedTemplates = ref([])
    const showBulkActions = ref(false)
    const showEditor = ref(false)
    const showAssignmentModal = ref(false)
    const assigningTemplate = ref(null)
    const patientSearchQuery = ref('')
    const patientSearchResults = ref([])
    const selectedPatientForAssignment = ref(null)
    const assignmentDate = ref('')
    
    // Template editing state
    const editingTemplate = ref({
      id: null,
      title: '',
      description: '',
      category: 'daily-care',
      status: 'active',
      duration: '',
      frequency: 'once',
      instructions: '',
      reminders: []
    })
    
    // Mock templates data
    const templates = ref([
      {
        id: 1,
        title: 'Post-Surgery Care Instructions',
        description: 'Comprehensive care instructions for patients after dental surgery',
        category: 'post-treatment',
        status: 'active',
        duration: '10 minutes',
        frequency: 'daily',
        instructions: 'Follow these steps for optimal recovery...',
        reminders: [
          { text: 'Take prescribed medication', timing: 'before' },
          { text: 'Apply ice pack for 15 minutes', timing: 'after' }
        ]
      },
      {
        id: 2,
        title: 'Daily Brushing Routine',
        description: 'Step-by-step guide for proper daily dental hygiene',
        category: 'daily-care',
        status: 'active',
        duration: '5 minutes',
        frequency: 'daily',
        instructions: 'Brush teeth twice daily with fluoride toothpaste...',
        reminders: [
          { text: 'Brush for 2 minutes', timing: 'during' },
          { text: 'Floss between teeth', timing: 'after' }
        ]
      },
      {
        id: 3,
        title: 'Pre-Appointment Preparation',
        description: 'What patients need to know before their dental appointment',
        category: 'pre-appointment',
        status: 'active',
        duration: '3 minutes',
        frequency: 'once',
        instructions: 'Prepare for your upcoming appointment by...',
        reminders: [
          { text: 'Bring insurance card', timing: 'before' },
          { text: 'Arrive 15 minutes early', timing: 'before' }
        ]
      },
      {
        id: 4,
        title: 'Emergency Pain Management',
        description: 'Immediate steps to manage dental pain until professional help',
        category: 'emergency',
        status: 'active',
        duration: '2 minutes',
        frequency: 'once',
        instructions: 'If experiencing severe dental pain...',
        reminders: [
          { text: 'Call dental office immediately', timing: 'before' },
          { text: 'Take over-the-counter pain relief', timing: 'during' }
        ]
      },
      {
        id: 5,
        title: 'Crown Care Instructions',
        description: 'How to care for dental crowns',
        category: 'maintenance',
        status: 'draft',
        duration: '7 minutes',
        frequency: 'daily',
        instructions: 'Caring for your dental crown...',
        reminders: [
          { text: 'Avoid hard foods', timing: 'during' },
          { text: 'Use soft-bristled toothbrush', timing: 'during' }
        ]
      }
    ])
    
    // Mock patients data
    const mockPatients = [
      { id: 'P001', name: 'Alice Johnson', age: 34, phone: '(555) 123-4567' },
      { id: 'P002', name: 'Bob Smith', age: 28, phone: '(555) 234-5678' },
      { id: 'P003', name: 'Carol Davis', age: 45, phone: '(555) 345-6789' },
      { id: 'P004', name: 'David Wilson', age: 52, phone: '(555) 456-7890' },
      { id: 'P005', name: 'Emma Brown', age: 29, phone: '(555) 567-8901' }
    ]
    
    // ==========================================
    // COMPUTED PROPERTIES
    // ==========================================
    
    const filteredTemplates = computed(() => {
      let filtered = templates.value
      
      if (searchQuery.value) {
        filtered = filtered.filter(template =>
          template.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          template.description.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
      }
      
      if (selectedCategory.value) {
        filtered = filtered.filter(template => template.category === selectedCategory.value)
      }
      
      if (selectedStatus.value) {
        filtered = filtered.filter(template => template.status === selectedStatus.value)
      }
      
      return filtered
    })
    
    // ==========================================
    // METHODS
    // ==========================================
    
    const toggleView = () => {
      viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
    }
    
    const selectAll = () => {
      if (selectedTemplates.value.length === filteredTemplates.value.length) {
        selectedTemplates.value = []
      } else {
        selectedTemplates.value = filteredTemplates.value.map(t => t.id)
      }
    }
    
    const selectTemplate = (template) => {
      const index = selectedTemplates.value.indexOf(template.id)
      if (index > -1) {
        selectedTemplates.value.splice(index, 1)
      } else {
        selectedTemplates.value.push(template.id)
      }
    }
    
    const getCategoryClasses = (category) => {
      const classes = {
        'daily-care': 'bg-blue-100 text-blue-800',
        'pre-appointment': 'bg-green-100 text-green-800',
        'post-treatment': 'bg-purple-100 text-purple-800',
        'emergency': 'bg-red-100 text-red-800',
        'maintenance': 'bg-yellow-100 text-yellow-800'
      }
      return classes[category] || 'bg-gray-100 text-gray-800'
    }
    
    const getStatusClasses = (status) => {
      const classes = {
        'active': 'bg-green-100 text-green-800',
        'draft': 'bg-yellow-100 text-yellow-800',
        'archived': 'bg-gray-100 text-gray-800'
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    }
    
    const createNewTemplate = () => {
      editingTemplate.value = {
        id: null,
        title: '',
        description: '',
        category: 'daily-care',
        status: 'active',
        duration: '',
        frequency: 'once',
        instructions: '',
        reminders: []
      }
      showEditor.value = true
    }
    
    const editTemplate = (template) => {
      editingTemplate.value = { ...template }
      showEditor.value = true
    }
    
    const closeEditor = () => {
      showEditor.value = false
      editingTemplate.value = {}
    }
    
    const addReminder = () => {
      editingTemplate.value.reminders.push({ text: '', timing: 'before' })
    }
    
    const removeReminder = (index) => {
      editingTemplate.value.reminders.splice(index, 1)
    }
    
    const saveTemplate = () => {
      if (editingTemplate.value.id) {
        // Update existing template
        const index = templates.value.findIndex(t => t.id === editingTemplate.value.id)
        if (index > -1) {
          templates.value[index] = { ...editingTemplate.value }
        }
        emit('show-success', 'Template updated successfully')
      } else {
        // Create new template
        const newTemplate = {
          ...editingTemplate.value,
          id: Date.now() // Simple ID generation
        }
        templates.value.push(newTemplate)
        emit('show-success', 'Template created successfully')
      }
      closeEditor()
    }
    
    const assignTemplate = (template) => {
      assigningTemplate.value = template
      assignmentDate.value = new Date().toISOString().split('T')[0]
      showAssignmentModal.value = true
    }
    
    const closeAssignmentModal = () => {
      showAssignmentModal.value = false
      assigningTemplate.value = null
      patientSearchQuery.value = ''
      patientSearchResults.value = []
      selectedPatientForAssignment.value = null
      assignmentDate.value = ''
    }
    
    const searchPatientsForAssignment = () => {
      if (!patientSearchQuery.value.trim()) {
        patientSearchResults.value = []
        return
      }
      
      patientSearchResults.value = mockPatients.filter(patient =>
        patient.name.toLowerCase().includes(patientSearchQuery.value.toLowerCase()) ||
        patient.id.toLowerCase().includes(patientSearchQuery.value.toLowerCase()) ||
        patient.phone.includes(patientSearchQuery.value)
      )
    }
    
    const selectPatientForAssignment = (patient) => {
      selectedPatientForAssignment.value = patient
      patientSearchQuery.value = ''
      patientSearchResults.value = []
    }
    
    const confirmAssignment = () => {
      // TODO: Implement actual assignment logic
      emit('show-success', `Template "${assigningTemplate.value.title}" assigned to ${selectedPatientForAssignment.value.name}`)
      closeAssignmentModal()
    }
    
    // ==========================================
    // LIFECYCLE
    // ==========================================
    
    onMounted(() => {
      console.log('Task Template Management mounted')
    })
    
    // ==========================================
    // RETURN FOR TEMPLATE
    // ==========================================
    
    return {
      // State
      viewMode,
      searchQuery,
      selectedCategory,
      selectedStatus,
      selectedTemplates,
      showBulkActions,
      showEditor,
      showAssignmentModal,
      editingTemplate,
      assigningTemplate,
      patientSearchQuery,
      patientSearchResults,
      selectedPatientForAssignment,
      assignmentDate,
      
      // Computed
      filteredTemplates,
      
      // Methods
      toggleView,
      selectAll,
      selectTemplate,
      getCategoryClasses,
      getStatusClasses,
      createNewTemplate,
      editTemplate,
      closeEditor,
      addReminder,
      removeReminder,
      saveTemplate,
      assignTemplate,
      closeAssignmentModal,
      searchPatientsForAssignment,
      selectPatientForAssignment,
      confirmAssignment
    }
  }
}
</script>

<style scoped>
/* Line clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Transition effects */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-shadow {
  transition-property: box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Color classes */
.bg-primary-600 { background-color: #0066CC; }
.bg-primary-700 { background-color: #0052a3; }
.bg-secondary-600 { background-color: #00A86B; }
.bg-secondary-700 { background-color: #047857; }
.text-primary-600 { color: #0066CC; }
.text-secondary-600 { color: #00A86B; }
.ring-primary-500 { --tw-ring-color: #3b82f6; }
.border-primary-500 { border-color: #3b82f6; }
.border-primary-300 { border-color: #93c5fd; }
.hover\\:border-primary-300:hover { border-color: #93c5fd; }
.hover\\:text-primary-600:hover { color: #0066CC; }
.hover\\:text-secondary-600:hover { color: #00A86B; }
</style>
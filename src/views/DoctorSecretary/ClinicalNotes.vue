<!--
  Clinical Notes Component (Doctor Only)
  
  Professional clinical documentation system with:
  - Patient search and selection
  - Rich text note editor
  - Template system for common procedures
  - Note history and versioning
  - Treatment plan integration
  - Medical coding support
-->
<template>
  <div class="p-4 space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Clinical Notes</h1>
          <p class="text-slate-600">Create and manage patient clinical documentation</p>
        </div>
        
        <div class="flex items-center space-x-3">
          <button 
            @click="showTemplates = true"
            class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Templates
          </button>
          
          <button 
            @click="createNewNote"
            class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Note
          </button>
        </div>
      </div>

      <!-- Patient Selection -->
      <div class="mt-6">
        <label class="block text-sm font-medium text-slate-700 mb-2">Select Patient</label>
        <div class="relative">
          <input 
            v-model="patientSearchQuery"
            @input="searchPatients"
            type="text"
            placeholder="Search patients by name or ID..."
            class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <svg class="w-5 h-5 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          
          <!-- Patient Search Dropdown -->
          <div v-if="showPatientDropdown && patientSearchResults.length > 0" class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
            <div
              v-for="patient in patientSearchResults"
              :key="patient.id"
              @click="selectPatient(patient)"
              class="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div class="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                <span class="text-xs font-medium text-slate-600">
                  {{ patient.name.split(' ').map(n => n[0]).join('') }}
                </span>
              </div>
              <div>
                <p class="text-sm font-medium text-slate-800">{{ patient.name }}</p>
                <p class="text-xs text-slate-500">ID: {{ patient.id }} • Age: {{ patient.age }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Selected Patient Info -->
        <div v-if="selectedPatient" class="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                <span class="text-sm font-medium text-blue-800">
                  {{ selectedPatient.name.split(' ').map(n => n[0]).join('') }}
                </span>
              </div>
              <div>
                <p class="font-medium text-blue-900">{{ selectedPatient.name }}</p>
                <p class="text-sm text-blue-700">{{ selectedPatient.age }} years • Last visit: {{ formatDate(selectedPatient.lastVisit) }}</p>
              </div>
            </div>
            <button 
              @click="clearPatientSelection"
              class="text-blue-600 hover:text-blue-800 p-1"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Notes History Sidebar -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100">
          <div class="p-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-slate-800">Notes History</h2>
            <p class="text-sm text-slate-600">{{ selectedPatient ? `Notes for ${selectedPatient.name}` : 'Select a patient' }}</p>
          </div>
          
          <div class="p-4">
            <div v-if="!selectedPatient" class="text-center py-8">
              <svg class="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <p class="text-slate-500">Select a patient to view notes</p>
            </div>
            
            <div v-else class="space-y-3 max-h-96 overflow-y-auto">
              <div
                v-for="note in patientNotes"
                :key="note.id"
                @click="selectNote(note)"
                class="p-3 rounded-lg border cursor-pointer transition-colors"
                :class="selectedNote?.id === note.id ? 'border-primary-300 bg-primary-50' : 'border-gray-200 hover:bg-gray-50'"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h4 class="text-sm font-medium text-slate-800">{{ note.title }}</h4>
                    <p class="text-xs text-slate-600 mt-1">{{ note.procedure }}</p>
                    <p class="text-xs text-slate-500 mt-1">{{ formatDate(note.date) }}</p>
                  </div>
                  <div class="flex items-center space-x-1">
                    <span 
                      class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium"
                      :class="getNoteTypeClasses(note.type)"
                    >
                      {{ note.type }}
                    </span>
                  </div>
                </div>
                
                <div class="mt-2">
                  <p class="text-xs text-slate-600 line-clamp-2">{{ note.summary }}</p>
                </div>
              </div>
              
              <div v-if="patientNotes.length === 0" class="text-center py-4">
                <p class="text-slate-500">No notes found for this patient</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Note Editor -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100">
          <div class="p-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-slate-800">
                {{ isEditingNote ? 'Edit Clinical Note' : 'New Clinical Note' }}
              </h2>
              
              <div class="flex items-center space-x-2">
                <button 
                  v-if="selectedNote"
                  @click="duplicateNote"
                  class="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-gray-100"
                  title="Duplicate Note"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                </button>
                
                <button 
                  @click="clearNoteEditor"
                  class="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-gray-100"
                  title="Clear Editor"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div class="p-6">
            <div v-if="!selectedPatient" class="text-center py-12">
              <svg class="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 class="text-lg font-medium text-slate-800 mb-2">No Patient Selected</h3>
              <p class="text-slate-600">Please select a patient to create or edit clinical notes.</p>
            </div>
            
            <div v-else class="space-y-6">
              <!-- Note Header Information -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Note Title</label>
                  <input 
                    v-model="noteForm.title"
                    type="text"
                    placeholder="e.g., Routine Cleaning Follow-up"
                    class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Procedure/Treatment</label>
                  <select 
                    v-model="noteForm.procedure"
                    class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select procedure...</option>
                    <option value="Routine Cleaning">Routine Cleaning</option>
                    <option value="Cavity Filling">Cavity Filling</option>
                    <option value="Root Canal">Root Canal</option>
                    <option value="Crown Placement">Crown Placement</option>
                    <option value="Tooth Extraction">Tooth Extraction</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Follow-up">Follow-up</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Note Type</label>
                  <select 
                    v-model="noteForm.type"
                    class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="Treatment">Treatment</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
              </div>

              <!-- Clinical Findings -->
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Clinical Findings</label>
                <textarea
                  v-model="noteForm.findings"
                  placeholder="Document clinical observations, findings, and examination results..."
                  rows="4"
                  class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                ></textarea>
              </div>

              <!-- Treatment Provided -->
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Treatment Provided</label>
                <textarea
                  v-model="noteForm.treatment"
                  placeholder="Describe the treatment performed, procedures completed, materials used..."
                  rows="4"
                  class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                ></textarea>
              </div>

              <!-- Patient Response -->
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Patient Response</label>
                <textarea
                  v-model="noteForm.patientResponse"
                  placeholder="Document patient's response to treatment, comfort level, any concerns..."
                  rows="3"
                  class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                ></textarea>
              </div>

              <!-- Post-Treatment Instructions -->
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Post-Treatment Instructions</label>
                <textarea
                  v-model="noteForm.instructions"
                  placeholder="Care instructions, medication prescriptions, follow-up recommendations..."
                  rows="3"
                  class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                ></textarea>
              </div>

              <!-- Additional Notes -->
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Additional Notes</label>
                <textarea
                  v-model="noteForm.additionalNotes"
                  placeholder="Any additional observations, complications, or relevant information..."
                  rows="3"
                  class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                ></textarea>
              </div>

              <!-- Follow-up Required -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="flex items-center space-x-2">
                    <input 
                      v-model="noteForm.followUpRequired"
                      type="checkbox"
                      class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span class="text-sm font-medium text-slate-700">Follow-up Required</span>
                  </label>
                  
                  <div v-if="noteForm.followUpRequired" class="mt-2">
                    <input 
                      v-model="noteForm.followUpDate"
                      type="date"
                      class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Priority Level</label>
                  <select 
                    v-model="noteForm.priority"
                    class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                <div class="flex items-center space-x-3">
                  <button 
                    @click="saveAsDraft"
                    class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Save as Draft
                  </button>
                  
                  <span v-if="lastSaved" class="text-xs text-slate-500">
                    Last saved: {{ formatTime(lastSaved) }}
                  </span>
                </div>
                
                <div class="flex items-center space-x-3">
                  <button 
                    @click="previewNote"
                    class="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Preview
                  </button>
                  
                  <button 
                    @click="saveNote"
                    :disabled="!canSaveNote"
                    class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ isEditingNote ? 'Update Note' : 'Save Note' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Template Modal -->
    <div v-if="showTemplates" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="showTemplates = false">
      <div @click.stop class="bg-white rounded-xl shadow-xl max-w-4xl max-h-[80vh] overflow-y-auto m-4">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-slate-800">Clinical Note Templates</h3>
            <button 
              @click="showTemplates = false"
              class="text-slate-400 hover:text-slate-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="template in noteTemplates"
              :key="template.id"
              @click="useTemplate(template)"
              class="p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 cursor-pointer transition-colors"
            >
              <h4 class="font-medium text-slate-800 mb-2">{{ template.title }}</h4>
              <p class="text-sm text-slate-600 mb-3">{{ template.description }}</p>
              <div class="flex items-center justify-between">
                <span class="text-xs text-slate-500">{{ template.procedure }}</span>
                <span 
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  :class="getNoteTypeClasses(template.type)"
                >
                  {{ template.type }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Note Preview Modal -->
    <div v-if="showPreview" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="showPreview = false">
      <div @click.stop class="bg-white rounded-xl shadow-xl max-w-4xl max-h-[80vh] overflow-y-auto m-4">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-slate-800">Note Preview</h3>
            <div class="flex items-center space-x-2">
              <button 
                @click="printNote"
                class="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-gray-100"
                title="Print Note"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
              </button>
              <button 
                @click="showPreview = false"
                class="text-slate-400 hover:text-slate-600"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div class="p-6 space-y-4">
          <!-- Note Header -->
          <div class="border-b border-gray-200 pb-4">
            <h2 class="text-xl font-bold text-slate-800">{{ noteForm.title }}</h2>
            <div class="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span class="text-slate-600">Patient:</span>
                <span class="ml-2 font-medium">{{ selectedPatient?.name }}</span>
              </div>
              <div>
                <span class="text-slate-600">Date:</span>
                <span class="ml-2 font-medium">{{ formatDate(new Date()) }}</span>
              </div>
              <div>
                <span class="text-slate-600">Procedure:</span>
                <span class="ml-2 font-medium">{{ noteForm.procedure }}</span>
              </div>
              <div>
                <span class="text-slate-600">Type:</span>
                <span class="ml-2 font-medium">{{ noteForm.type }}</span>
              </div>
            </div>
          </div>

          <!-- Note Content -->
          <div class="space-y-4">
            <div v-if="noteForm.findings">
              <h4 class="font-medium text-slate-800 mb-2">Clinical Findings</h4>
              <p class="text-slate-700 whitespace-pre-wrap">{{ noteForm.findings }}</p>
            </div>

            <div v-if="noteForm.treatment">
              <h4 class="font-medium text-slate-800 mb-2">Treatment Provided</h4>
              <p class="text-slate-700 whitespace-pre-wrap">{{ noteForm.treatment }}</p>
            </div>

            <div v-if="noteForm.patientResponse">
              <h4 class="font-medium text-slate-800 mb-2">Patient Response</h4>
              <p class="text-slate-700 whitespace-pre-wrap">{{ noteForm.patientResponse }}</p>
            </div>

            <div v-if="noteForm.instructions">
              <h4 class="font-medium text-slate-800 mb-2">Post-Treatment Instructions</h4>
              <p class="text-slate-700 whitespace-pre-wrap">{{ noteForm.instructions }}</p>
            </div>

            <div v-if="noteForm.additionalNotes">
              <h4 class="font-medium text-slate-800 mb-2">Additional Notes</h4>
              <p class="text-slate-700 whitespace-pre-wrap">{{ noteForm.additionalNotes }}</p>
            </div>

            <div v-if="noteForm.followUpRequired" class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p class="text-yellow-800 font-medium">Follow-up Required</p>
              <p class="text-yellow-700">Scheduled for: {{ formatDate(noteForm.followUpDate) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'ClinicalNotes',
  emits: ['show-toast', 'show-error', 'show-success'],
  setup(props, { emit }) {
    const router = useRouter()
    const route = useRoute()
    const authStore = useAuthStore()
    
    // ==========================================
    // REACTIVE STATE
    // ==========================================
    
    const patientSearchQuery = ref('')
    const showPatientDropdown = ref(false)
    const selectedPatient = ref(null)
    const selectedNote = ref(null)
    const showTemplates = ref(false)
    const showPreview = ref(false)
    const lastSaved = ref(null)
    const isEditingNote = ref(false)
    
    const patientSearchResults = ref([])
    const patientNotes = ref([])
    
    // Note form data
    const noteForm = ref({
      title: '',
      procedure: '',
      type: 'Treatment',
      findings: '',
      treatment: '',
      patientResponse: '',
      instructions: '',
      additionalNotes: '',
      followUpRequired: false,
      followUpDate: '',
      priority: 'Medium'
    })
    
    // Mock data
    const mockPatients = ref([
      { id: 'P001', name: 'John Smith', age: 34, lastVisit: new Date('2024-01-05') },
      { id: 'P002', name: 'Sarah Johnson', age: 28, lastVisit: new Date('2024-01-03') },
      { id: 'P003', name: 'Mike Davis', age: 45, lastVisit: new Date('2024-01-02') }
    ])
    
    const noteTemplates = ref([
      {
        id: 1,
        title: 'Routine Cleaning Template',
        description: 'Standard template for routine dental cleaning procedures',
        procedure: 'Routine Cleaning',
        type: 'Treatment',
        template: {
          findings: 'Periodontal examination reveals:\n- Gingival health: \n- Plaque/calculus deposits: \n- Oral hygiene: ',
          treatment: 'Performed comprehensive oral prophylaxis including:\n- Supragingival scaling\n- Polishing with prophy paste\n- Fluoride application',
          instructions: 'Post-treatment care:\n- Continue regular brushing and flossing\n- Use fluoride toothpaste\n- Schedule next cleaning in 6 months'
        }
      },
      {
        id: 2,
        title: 'Cavity Filling Template',
        description: 'Template for cavity restoration procedures',
        procedure: 'Cavity Filling',
        type: 'Treatment',
        template: {
          findings: 'Clinical examination and radiographic assessment reveal:\n- Tooth #: \n- Caries extent: \n- Pulp vitality: ',
          treatment: 'Restored tooth # with:\n- Local anesthesia administered\n- Caries removal completed\n- Composite restoration placed',
          instructions: 'Post-operative instructions:\n- Avoid hard/sticky foods for 24 hours\n- Some sensitivity is normal\n- Contact office if severe pain occurs'
        }
      }
    ])
    
    // ==========================================
    // COMPUTED PROPERTIES
    // ==========================================
    
    const canSaveNote = computed(() => {
      return selectedPatient.value && 
             noteForm.value.title.trim() && 
             noteForm.value.procedure && 
             (noteForm.value.findings.trim() || noteForm.value.treatment.trim())
    })
    
    // ==========================================
    // METHODS
    // ==========================================
    
    const formatDate = (date) => {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    }
    
    const formatTime = (date) => {
      return new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    const getNoteTypeClasses = (type) => {
      switch (type) {
        case 'Treatment':
          return 'bg-blue-100 text-blue-800'
        case 'Consultation':
          return 'bg-green-100 text-green-800'
        case 'Follow-up':
          return 'bg-yellow-100 text-yellow-800'
        case 'Emergency':
          return 'bg-red-100 text-red-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }
    
    // Patient search methods
    const searchPatients = () => {
      if (patientSearchQuery.value.length < 2) {
        patientSearchResults.value = []
        showPatientDropdown.value = false
        return
      }
      
      const query = patientSearchQuery.value.toLowerCase()
      patientSearchResults.value = mockPatients.value.filter(patient =>
        patient.name.toLowerCase().includes(query) ||
        patient.id.toLowerCase().includes(query)
      )
      showPatientDropdown.value = true
    }
    
    const selectPatient = (patient) => {
      selectedPatient.value = patient
      patientSearchQuery.value = patient.name
      showPatientDropdown.value = false
      loadPatientNotes(patient.id)
    }
    
    const clearPatientSelection = () => {
      selectedPatient.value = null
      patientSearchQuery.value = ''
      patientNotes.value = []
      selectedNote.value = null
      clearNoteEditor()
    }
    
    // Note management methods
    const loadPatientNotes = async (patientId) => {
      try {
        // TODO: Replace with actual API call
        // const response = await api.get(`/patients/${patientId}/clinical-notes`)
        // patientNotes.value = response.data
        
        // Mock data
        patientNotes.value = [
          {
            id: 1,
            title: 'Routine Cleaning',
            procedure: 'Routine Cleaning',
            type: 'Treatment',
            date: new Date('2024-01-05'),
            summary: 'Comprehensive oral prophylaxis completed. Good oral hygiene noted.',
            findings: 'Periodontal examination reveals healthy gingiva with minimal plaque accumulation.',
            treatment: 'Performed comprehensive oral prophylaxis including supragingival scaling and polishing.',
            instructions: 'Continue regular brushing and flossing. Schedule next cleaning in 6 months.'
          }
        ]
      } catch (error) {
        console.error('Error loading patient notes:', error)
        emit('show-error', 'Failed to load patient notes')
      }
    }
    
    const selectNote = (note) => {
      selectedNote.value = note
      isEditingNote.value = true
      
      // Populate form with note data
      noteForm.value = {
        title: note.title,
        procedure: note.procedure,
        type: note.type,
        findings: note.findings || '',
        treatment: note.treatment || '',
        patientResponse: note.patientResponse || '',
        instructions: note.instructions || '',
        additionalNotes: note.additionalNotes || '',
        followUpRequired: note.followUpRequired || false,
        followUpDate: note.followUpDate || '',
        priority: note.priority || 'Medium'
      }
    }
    
    const createNewNote = () => {
      selectedNote.value = null
      isEditingNote.value = false
      clearNoteEditor()
    }
    
    const clearNoteEditor = () => {
      noteForm.value = {
        title: '',
        procedure: '',
        type: 'Treatment',
        findings: '',
        treatment: '',
        patientResponse: '',
        instructions: '',
        additionalNotes: '',
        followUpRequired: false,
        followUpDate: '',
        priority: 'Medium'
      }
    }
    
    const useTemplate = (template) => {
      noteForm.value.title = template.title
      noteForm.value.procedure = template.procedure
      noteForm.value.type = template.type
      noteForm.value.findings = template.template.findings || ''
      noteForm.value.treatment = template.template.treatment || ''
      noteForm.value.instructions = template.template.instructions || ''
      
      showTemplates.value = false
      emit('show-success', 'Template applied successfully')
    }
    
    const duplicateNote = () => {
      if (!selectedNote.value) return
      
      isEditingNote.value = false
      selectedNote.value = null
      noteForm.value.title = `Copy of ${noteForm.value.title}`
      
      emit('show-success', 'Note duplicated. Make your changes and save.')
    }
    
    const saveAsDraft = () => {
      lastSaved.value = new Date()
      emit('show-success', 'Note saved as draft')
    }
    
    const saveNote = async () => {
      if (!canSaveNote.value) return
      
      try {
        // TODO: Replace with actual API call
        // if (isEditingNote.value) {
        //   await api.put(`/clinical-notes/${selectedNote.value.id}`, noteForm.value)
        // } else {
        //   await api.post('/clinical-notes', {
        //     ...noteForm.value,
        //     patientId: selectedPatient.value.id
        //   })
        // }
        
        lastSaved.value = new Date()
        emit('show-success', `Note ${isEditingNote.value ? 'updated' : 'saved'} successfully`)
        
        // Reload patient notes
        if (selectedPatient.value) {
          loadPatientNotes(selectedPatient.value.id)
        }
        
      } catch (error) {
        console.error('Error saving note:', error)
        emit('show-error', 'Failed to save note')
      }
    }
    
    const previewNote = () => {
      if (!canSaveNote.value) {
        emit('show-error', 'Please fill in required fields before previewing')
        return
      }
      showPreview.value = true
    }
    
    const printNote = () => {
      window.print()
    }
    
    // ==========================================
    // WATCHERS
    // ==========================================
    
    // Handle patient pre-selection from URL
    watch(() => route.query.patient, (patientId) => {
      if (patientId) {
        const patient = mockPatients.value.find(p => p.id === patientId)
        if (patient) {
          selectPatient(patient)
        }
      }
    }, { immediate: true })
    
    // Close dropdown when clicking outside
    watch(patientSearchQuery, () => {
      if (patientSearchQuery.value === '') {
        showPatientDropdown.value = false
      }
    })
    
    // ==========================================
    // LIFECYCLE
    // ==========================================
    
    onMounted(() => {
      // Initialize component
    })
    
    // ==========================================
    // RETURN FOR TEMPLATE
    // ==========================================
    
    return {
      // State
      patientSearchQuery,
      showPatientDropdown,
      selectedPatient,
      selectedNote,
      showTemplates,
      showPreview,
      lastSaved,
      isEditingNote,
      patientSearchResults,
      patientNotes,
      noteForm,
      noteTemplates,
      
      // Computed
      canSaveNote,
      
      // Methods
      formatDate,
      formatTime,
      getNoteTypeClasses,
      searchPatients,
      selectPatient,
      clearPatientSelection,
      loadPatientNotes,
      selectNote,
      createNewNote,
      clearNoteEditor,
      useTemplate,
      duplicateNote,
      saveAsDraft,
      saveNote,
      previewNote,
      printNote
    }
  }
}
</script>

<style scoped>
/* Line clamp utility */
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

/* Hover effects */
.hover\\:bg-primary-700:hover {
  background-color: #0052a3;
}

.hover\\:bg-gray-200:hover {
  background-color: #e5e7eb;
}

.hover\\:bg-blue-200:hover {
  background-color: #dbeafe;
}

.hover\\:bg-gray-50:hover {
  background-color: #f9fafb;
}

.hover\\:bg-gray-100:hover {
  background-color: #f3f4f6;
}

.hover\\:border-primary-300:hover {
  border-color: #93c5fd;
}

.hover\\:bg-primary-50:hover {
  background-color: #eff6ff;
}

.hover\\:text-slate-600:hover {
  color: #475569;
}

.hover\\:text-slate-800:hover {
  color: #1e293b;
}

/* Focus effects */
.focus\\:ring-2:focus {
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

.focus\\:ring-primary-500:focus {
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

.focus\\:border-primary-500:focus {
  border-color: #0066CC;
}

/* Transition effects */
.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Custom color classes */
.bg-primary-600 { background-color: #0066CC; }
.bg-primary-700 { background-color: #0052a3; }
.border-primary-300 { border-color: #93c5fd; }
.bg-primary-50 { background-color: #eff6ff; }

/* Grid responsive */
.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

@media (min-width: 768px) {
  .md\\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .md\\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .md\\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .lg\\:col-span-1 {
    grid-column: span 1 / span 1;
  }
  .lg\\:col-span-2 {
    grid-column: span 2 / span 2;
  }
  .lg\\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* Disabled states */
.disabled\\:opacity-50:disabled {
  opacity: 0.5;
}

.disabled\\:cursor-not-allowed:disabled {
  cursor: not-allowed;
}

/* Scrollbar styling */
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

/* Modal backdrop */
.fixed {
  position: fixed;
}

.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.z-50 {
  z-index: 50;
}

/* Whitespace utilities */
.whitespace-pre-wrap {
  white-space: pre-wrap;
}
</style>
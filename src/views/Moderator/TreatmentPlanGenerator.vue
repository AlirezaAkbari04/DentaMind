<!--
  Treatment Plan Generator Component
  
  AI-assisted treatment plan creation interface with:
  - Patient selection and information input
  - Symptom and condition assessment
  - AI recommendation placeholder
  - Treatment plan customization
  - Doctor assignment and timeline
-->
<template>
  <div class="p-4 space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Treatment Plan Generator</h1>
          <p class="text-slate-600">Create AI-assisted treatment plans for patients</p>
        </div>
        <div class="flex items-center space-x-3">
          <button 
            @click="saveDraft"
            :disabled="isLoading"
            class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            Save Draft
          </button>
          <button 
            @click="generatePlan"
            :disabled="isLoading || !canGenerate"
            class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generate Plan
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Left Column: Patient Information & Assessment -->
      <div class="space-y-6">
        <!-- Patient Selection -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-lg font-semibold text-slate-800 mb-4">Patient Information</h2>
          
          <div class="space-y-4">
            <!-- Patient Search -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Search Patient</label>
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search by name, ID, or phone..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  @input="searchPatients"
                >
                <svg class="absolute right-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <!-- Patient Results -->
            <div v-if="searchResults.length > 0" class="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
              <div
                v-for="patient in searchResults"
                :key="patient.id"
                class="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                @click="selectPatient(patient)"
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
            <div v-if="selectedPatient" class="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span class="text-sm font-medium text-blue-600">{{ selectedPatient.name.split(' ').map(n => n[0]).join('') }}</span>
                </div>
                <div>
                  <p class="font-medium text-slate-800">{{ selectedPatient.name }}</p>
                  <p class="text-sm text-slate-600">{{ selectedPatient.age }} years old • Last visit: {{ formatDate(selectedPatient.lastVisit) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Assessment Form -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-lg font-semibold text-slate-800 mb-4">Clinical Assessment</h2>
          
          <div class="space-y-4">
            <!-- Chief Complaint -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Chief Complaint</label>
              <textarea
                v-model="assessment.chiefComplaint"
                rows="3"
                placeholder="Patient's main concern or reason for visit..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              ></textarea>
            </div>

            <!-- Symptoms -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Symptoms</label>
              <div class="grid grid-cols-2 gap-2">
                <label
                  v-for="symptom in availableSymptoms"
                  :key="symptom"
                  class="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    v-model="assessment.symptoms"
                    :value="symptom"
                    type="checkbox"
                    class="text-primary-600 focus:ring-primary-500"
                  >
                  <span class="text-sm text-slate-700">{{ symptom }}</span>
                </label>
              </div>
            </div>

            <!-- Medical History -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Relevant Medical History</label>
              <textarea
                v-model="assessment.medicalHistory"
                rows="3"
                placeholder="Previous treatments, allergies, medications..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              ></textarea>
            </div>

            <!-- Urgency Level -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Urgency Level</label>
              <select
                v-model="assessment.urgency"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="low">Low - Routine care</option>
                <option value="medium">Medium - Needs attention</option>
                <option value="high">High - Urgent treatment</option>
                <option value="emergency">Emergency - Immediate care</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: AI Recommendations & Plan -->
      <div class="space-y-6">
        <!-- AI Recommendations -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-slate-800">AI Recommendations</h2>
            <div class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span class="text-sm text-slate-600">AI Ready</span>
            </div>
          </div>
          
          <div v-if="!aiRecommendations && !isLoading" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p class="text-slate-600">Complete the assessment to get AI recommendations</p>
          </div>

          <div v-if="isLoading" class="text-center py-8">
            <div class="animate-spin mx-auto h-8 w-8 text-primary-600 mb-4">
              <svg fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p class="text-slate-600">AI is analyzing the assessment...</p>
          </div>

          <div v-if="aiRecommendations" class="space-y-4">
            <!-- Recommended Procedures -->
            <div>
              <h3 class="text-sm font-medium text-slate-700 mb-2">Recommended Procedures</h3>
              <div class="space-y-2">
                <div
                  v-for="procedure in aiRecommendations.procedures"
                  :key="procedure.id"
                  class="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <div>
                    <p class="font-medium text-slate-800">{{ procedure.name }}</p>
                    <p class="text-sm text-slate-600">{{ procedure.description }}</p>
                  </div>
                  <div class="text-right">
                    <span class="text-sm text-blue-600 font-medium">{{ procedure.confidence }}% match</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- AI Notes -->
            <div>
              <h3 class="text-sm font-medium text-slate-700 mb-2">AI Analysis Notes</h3>
              <div class="p-3 bg-gray-50 rounded-lg">
                <p class="text-sm text-slate-700">{{ aiRecommendations.notes }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Treatment Plan -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-lg font-semibold text-slate-800 mb-4">Treatment Plan</h2>
          
          <div class="space-y-4">
            <!-- Plan Title -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Plan Title</label>
              <input
                v-model="treatmentPlan.title"
                type="text"
                placeholder="e.g., Comprehensive Dental Restoration"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
            </div>

            <!-- Assigned Doctor -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Assigned Doctor</label>
              <select
                v-model="treatmentPlan.assignedDoctor"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select Doctor</option>
                <option
                  v-for="doctor in availableDoctors"
                  :key="doctor.id"
                  :value="doctor.id"
                >
                  {{ doctor.name }} - {{ doctor.specialty }}
                </option>
              </select>
            </div>

            <!-- Timeline -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Estimated Timeline</label>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs text-slate-600 mb-1">Start Date</label>
                  <input
                    v-model="treatmentPlan.startDate"
                    type="date"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                </div>
                <div>
                  <label class="block text-xs text-slate-600 mb-1">Estimated Duration</label>
                  <select
                    v-model="treatmentPlan.duration"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="1-2 weeks">1-2 weeks</option>
                    <option value="1 month">1 month</option>
                    <option value="2-3 months">2-3 months</option>
                    <option value="6+ months">6+ months</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Treatment Steps -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Treatment Steps</label>
              <div class="space-y-2">
                <div
                  v-for="(step, index) in treatmentPlan.steps"
                  :key="index"
                  class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg"
                >
                  <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span class="text-sm font-medium text-primary-600">{{ index + 1 }}</span>
                  </div>
                  <input
                    v-model="step.description"
                    type="text"
                    placeholder="Treatment step description..."
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                  <button
                    @click="removeTreatmentStep(index)"
                    class="p-1 text-red-500 hover:text-red-700"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <button
                @click="addTreatmentStep"
                class="w-full mt-2 p-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-slate-600 hover:border-primary-300 hover:text-primary-600 transition-colors"
              >
                + Add Treatment Step
              </button>
            </div>

            <!-- Notes -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Additional Notes</label>
              <textarea
                v-model="treatmentPlan.notes"
                rows="3"
                placeholder="Special instructions, precautions, or additional information..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              ></textarea>
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
  name: 'TreatmentPlanGenerator',
  emits: ['show-toast', 'show-error', 'show-success'],
  setup(props, { emit }) {
    const router = useRouter()
    
    // ==========================================
    // REACTIVE STATE
    // ==========================================
    
    const isLoading = ref(false)
    const searchQuery = ref('')
    const searchResults = ref([])
    const selectedPatient = ref(null)
    const aiRecommendations = ref(null)
    
    // Assessment data
    const assessment = ref({
      chiefComplaint: '',
      symptoms: [],
      medicalHistory: '',
      urgency: 'medium'
    })
    
    // Treatment plan data
    const treatmentPlan = ref({
      title: '',
      assignedDoctor: '',
      startDate: '',
      duration: '1 month',
      steps: [
        { description: '' }
      ],
      notes: ''
    })
    
    // Mock data
    const availableSymptoms = [
      'Tooth Pain', 'Sensitivity', 'Swelling', 'Bleeding Gums',
      'Bad Breath', 'Jaw Pain', 'Difficulty Chewing', 'Loose Teeth'
    ]
    
    const availableDoctors = ref([
      { id: 1, name: 'Dr. Sarah Johnson', specialty: 'General Dentistry' },
      { id: 2, name: 'Dr. Michael Chen', specialty: 'Orthodontics' },
      { id: 3, name: 'Dr. Emily Rodriguez', specialty: 'Periodontics' },
      { id: 4, name: 'Dr. David Kim', specialty: 'Oral Surgery' }
    ])
    
    const mockPatients = [
      { id: 'P001', name: 'Alice Johnson', age: 34, phone: '(555) 123-4567', lastVisit: '2024-01-10' },
      { id: 'P002', name: 'Bob Smith', age: 28, phone: '(555) 234-5678', lastVisit: '2024-01-08' },
      { id: 'P003', name: 'Carol Davis', age: 45, phone: '(555) 345-6789', lastVisit: '2024-01-12' },
      { id: 'P004', name: 'David Wilson', age: 52, phone: '(555) 456-7890', lastVisit: '2024-01-05' }
    ]
    
    // ==========================================
    // COMPUTED PROPERTIES
    // ==========================================
    
    const canGenerate = computed(() => {
      return selectedPatient.value && 
             assessment.value.chiefComplaint && 
             assessment.value.symptoms.length > 0
    })
    
    // ==========================================
    // METHODS
    // ==========================================
    
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    }
    
    const searchPatients = () => {
      if (!searchQuery.value.trim()) {
        searchResults.value = []
        return
      }
      
      searchResults.value = mockPatients.filter(patient => 
        patient.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        patient.phone.includes(searchQuery.value)
      )
    }
    
    const selectPatient = (patient) => {
      selectedPatient.value = patient
      searchQuery.value = ''
      searchResults.value = []
    }
    
    const addTreatmentStep = () => {
      treatmentPlan.value.steps.push({ description: '' })
    }
    
    const removeTreatmentStep = (index) => {
      if (treatmentPlan.value.steps.length > 1) {
        treatmentPlan.value.steps.splice(index, 1)
      }
    }
    
    const generatePlan = async () => {
      if (!canGenerate.value) return
      
      isLoading.value = true
      
      try {
        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Mock AI recommendations
        aiRecommendations.value = {
          procedures: [
            {
              id: 1,
              name: 'Root Canal Treatment',
              description: 'Recommended for severe tooth pain and infection',
              confidence: 92
            },
            {
              id: 2,
              name: 'Crown Placement',
              description: 'Follow-up treatment to restore tooth structure',
              confidence: 87
            },
            {
              id: 3,
              name: 'Antibiotic Therapy',
              description: 'Prescribed to manage infection before treatment',
              confidence: 78
            }
          ],
          notes: 'Based on the symptoms and medical history, the patient shows signs of pulpitis with possible apical periodontitis. Immediate treatment is recommended to prevent further complications.'
        }
        
        // Auto-populate treatment plan
        treatmentPlan.value.title = 'Emergency Root Canal Treatment Plan'
        treatmentPlan.value.steps = [
          { description: 'Initial examination and X-rays' },
          { description: 'Administer local anesthesia' },
          { description: 'Root canal treatment' },
          { description: 'Temporary filling placement' },
          { description: 'Crown preparation and placement' },
          { description: 'Follow-up appointment' }
        ]
        
        emit('show-success', 'AI treatment plan generated successfully')
        
      } catch (error) {
        console.error('Error generating plan:', error)
        emit('show-error', 'Failed to generate treatment plan')
      } finally {
        isLoading.value = false
      }
    }
    
    const saveDraft = () => {
      // TODO: Implement save draft functionality
      emit('show-success', 'Draft saved successfully')
    }
    
    // ==========================================
    // LIFECYCLE
    // ==========================================
    
    onMounted(() => {
      console.log('Treatment Plan Generator mounted')
    })
    
    // ==========================================
    // RETURN FOR TEMPLATE
    // ==========================================
    
    return {
      // State
      isLoading,
      searchQuery,
      searchResults,
      selectedPatient,
      assessment,
      treatmentPlan,
      aiRecommendations,
      availableSymptoms,
      availableDoctors,
      
      // Computed
      canGenerate,
      
      // Methods
      formatDate,
      searchPatients,
      selectPatient,
      addTreatmentStep,
      removeTreatmentStep,
      generatePlan,
      saveDraft
    }
  }
}
</script>

<style scoped>
/* Custom styles for the treatment plan generator */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Checkbox styling */
input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
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

/* Hover effects */
.hover\\:bg-gray-50:hover {
  background-color: #f9fafb;
}

.hover\\:bg-primary-700:hover {
  background-color: #0052a3;
}

.hover\\:text-primary-600:hover {
  color: #0066CC;
}

.hover\\:text-red-700:hover {
  color: #b91c1c;
}

.hover\\:border-primary-300:hover {
  border-color: #93c5fd;
}

/* Transition effects */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Color classes */
.bg-primary-600 { background-color: #0066CC; }
.bg-primary-700 { background-color: #0052a3; }
.bg-primary-100 { background-color: #dbeafe; }
.text-primary-600 { color: #0066CC; }
.text-primary-700 { color: #0052a3; }
.ring-primary-500 { --tw-ring-color: #3b82f6; }
.border-primary-500 { border-color: #3b82f6; }
</style>
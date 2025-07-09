<!--
  AI Diagnostics Component (Doctor Only)
  
  AI-powered diagnostic analysis system with:
  - Photo analysis and interpretation
  - Diagnostic suggestions and recommendations
  - Confidence scoring and risk assessment
  - Integration with patient records
  - Treatment plan generation
-->
<template>
  <div class="p-4 space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">AI Diagnostics</h1>
          <p class="text-slate-600">AI-powered analysis and diagnostic assistance</p>
        </div>
        
        <div class="flex items-center space-x-3">
          <button 
            @click="uploadPhoto"
            class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Analyze New Photo
          </button>
          
          <button 
            @click="viewAnalysisHistory"
            class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analysis History
          </button>
        </div>
      </div>
    </div>

    <!-- Active Analysis Section -->
    <div v-if="currentAnalysis" class="grid lg:grid-cols-2 gap-6">
      <!-- Image and Analysis Results -->
      <div class="space-y-6">
        <!-- Photo Display -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-lg font-semibold text-slate-800 mb-4">Analyzed Image</h2>
          
          <div class="relative">
            <img 
              :src="currentAnalysis.imageUrl"
              :alt="currentAnalysis.filename"
              class="w-full h-64 object-cover rounded-lg border border-gray-200"
            >
            
            <!-- Analysis Status Overlay -->
            <div v-if="isAnalyzing" class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <div class="text-center text-white">
                <div class="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                <p class="text-sm">Analyzing image...</p>
              </div>
            </div>
            
            <!-- Analysis Annotations -->
            <div v-if="currentAnalysis.annotations" class="absolute inset-0">
              <div
                v-for="annotation in currentAnalysis.annotations"
                :key="annotation.id"
                class="absolute border-2 border-red-500 bg-red-500 bg-opacity-20"
                :style="getAnnotationStyle(annotation)"
              >
                <div class="absolute -top-6 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {{ annotation.label }}
                </div>
              </div>
            </div>
          </div>
          
          <!-- Image Info -->
          <div class="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-slate-600">Filename:</span>
              <span class="ml-2 text-slate-800">{{ currentAnalysis.filename }}</span>
            </div>
            <div>
              <span class="text-slate-600">Analyzed:</span>
              <span class="ml-2 text-slate-800">{{ formatDate(currentAnalysis.analyzedAt) }}</span>
            </div>
            <div>
              <span class="text-slate-600">Patient:</span>
              <span class="ml-2 text-slate-800">{{ currentAnalysis.patientName || 'N/A' }}</span>
            </div>
            <div>
              <span class="text-slate-600">AI Model:</span>
              <span class="ml-2 text-slate-800">{{ currentAnalysis.modelVersion }}</span>
            </div>
          </div>
        </div>

        <!-- Analysis Results -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-lg font-semibold text-slate-800 mb-4">Analysis Results</h2>
          
          <!-- Overall Confidence Score -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-slate-700">Overall Confidence</span>
              <span class="text-sm font-bold text-slate-800">{{ Math.round(currentAnalysis.overallConfidence * 100) }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="h-2 rounded-full transition-all duration-500"
                :class="getConfidenceColor(currentAnalysis.overallConfidence)"
                :style="{ width: `${currentAnalysis.overallConfidence * 100}%` }"
              ></div>
            </div>
          </div>

          <!-- Detected Conditions -->
          <div class="space-y-4">
            <h3 class="text-md font-semibold text-slate-800">Detected Conditions</h3>
            
            <div
              v-for="condition in currentAnalysis.detectedConditions"
              :key="condition.id"
              class="p-4 rounded-lg border"
              :class="getSeverityBorderColor(condition.severity)"
            >
              <div class="flex items-start justify-between mb-2">
                <div>
                  <h4 class="font-medium text-slate-800">{{ condition.name }}</h4>
                  <p class="text-sm text-slate-600">{{ condition.description }}</p>
                </div>
                <div class="text-right">
                  <span 
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    :class="getSeverityClasses(condition.severity)"
                  >
                    {{ condition.severity }}
                  </span>
                  <div class="text-xs text-slate-500 mt-1">{{ Math.round(condition.confidence * 100) }}% confident</div>
                </div>
              </div>
              
              <!-- Confidence Bar -->
              <div class="mt-3">
                <div class="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    class="h-1.5 rounded-full transition-all duration-500"
                    :class="getConfidenceColor(condition.confidence)"
                    :style="{ width: `${condition.confidence * 100}%` }"
                  ></div>
                </div>
              </div>
              
              <!-- Affected Areas -->
              <div v-if="condition.affectedAreas" class="mt-3">
                <p class="text-xs text-slate-600 mb-1">Affected Areas:</p>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="area in condition.affectedAreas"
                    :key="area"
                    class="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs"
                  >
                    {{ area }}
                  </span>
                </div>
              </div>
            </div>
            
            <div v-if="currentAnalysis.detectedConditions.length === 0" class="text-center py-4">
              <svg class="w-12 h-12 text-green-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-slate-600">No concerning conditions detected</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recommendations and Actions -->
      <div class="space-y-6">
        <!-- AI Recommendations -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-lg font-semibold text-slate-800 mb-4">AI Recommendations</h2>
          
          <div class="space-y-4">
            <div
              v-for="recommendation in currentAnalysis.recommendations"
              :key="recommendation.id"
              class="p-4 rounded-lg"
              :class="getRecommendationClasses(recommendation.priority)"
            >
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                  <svg v-if="recommendation.priority === 'High'" class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <svg v-else-if="recommendation.priority === 'Medium'" class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <svg v-else class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                
                <div class="flex-1">
                  <h4 class="font-medium text-slate-800">{{ recommendation.title }}</h4>
                  <p class="text-sm text-slate-600 mt-1">{{ recommendation.description }}</p>
                  
                  <div v-if="recommendation.suggestedActions" class="mt-3">
                    <p class="text-xs font-medium text-slate-700 mb-2">Suggested Actions:</p>
                    <ul class="text-xs text-slate-600 space-y-1">
                      <li
                        v-for="action in recommendation.suggestedActions"
                        :key="action"
                        class="flex items-start"
                      >
                        <span class="text-slate-400 mr-2">•</span>
                        <span>{{ action }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <span 
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  :class="getPriorityClasses(recommendation.priority)"
                >
                  {{ recommendation.priority }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Treatment Plan Generator -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-lg font-semibold text-slate-800 mb-4">Treatment Plan Generator</h2>
          
          <div class="space-y-4">
            <p class="text-sm text-slate-600">Generate a comprehensive treatment plan based on AI analysis results.</p>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Treatment Urgency</label>
                <select 
                  v-model="treatmentPlan.urgency"
                  class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="Immediate">Immediate</option>
                  <option value="Urgent">Urgent (within 1 week)</option>
                  <option value="Routine">Routine (within 1 month)</option>
                  <option value="Monitoring">Monitoring only</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Follow-up Required</label>
                <select 
                  v-model="treatmentPlan.followUpType"
                  class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="None">No follow-up needed</option>
                  <option value="1 week">1 week follow-up</option>
                  <option value="2 weeks">2 weeks follow-up</option>
                  <option value="1 month">1 month follow-up</option>
                  <option value="3 months">3 months follow-up</option>
                </select>
              </div>
            </div>
            
            <div class="flex items-center space-x-3 pt-4 border-t border-gray-200">
              <button 
                @click="generateTreatmentPlan"
                class="bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Generate Plan
              </button>
              
              <button 
                @click="saveAnalysis"
                class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save Analysis
              </button>
              
              <button 
                @click="shareWithPatient"
                class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                Share
              </button>
            </div>
          </div>
        </div>

        <!-- Analysis Notes -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-lg font-semibold text-slate-800 mb-4">Clinical Notes</h2>
          
          <textarea
            v-model="analysisNotes"
            placeholder="Add your clinical observations and notes about this AI analysis..."
            rows="4"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          ></textarea>
          
          <div class="mt-3 flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <label class="flex items-center space-x-2">
                <input 
                  v-model="addToClinicalRecord"
                  type="checkbox"
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                >
                <span class="text-sm text-slate-700">Add to clinical record</span>
              </label>
            </div>
            
            <button 
              @click="saveNotes"
              class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
            >
              Save Notes
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- No Analysis State -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
      <div class="text-center">
        <svg class="w-20 h-20 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <h3 class="text-xl font-medium text-slate-800 mb-2">AI Diagnostics Ready</h3>
        <p class="text-slate-600 mb-6">Upload a dental photo to start AI-powered analysis and get diagnostic insights.</p>
        
        <button 
          @click="uploadPhoto"
          class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center mx-auto"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Start Analysis
        </button>
      </div>
    </div>

    <!-- File Upload Input -->
    <input 
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileUpload"
    >
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'AIDiagnostics',
  emits: ['show-toast', 'show-error', 'show-success'],
  setup(props, { emit }) {
    const router = useRouter()
    const authStore = useAuthStore()
    
    // ==========================================
    // REACTIVE STATE
    // ==========================================
    
    const currentAnalysis = ref(null)
    const isAnalyzing = ref(false)
    const analysisNotes = ref('')
    const addToClinicalRecord = ref(true)
    
    const treatmentPlan = ref({
      urgency: 'Routine',
      followUpType: 'None'
    })
    
    // Mock analysis data
    const mockAnalysis = ref({
      id: 'analysis_001',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop',
      filename: 'dental_xray_001.jpg',
      patientName: 'John Smith',
      analyzedAt: new Date(),
      modelVersion: 'DentalAI v2.1',
      overallConfidence: 0.87,
      annotations: [
        {
          id: 1,
          label: 'Cavity detected',
          x: 45,
          y: 30,
          width: 15,
          height: 12
        }
      ],
      detectedConditions: [
        {
          id: 1,
          name: 'Dental Caries (Cavity)',
          description: 'Tooth decay detected in upper right molar',
          severity: 'Moderate',
          confidence: 0.89,
          affectedAreas: ['Tooth #3', 'Occlusal surface']
        },
        {
          id: 2,
          name: 'Gingivitis',
          description: 'Mild gum inflammation detected',
          severity: 'Mild',
          confidence: 0.73,
          affectedAreas: ['Upper gums', 'Posterior region']
        }
      ],
      recommendations: [
        {
          id: 1,
          title: 'Cavity Treatment Required',
          description: 'Recommend immediate filling for detected cavity to prevent further decay.',
          priority: 'High',
          suggestedActions: [
            'Schedule cavity filling appointment',
            'Consider local anesthesia',
            'Post-treatment care instructions'
          ]
        },
        {
          id: 2,
          title: 'Improved Oral Hygiene',
          description: 'Recommend enhanced oral hygiene routine to address mild gingivitis.',
          priority: 'Medium',
          suggestedActions: [
            'Twice daily brushing with fluoride toothpaste',
            'Daily flossing',
            'Antibacterial mouthwash'
          ]
        }
      ]
    })
    
    // ==========================================
    // COMPUTED PROPERTIES
    // ==========================================
    
    const userRole = computed(() => authStore.user?.role)
    
    // ==========================================
    // METHODS
    // ==========================================
    
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    const getConfidenceColor = (confidence) => {
      if (confidence >= 0.8) return 'bg-green-500'
      if (confidence >= 0.6) return 'bg-yellow-500'
      return 'bg-red-500'
    }
    
    const getSeverityClasses = (severity) => {
      switch (severity) {
        case 'Severe':
          return 'bg-red-100 text-red-800'
        case 'Moderate':
          return 'bg-yellow-100 text-yellow-800'
        case 'Mild':
          return 'bg-green-100 text-green-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }
    
    const getSeverityBorderColor = (severity) => {
      switch (severity) {
        case 'Severe':
          return 'border-red-200 bg-red-50'
        case 'Moderate':
          return 'border-yellow-200 bg-yellow-50'
        case 'Mild':
          return 'border-green-200 bg-green-50'
        default:
          return 'border-gray-200 bg-gray-50'
      }
    }
    
    const getPriorityClasses = (priority) => {
      switch (priority) {
        case 'High':
          return 'bg-red-100 text-red-800'
        case 'Medium':
          return 'bg-yellow-100 text-yellow-800'
        case 'Low':
          return 'bg-blue-100 text-blue-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }
    
    const getRecommendationClasses = (priority) => {
      switch (priority) {
        case 'High':
          return 'bg-red-50 border border-red-200'
        case 'Medium':
          return 'bg-yellow-50 border border-yellow-200'
        case 'Low':
          return 'bg-blue-50 border border-blue-200'
        default:
          return 'bg-gray-50 border border-gray-200'
      }
    }
    
    const getAnnotationStyle = (annotation) => {
      return {
        left: `${annotation.x}%`,
        top: `${annotation.y}%`,
        width: `${annotation.width}%`,
        height: `${annotation.height}%`
      }
    }
    
    // File handling methods
    const uploadPhoto = () => {
      const fileInput = document.querySelector('input[type="file"]')
      fileInput.click()
    }
    
    const handleFileUpload = async (event) => {
      const file = event.target.files[0]
      if (!file) return
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        emit('show-error', 'Please select a valid image file')
        return
      }
      
      isAnalyzing.value = true
      
      try {
        // TODO: Replace with actual AI analysis API call
        // const formData = new FormData()
        // formData.append('image', file)
        // const response = await api.post('/ai/analyze-image', formData)
        
        // Simulate analysis delay
        await new Promise(resolve => setTimeout(resolve, 3000))
        
        // Mock analysis result
        currentAnalysis.value = {
          ...mockAnalysis.value,
          filename: file.name,
          imageUrl: URL.createObjectURL(file),
          analyzedAt: new Date()
        }
        
        emit('show-success', 'Image analyzed successfully')
        
      } catch (error) {
        console.error('Analysis error:', error)
        emit('show-error', 'Failed to analyze image')
      } finally {
        isAnalyzing.value = false
        event.target.value = '' // Reset file input
      }
    }
    
    // Action methods
    const generateTreatmentPlan = async () => {
      try {
        // TODO: Implement treatment plan generation API call
        // const response = await api.post('/ai/generate-treatment-plan', {
        //   analysisId: currentAnalysis.value.id,
        //   urgency: treatmentPlan.value.urgency,
        //   followUpType: treatmentPlan.value.followUpType
        // })
        
        emit('show-success', 'Treatment plan generated successfully')
        router.push('/doctor-secretary/task-templates')
        
      } catch (error) {
        console.error('Treatment plan generation error:', error)
        emit('show-error', 'Failed to generate treatment plan')
      }
    }
    
    const saveAnalysis = async () => {
      try {
        // TODO: Save analysis to patient record
        // await api.post('/ai/save-analysis', {
        //   analysisId: currentAnalysis.value.id,
        //   patientId: currentAnalysis.value.patientId,
        //   notes: analysisNotes.value,
        //   addToClinicalRecord: addToClinicalRecord.value
        // })
        
        emit('show-success', 'Analysis saved to patient record')
        
      } catch (error) {
        console.error('Save analysis error:', error)
        emit('show-error', 'Failed to save analysis')
      }
    }
    
    const shareWithPatient = async () => {
      try {
        // TODO: Share analysis with patient
        // await api.post('/ai/share-analysis', {
        //   analysisId: currentAnalysis.value.id,
        //   patientId: currentAnalysis.value.patientId,
        //   includeRecommendations: true
        // })
        
        emit('show-success', 'Analysis shared with patient')
        
      } catch (error) {
        console.error('Share analysis error:', error)
        emit('show-error', 'Failed to share analysis')
      }
    }
    
    const saveNotes = async () => {
      try {
        // TODO: Save clinical notes
        // await api.post('/clinical-notes', {
        //   patientId: currentAnalysis.value.patientId,
        //   content: analysisNotes.value,
        //   type: 'AI Analysis',
        //   analysisId: currentAnalysis.value.id
        // })
        
        emit('show-success', 'Notes saved successfully')
        
      } catch (error) {
        console.error('Save notes error:', error)
        emit('show-error', 'Failed to save notes')
      }
    }
    
    const viewAnalysisHistory = () => {
      // TODO: Implement analysis history view
      emit('show-success', 'Analysis history feature coming soon')
    }
    
    // Demo method to load mock analysis
    const loadMockAnalysis = () => {
      currentAnalysis.value = mockAnalysis.value
    }
    
    // ==========================================
    // LIFECYCLE
    // ==========================================
    
    onMounted(() => {
      // For demo purposes, load mock analysis
      // Remove this in production
      setTimeout(() => {
        loadMockAnalysis()
      }, 1000)
    })
    
    // ==========================================
    // RETURN FOR TEMPLATE
    // ==========================================
    
    return {
      // State
      currentAnalysis,
      isAnalyzing,
      analysisNotes,
      addToClinicalRecord,
      treatmentPlan,
      
      // Computed
      userRole,
      
      // Methods
      formatDate,
      getConfidenceColor,
      getSeverityClasses,
      getSeverityBorderColor,
      getPriorityClasses,
      getRecommendationClasses,
      getAnnotationStyle,
      uploadPhoto,
      handleFileUpload,
      generateTreatmentPlan,
      saveAnalysis,
      shareWithPatient,
      saveNotes,
      viewAnalysisHistory,
      loadMockAnalysis
    }
  }
}
</script>

<style scoped>
/* Hover effects */
.hover\\:bg-purple-700:hover {
  background-color: #7c3aed;
}

.hover\\:bg-gray-200:hover {
  background-color: #e5e7eb;
}

.hover\\:bg-secondary-700:hover {
  background-color: #047857;
}

.hover\\:bg-primary-700:hover {
  background-color: #0052a3;
}

.hover\\:bg-blue-700:hover {
  background-color: #1d4ed8;
}

/* Transition effects */
.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Custom color classes */
.bg-purple-600 { background-color: #9333ea; }
.bg-purple-700 { background-color: #7c3aed; }
.bg-primary-600 { background-color: #0066CC; }
.bg-primary-700 { background-color: #0052a3; }
.bg-secondary-600 { background-color: #00A86B; }
.bg-secondary-700 { background-color: #047857; }
.bg-blue-600 { background-color: #2563eb; }
.bg-blue-700 { background-color: #1d4ed8; }

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

/* Grid responsive */
.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

@media (min-width: 1024px) {
  .lg\\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* Animation */
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

/* Hidden utility */
.hidden {
  display: none;
}

/* Object fit utilities */
.object-cover {
  object-fit: cover;
}

/* Position utilities */
.absolute {
  position: absolute;
}

.relative {
  position: relative;
}

/* Flexbox utilities */
.flex {
  display: flex;
}

.flex-shrink-0 {
  flex-shrink: 0;
}

.flex-1 {
  flex: 1 1 0%;
}

.items-center {
  align-items: center;
}

.items-start {
  align-items: flex-start;
}

.justify-between {
  justify-content: space-between;
}

.space-x-3 > :not([hidden]) ~ :not([hidden]) {
  margin-left: 0.75rem;
}

/* Text utilities */
.text-center {
  text-align: center;
}

.whitespace-nowrap {
  white-space: nowrap;
}

/* Spacing utilities */
.space-y-4 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 1rem;
}

.space-y-6 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 1.5rem;
}

/* Width and height utilities */
.w-full {
  width: 100%;
}

.h-2 {
  height: 0.5rem;
}

.h-1\.5 {
  height: 0.375rem;
}

/* Background utilities */
.bg-opacity-20 {
  background-color: rgba(239, 68, 68, 0.2);
}

.bg-opacity-50 {
  background-color: rgba(0, 0, 0, 0.5);
}

/* Border utilities */
.border-2 {
  border-width: 2px;
}

.border-red-500 {
  border-color: #ef4444;
}

.rounded-full {
  border-radius: 9999px;
}

/* Text color utilities */
.text-red-500 {
  color: #ef4444;
}

.text-white {
  color: #ffffff;
}

.text-red-600 {
  color: #dc2626;
}

.text-yellow-600 {
  color: #d97706;
}

.text-blue-600 {
  color: #2563eb;
}

/* Checkbox styling */
input[type="checkbox"] {
  border-radius: 0.25rem;
}

input[type="checkbox"]:checked {
  background-color: #0066CC;
  border-color: #0066CC;
}

input[type="checkbox"]:focus {
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}
</style>
<!--
  AI Configuration Component
  
  AI model configuration interface with:
  - Model selection (OpenAI/DeepSeek)
  - Response parameter tuning
  - API key management
  - Performance monitoring
  - Test interface
-->
<template>
  <div class="p-4 space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">AI Model Configuration</h1>
          <p class="text-slate-600">Configure AI models for treatment plan generation and analysis</p>
        </div>
        <div class="flex items-center space-x-3">
          <button 
            @click="testConfiguration"
            :disabled="isTesting"
            class="bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <svg v-if="isTesting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Test Configuration
          </button>
          <button 
            @click="saveConfiguration"
            :disabled="isSaving"
            class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Save Configuration
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Left Column: Model Selection & API Configuration -->
      <div class="space-y-6">
        <!-- Model Selection -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-lg font-semibold text-slate-800 mb-4">Model Selection</h2>
          
          <div class="space-y-4">
            <!-- Primary Model -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Primary AI Model</label>
              <select
                v-model="config.primaryModel"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                @change="updateModelConfig"
              >
                <option value="openai-gpt4">OpenAI GPT-4</option>
                <option value="openai-gpt35">OpenAI GPT-3.5 Turbo</option>
                <option value="deepseek-chat">DeepSeek Chat</option>
                <option value="deepseek-coder">DeepSeek Coder</option>
              </select>
            </div>

            <!-- Fallback Model -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Fallback Model</label>
              <select
                v-model="config.fallbackModel"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="openai-gpt35">OpenAI GPT-3.5 Turbo</option>
                <option value="deepseek-chat">DeepSeek Chat</option>
                <option value="openai-gpt4">OpenAI GPT-4</option>
              </select>
            </div>

            <!-- Model Status -->
            <div class="p-4 bg-gray-50 rounded-lg">
              <h3 class="text-sm font-medium text-slate-700 mb-2">Model Status</h3>
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-slate-600">Primary Model</span>
                  <div class="flex items-center space-x-2">
                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span class="text-xs text-slate-500">Online</span>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-slate-600">Fallback Model</span>
                  <div class="flex items-center space-x-2">
                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span class="text-xs text-slate-500">Online</span>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-slate-600">Response Time</span>
                  <span class="text-xs text-slate-500">{{ modelPerformance.avgResponseTime }}ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- API Configuration -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-lg font-semibold text-slate-800 mb-4">API Configuration</h2>
          
          <div class="space-y-4">
            <!-- OpenAI API Key -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">OpenAI API Key</label>
              <div class="relative">
                <input
                  v-model="config.openaiApiKey"
                  :type="showOpenAIKey ? 'text' : 'password'"
                  placeholder="sk-..."
                  class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                <button
                  @click="showOpenAIKey = !showOpenAIKey"
                  class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <svg v-if="showOpenAIKey" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- DeepSeek API Key -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">DeepSeek API Key</label>
              <div class="relative">
                <input
                  v-model="config.deepseekApiKey"
                  :type="showDeepSeekKey ? 'text' : 'password'"
                  placeholder="sk-..."
                  class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                <button
                  @click="showDeepSeekKey = !showDeepSeekKey"
                  class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <svg v-if="showDeepSeekKey" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- API Settings -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Request Timeout (ms)</label>
                <input
                  v-model.number="config.requestTimeout"
                  type="number"
                  min="1000"
                  max="60000"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Max Retries</label>
                <input
                  v-model.number="config.maxRetries"
                  type="number"
                  min="0"
                  max="5"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Response Parameters & Testing -->
      <div class="space-y-6">
        <!-- Response Parameters -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-lg font-semibold text-slate-800 mb-4">Response Parameters</h2>
          
          <div class="space-y-4">
            <!-- Temperature -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Temperature: {{ config.temperature }}
              </label>
              <input
                v-model.number="config.temperature"
                type="range"
                min="0"
                max="2"
                step="0.1"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              >
              <div class="flex justify-between text-xs text-slate-500 mt-1">
                <span>Focused (0.0)</span>
                <span>Balanced (1.0)</span>
                <span>Creative (2.0)</span>
              </div>
            </div>

            <!-- Max Tokens -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Max Tokens</label>
              <input
                v-model.number="config.maxTokens"
                type="number"
                min="100"
                max="4000"
                step="100"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
              <p class="text-xs text-slate-500 mt-1">Maximum length of the AI response</p>
            </div>

            <!-- Top P -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Top P: {{ config.topP }}
              </label>
              <input
                v-model.number="config.topP"
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              >
              <div class="flex justify-between text-xs text-slate-500 mt-1">
                <span>Narrow (0.1)</span>
                <span>Diverse (1.0)</span>
              </div>
            </div>

            <!-- Frequency Penalty -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Frequency Penalty: {{ config.frequencyPenalty }}
              </label>
              <input
                v-model.number="config.frequencyPenalty"
                type="range"
                min="0"
                max="2"
                step="0.1"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              >
              <div class="flex justify-between text-xs text-slate-500 mt-1">
                <span>Allow Repetition (0.0)</span>
                <span>Reduce Repetition (2.0)</span>
              </div>
            </div>

            <!-- Presence Penalty -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                Presence Penalty: {{ config.presencePenalty }}
              </label>
              <input
                v-model.number="config.presencePenalty"
                type="range"
                min="0"
                max="2"
                step="0.1"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              >
              <div class="flex justify-between text-xs text-slate-500 mt-1">
                <span>Stay on Topic (0.0)</span>
                <span>Explore Topics (2.0)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Test Interface -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-lg font-semibold text-slate-800 mb-4">Test Interface</h2>
          
          <div class="space-y-4">
            <!-- Test Input -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Test Prompt</label>
              <textarea
                v-model="testPrompt"
                rows="4"
                placeholder="Enter a test prompt to evaluate AI response..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              ></textarea>
            </div>

            <!-- Test Button -->
            <button
              @click="runTest"
              :disabled="isTesting || !testPrompt.trim()"
              class="w-full bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <svg v-if="isTesting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isTesting ? 'Testing...' : 'Run Test' }}
            </button>

            <!-- Test Results -->
            <div v-if="testResult" class="space-y-3">
              <div class="p-4 bg-gray-50 rounded-lg">
                <h4 class="text-sm font-medium text-slate-700 mb-2">AI Response</h4>
                <p class="text-sm text-slate-600">{{ testResult.response }}</p>
              </div>
              
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div class="p-3 bg-blue-50 rounded-lg">
                  <span class="text-blue-600 font-medium">Response Time</span>
                  <p class="text-blue-800">{{ testResult.responseTime }}ms</p>
                </div>
                <div class="p-3 bg-green-50 rounded-lg">
                  <span class="text-green-600 font-medium">Tokens Used</span>
                  <p class="text-green-800">{{ testResult.tokensUsed }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance Monitoring -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 class="text-lg font-semibold text-slate-800 mb-4">Performance Monitoring</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-blue-600 font-medium">Total Requests</p>
              <p class="text-2xl font-bold text-blue-800">{{ modelPerformance.totalRequests }}</p>
            </div>
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>

        <div class="p-4 bg-green-50 rounded-lg border border-green-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-green-600 font-medium">Success Rate</p>
              <p class="text-2xl font-bold text-green-800">{{ modelPerformance.successRate }}%</p>
            </div>
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div class="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-yellow-600 font-medium">Avg Response Time</p>
              <p class="text-2xl font-bold text-yellow-800">{{ modelPerformance.avgResponseTime }}ms</p>
            </div>
            <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div class="p-4 bg-purple-50 rounded-lg border border-purple-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-purple-600 font-medium">Total Tokens</p>
              <p class="text-2xl font-bold text-purple-800">{{ formatNumber(modelPerformance.totalTokens) }}</p>
            </div>
            <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="mt-6">
        <h3 class="text-sm font-medium text-slate-700 mb-3">Recent API Activity</h3>
        <div class="space-y-2">
          <div
            v-for="activity in recentActivity"
            :key="activity.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <div 
                class="w-2 h-2 rounded-full"
                :class="activity.status === 'success' ? 'bg-green-500' : 'bg-red-500'"
              ></div>
              <span class="text-sm text-slate-700">{{ activity.action }}</span>
            </div>
            <div class="text-right">
              <p class="text-xs text-slate-500">{{ formatTimeAgo(activity.timestamp) }}</p>
              <p class="text-xs text-slate-400">{{ activity.responseTime }}ms</p>
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
  name: 'AIConfiguration',
  emits: ['show-toast', 'show-error', 'show-success'],
  setup(props, { emit }) {
    const router = useRouter()
    
    // ==========================================
    // REACTIVE STATE
    // ==========================================
    
    const isSaving = ref(false)
    const isTesting = ref(false)
    const showOpenAIKey = ref(false)
    const showDeepSeekKey = ref(false)
    const testPrompt = ref('Generate a treatment plan for a patient with tooth pain and sensitivity.')
    const testResult = ref(null)
    
    // AI Configuration
    const config = ref({
      primaryModel: 'openai-gpt4',
      fallbackModel: 'openai-gpt35',
      openaiApiKey: '',
      deepseekApiKey: '',
      requestTimeout: 30000,
      maxRetries: 3,
      temperature: 0.7,
      maxTokens: 2000,
      topP: 0.9,
      frequencyPenalty: 0.0,
      presencePenalty: 0.0
    })
    
    // Performance monitoring data
    const modelPerformance = ref({
      totalRequests: 1847,
      successRate: 97.3,
      avgResponseTime: 1247,
      totalTokens: 2847593
    })
    
    // Recent activity
    const recentActivity = ref([
      {
        id: 1,
        action: 'Treatment plan generation',
        status: 'success',
        responseTime: 1150,
        timestamp: new Date(Date.now() - 5 * 60 * 1000)
      },
      {
        id: 2,
        action: 'Patient assessment analysis',
        status: 'success',
        responseTime: 890,
        timestamp: new Date(Date.now() - 12 * 60 * 1000)
      },
      {
        id: 3,
        action: 'Treatment recommendation',
        status: 'error',
        responseTime: 0,
        timestamp: new Date(Date.now() - 18 * 60 * 1000)
      },
      {
        id: 4,
        action: 'Symptom evaluation',
        status: 'success',
        responseTime: 1420,
        timestamp: new Date(Date.now() - 25 * 60 * 1000)
      }
    ])
    
    // ==========================================
    // METHODS
    // ==========================================
    
    const formatNumber = (num) => {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M'
      }
      if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K'
      }
      return num.toString()
    }
    
    const formatTimeAgo = (date) => {
      const now = new Date()
      const diffMs = now - new Date(date)
      const diffMins = Math.floor(diffMs / (1000 * 60))
      
      if (diffMins < 60) {
        return `${diffMins} min ago`
      } else {
        const diffHours = Math.floor(diffMins / 60)
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
      }
    }
    
    const updateModelConfig = () => {
      // Update model-specific configurations
      console.log('Model configuration updated:', config.value.primaryModel)
    }
    
    const saveConfiguration = async () => {
      isSaving.value = true
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // TODO: Implement actual API call to save configuration
        emit('show-success', 'AI configuration saved successfully')
        
      } catch (error) {
        console.error('Error saving configuration:', error)
        emit('show-error', 'Failed to save AI configuration')
      } finally {
        isSaving.value = false
      }
    }
    
    const testConfiguration = async () => {
      if (!testPrompt.value.trim()) {
        emit('show-error', 'Please enter a test prompt')
        return
      }
      
      await runTest()
    }
    
    const runTest = async () => {
      isTesting.value = true
      testResult.value = null
      
      try {
        const startTime = Date.now()
        
        // Simulate AI API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        const endTime = Date.now()
        const responseTime = endTime - startTime
        
        // Mock AI response
        testResult.value = {
          response: 'Based on the symptoms of tooth pain and sensitivity, I recommend a comprehensive dental examination including X-rays to determine the underlying cause. Initial treatment may include fluoride application for sensitivity and pain management. If decay is present, a filling or crown may be necessary. For severe cases, root canal therapy might be required.',
          responseTime,
          tokensUsed: Math.floor(Math.random() * 200) + 150
        }
        
        emit('show-success', 'Test completed successfully')
        
      } catch (error) {
        console.error('Error running test:', error)
        emit('show-error', 'Test failed - please check your configuration')
      } finally {
        isTesting.value = false
      }
    }
    
    // ==========================================
    // LIFECYCLE
    // ==========================================
    
    onMounted(() => {
      console.log('AI Configuration mounted')
      // Load current configuration
      // TODO: Implement API call to load existing configuration
    })
    
    // ==========================================
    // RETURN FOR TEMPLATE
    // ==========================================
    
    return {
      // State
      isSaving,
      isTesting,
      showOpenAIKey,
      showDeepSeekKey,
      testPrompt,
      testResult,
      config,
      modelPerformance,
      recentActivity,
      
      // Methods
      formatNumber,
      formatTimeAgo,
      updateModelConfig,
      saveConfiguration,
      testConfiguration,
      runTest
    }
  }
}
</script>

<style scoped>
/* Custom range slider styling */
input[type="range"] {
  background: transparent;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-track {
  background: #e2e8f0;
  height: 8px;
  border-radius: 4px;
}

input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  background: #0066CC;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  cursor: pointer;
}

input[type="range"]::-moz-range-track {
  background: #e2e8f0;
  height: 8px;
  border-radius: 4px;
  border: none;
}

input[type="range"]::-moz-range-thumb {
  background: #0066CC;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

/* Animate spinner */
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

/* Transition effects */
.transition-colors {
  transition-property: color, background-color, border-color;
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
</style>
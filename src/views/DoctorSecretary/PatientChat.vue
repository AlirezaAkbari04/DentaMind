<!-- Doctor-Secretary Chat Interface Component -->
<template>
  <!-- Full-Screen Chat Modal -->
  <div class="fixed inset-0 bg-white z-50 flex flex-col">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <button 
          @click="$router.go(-1)"
          class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg class="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <span class="text-primary-600 font-semibold">{{ currentPatient.initials }}</span>
          </div>
          <div>
            <h1 class="text-lg font-semibold text-slate-800">{{ currentPatient.name }}</h1>
            <p class="text-sm text-slate-500">
              {{ currentPatient.age }} years • Last visit: {{ formatDate(currentPatient.lastVisit) }}
            </p>
          </div>
        </div>
      </div>
      
      <!-- Patient Actions -->
      <div class="flex items-center space-x-2">
        <button
          @click="viewPatientProfile"
          class="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          title="View Patient Profile"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </button>
        <button
          @click="viewMedicalHistory"
          class="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          title="Medical History"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </button>
        <button
          @click="scheduleAppointment"
          class="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          title="Schedule Appointment"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-1 12a2 2 0 002 2h6a2 2 0 002-2L13 7"></path>
          </svg>
        </button>
        <div class="w-px h-6 bg-gray-300"></div>
        <span 
          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
          :class="getPriorityClass(conversationPriority)"
        >
          {{ conversationPriority }} Priority
        </span>
      </div>
    </header>

    <!-- Patient Info Bar (Collapsible) -->
    <div v-if="showPatientInfo" class="bg-blue-50 border-b border-blue-200 px-4 py-3">
      <div class="flex items-start justify-between">
        <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span class="font-medium text-slate-700">Contact:</span>
            <div class="text-slate-600">{{ currentPatient.phone }}</div>
            <div class="text-slate-600">{{ currentPatient.email }}</div>
          </div>
          <div>
            <span class="font-medium text-slate-700">Insurance:</span>
            <div class="text-slate-600">{{ currentPatient.insurance }}</div>
          </div>
          <div>
            <span class="font-medium text-slate-700">Allergies:</span>
            <div class="text-slate-600">{{ currentPatient.allergies || 'None reported' }}</div>
          </div>
        </div>
        <button 
          @click="showPatientInfo = false"
          class="p-1 text-blue-600 hover:text-blue-800"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Messages Area -->
    <main class="flex-1 overflow-hidden flex flex-col">
      <!-- AI Analysis Alert (if present) -->
      <div v-if="aiAnalysis" class="bg-yellow-50 border-b border-yellow-200 p-4">
        <div class="flex items-start space-x-3">
          <svg class="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"></path>
          </svg>
          <div class="flex-1">
            <h4 class="text-sm font-medium text-yellow-800">AI Analysis Available</h4>
            <p class="text-sm text-yellow-700 mt-1">{{ aiAnalysis }}</p>
          </div>
          <button 
            @click="aiAnalysis = null"
            class="p-1 text-yellow-600 hover:text-yellow-800"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Chat Messages -->
      <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
        <!-- Welcome Message -->
        <div v-if="messages.length === 0" class="text-center py-8">
          <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-slate-800 mb-2">
            Chat with {{ currentPatient.name }}
          </h3>
          <p class="text-slate-600">
            Start a conversation to address their concerns or questions.
          </p>
        </div>

        <!-- Message List -->
        <div
          v-for="message in messages"
          :key="message.id"
          class="flex"
          :class="message.sender === 'doctor' ? 'justify-end' : 'justify-start'"
        >
          <div class="max-w-xs lg:max-w-md">
            <!-- Sender Avatar (for patient messages) -->
            <div v-if="message.sender === 'patient'" class="flex items-center space-x-2 mb-1">
              <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <span class="text-xs text-slate-500">{{ currentPatient.name }}</span>
              <span v-if="message.urgent" class="text-xs text-red-600 font-medium">URGENT</span>
            </div>

            <!-- Message Bubble -->
            <div class="message-bubble" :class="getMessageClass(message.sender)">
              <!-- Image Preview -->
              <div v-if="message.image" class="mb-2">
                <img 
                  :src="message.image" 
                  alt="Patient uploaded image" 
                  class="rounded-lg max-w-full h-auto cursor-pointer" 
                  @click="openImageViewer(message.image)"
                />
                <button 
                  v-if="message.sender === 'patient' && !message.analyzed"
                  @click="analyzeImage(message)"
                  class="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  Request AI Analysis
                </button>
              </div>
              
              <!-- Problem Report Display -->
              <div v-if="message.problemReport" class="mb-2 p-2 bg-red-50 rounded border border-red-200">
                <div class="text-xs font-medium text-red-800 mb-1">Problem Report</div>
                <div class="text-xs text-red-700 space-y-1">
                  <div><strong>Type:</strong> {{ message.problemReport.type }}</div>
                  <div><strong>Pain Level:</strong> {{ message.problemReport.painLevel }}/10</div>
                  <div><strong>Symptoms:</strong> {{ message.problemReport.description }}</div>
                </div>
              </div>
              
              <!-- Message Text -->
              <p class="text-sm">{{ message.text }}</p>
              
              <!-- Message Time and Status -->
              <div class="flex justify-between items-center mt-2">
                <span class="text-xs opacity-70">{{ formatTime(message.timestamp) }}</span>
                <div v-if="message.sender === 'doctor'" class="flex items-center space-x-1">
                  <svg v-if="message.status === 'sent'" class="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <svg v-else-if="message.status === 'delivered'" class="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <svg v-else-if="message.status === 'read'" class="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div v-if="patientTyping" class="flex justify-start">
          <div class="bg-gray-100 rounded-lg px-4 py-3">
            <div class="flex items-center space-x-2">
              <span class="text-xs text-slate-500">{{ currentPatient.name }} is typing</span>
              <div class="flex space-x-1">
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Input Area -->
    <footer class="border-t border-gray-200 p-4 bg-white">
      <!-- Quick Actions -->
      <div class="flex flex-wrap gap-2 mb-3">
        <button
          @click="insertTemplate('followup')"
          class="action-btn"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-1 12a2 2 0 002 2h6a2 2 0 002-2L13 7"></path>
          </svg>
          <span>Schedule Follow-up</span>
        </button>
        
        <button
          @click="insertTemplate('instructions')"
          class="action-btn"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          <span>Care Instructions</span>
        </button>

        <button
          @click="showTemplatesModal = true"
          class="action-btn"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
          </svg>
          <span>Quick Replies</span>
        </button>

        <button
          @click="assignTask"
          class="action-btn"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
          </svg>
          <span>Assign Task</span>
        </button>

        <button
          @click="markAsUrgent"
          :class="conversationPriority === 'High' ? 'action-btn-active' : 'action-btn'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <span>{{ conversationPriority === 'High' ? 'Urgent' : 'Mark Urgent' }}</span>
        </button>
      </div>

      <!-- Message Input -->
      <div class="flex space-x-2">
        <div class="flex-1 relative">
          <textarea
            ref="messageInput"
            v-model="newMessage"
            @keypress.enter.prevent="sendMessage"
            @keydown.shift.enter="addNewLine"
            rows="1"
            placeholder="Type your response..."
            class="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            :disabled="isTyping"
            style="min-height: 48px; max-height: 120px;"
          ></textarea>
          
          <!-- Character count and attachment -->
          <div class="absolute right-3 bottom-3 flex items-center space-x-2">
            <span class="text-xs text-gray-400">{{ newMessage.length }}/1000</span>
            <button 
              @click="openAttachment"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <button
          @click="sendMessage"
          :disabled="!newMessage.trim() || isTyping"
          class="px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
        </button>
      </div>
    </footer>

    <!-- Quick Reply Templates Modal -->
    <div v-if="showTemplatesModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-slate-800">Quick Reply Templates</h3>
            <button @click="showTemplatesModal = false" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="space-y-3">
            <div 
              v-for="template in quickReplyTemplates"
              :key="template.id"
              @click="useTemplate(template.text)"
              class="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div class="font-medium text-slate-800 text-sm mb-1">{{ template.title }}</div>
              <div class="text-xs text-slate-600">{{ template.preview }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Viewer Modal -->
    <div v-if="viewingImage" class="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div class="relative max-w-4xl max-h-full">
        <button 
          @click="viewingImage = null"
          class="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <img :src="viewingImage" alt="Full size image" class="max-w-full max-h-full object-contain" />
      </div>
    </div>

    <!-- Patient Info Toggle -->
    <button 
      v-if="!showPatientInfo"
      @click="showPatientInfo = true"
      class="fixed top-20 right-4 p-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
      title="Show Patient Info"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    </button>
  </div>
</template>

<script>
import { ref, computed, nextTick, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'DoctorChatInterface',
  props: {
    patientId: {
      type: [String, Number],
      required: true
    }
  },
  setup(props) {
    const router = useRouter()
    
    // Reactive data
    const newMessage = ref('')
    const isTyping = ref(false)
    const patientTyping = ref(false)
    const messages = ref([])
    const messagesContainer = ref(null)
    const messageInput = ref(null)
    const showPatientInfo = ref(true)
    const showTemplatesModal = ref(false)
    const viewingImage = ref(null)
    const conversationPriority = ref('Medium')
    const aiAnalysis = ref(null)

    // Sample patient data - replace with API call
    const currentPatient = ref({
      id: props.patientId,
      name: 'Sarah Johnson',
      initials: 'SJ',
      age: 34,
      phone: '+1 (555) 123-4567',
      email: 'sarah.johnson@email.com',
      insurance: 'Blue Cross Blue Shield',
      allergies: 'Penicillin',
      lastVisit: new Date('2024-06-15')
    })

    // Quick reply templates
    const quickReplyTemplates = ref([
      {
        id: 1,
        title: 'Appointment Confirmation',
        text: 'Thank you for scheduling your appointment. We\'ll see you on [DATE] at [TIME]. Please arrive 15 minutes early.',
        preview: 'Confirm appointment with date and time'
      },
      {
        id: 2,
        title: 'Post-Procedure Care',
        text: 'Please follow these post-procedure instructions: avoid hard foods for 24 hours, rinse gently with salt water, and take prescribed medication as directed.',
        preview: 'Standard post-procedure care instructions'
      },
      {
        id: 3,
        title: 'Pain Management',
        text: 'For pain management, you can take over-the-counter pain relievers as directed. If pain persists or worsens, please contact our office immediately.',
        preview: 'Basic pain management advice'
      },
      {
        id: 4,
        title: 'Schedule Follow-up',
        text: 'Based on your treatment, we need to schedule a follow-up appointment in [TIMEFRAME]. Would you like me to check our available times?',
        preview: 'Request follow-up appointment scheduling'
      },
      {
        id: 5,
        title: 'Emergency Instructions',
        text: 'If this is a dental emergency outside office hours, please call our emergency line or visit the nearest hospital emergency room.',
        preview: 'Emergency contact information'
      }
    ])

    // Sample messages - replace with API call
    const sampleMessages = ref([
      {
        id: 1,
        sender: 'patient',
        text: 'Hi Dr. Johnson, I\'ve been experiencing some sensitivity in my upper left molar since yesterday. The pain gets worse when I drink cold beverages.',
        timestamp: new Date(Date.now() - 3600000),
        urgent: false
      },
      {
        id: 2,
        sender: 'doctor',
        text: 'Hello Sarah, thank you for reaching out. Tooth sensitivity can have several causes. Can you tell me if you\'ve had any recent dental work done on that tooth?',
        timestamp: new Date(Date.now() - 3000000),
        status: 'read'
      },
      {
        id: 3,
        sender: 'patient',
        text: 'I had a filling replaced about two weeks ago. Could that be related?',
        timestamp: new Date(Date.now() - 2400000),
        urgent: false
      }
    ])

    // Methods
    const sendMessage = async () => {
      if (!newMessage.value.trim()) return

      const doctorMessage = {
        id: Date.now(),
        sender: 'doctor',
        text: newMessage.value.trim(),
        timestamp: new Date(),
        status: 'sent'
      }

      messages.value.push(doctorMessage)
      newMessage.value = ''

      // Auto-expand textarea back to single line
      nextTick(() => {
        if (messageInput.value) {
          messageInput.value.style.height = '48px'
        }
      })

      // Scroll to bottom
      await nextTick()
      scrollToBottom()

      // Simulate message delivery
      setTimeout(() => {
        doctorMessage.status = 'delivered'
      }, 1000)

      setTimeout(() => {
        doctorMessage.status = 'read'
      }, 3000)

      // TODO: Send actual API request
      console.log('Sending doctor message:', doctorMessage.text)
    }

    const addNewLine = () => {
      newMessage.value += '\n'
      // Auto-expand textarea
      nextTick(() => {
        if (messageInput.value) {
          messageInput.value.style.height = 'auto'
          messageInput.value.style.height = Math.min(messageInput.value.scrollHeight, 120) + 'px'
        }
      })
    }

    const insertTemplate = (type) => {
      let template = ''
      const currentDate = new Date().toLocaleDateString()
      
      switch (type) {
        case 'followup':
          template = `I'd like to schedule a follow-up appointment for you. When would be a convenient time for you to come in? We have availability next week.`
          break
        case 'instructions':
          template = `Here are some care instructions for you:\n\n• Brush gently with a soft-bristled toothbrush\n• Avoid very hot or cold foods/drinks\n• Rinse with salt water if needed\n• Contact us if symptoms worsen\n\nIs there anything specific you'd like me to explain?`
          break
      }
      
      if (newMessage.value) {
        newMessage.value += '\n\n' + template
      } else {
        newMessage.value = template
      }
      
      nextTick(() => messageInput.value?.focus())
    }

    const useTemplate = (templateText) => {
      newMessage.value = templateText
      showTemplatesModal.value = false
      nextTick(() => messageInput.value?.focus())
    }

    const assignTask = () => {
      // TODO: Open task assignment modal
      console.log('Assign task to patient:', currentPatient.value.name)
      router.push('/doctor-secretary/task-templates')
    }

    const markAsUrgent = () => {
      conversationPriority.value = conversationPriority.value === 'High' ? 'Medium' : 'High'
      console.log('Conversation priority changed to:', conversationPriority.value)
    }

    const viewPatientProfile = () => {
      // TODO: Navigate to patient profile or open in modal
      console.log('View patient profile:', currentPatient.value.name)
      router.push(`/doctor-secretary/patients/${currentPatient.value.id}`)
    }

    const viewMedicalHistory = () => {
      // TODO: Open medical history modal or navigate
      console.log('View medical history for:', currentPatient.value.name)
    }

    const scheduleAppointment = () => {
      // TODO: Open appointment scheduling modal
      console.log('Schedule appointment for:', currentPatient.value.name)
      router.push('/doctor-secretary/appointments')
    }

    const analyzeImage = (message) => {
      // TODO: Send image for AI analysis
      console.log('Analyzing image:', message.image)
      message.analyzed = true
      
      // Simulate AI analysis result
      setTimeout(() => {
        aiAnalysis.value = "AI Analysis: Image shows mild plaque buildup and slight gum inflammation around the upper left molar. Recommend professional cleaning and improved oral hygiene routine."
      }, 2000)
    }

    const openImageViewer = (imageUrl) => {
      viewingImage.value = imageUrl
    }

    const openAttachment = () => {
      // TODO: Implement file attachment
      console.log('Open attachment dialog')
    }

    const getMessageClass = (sender) => {
      if (sender === 'doctor') {
        return 'bg-primary-600 text-white rounded-lg px-4 py-3'
      } else {
        return 'bg-gray-100 text-slate-800 rounded-lg px-4 py-3'
      }
    }

    const getPriorityClass = (priority) => {
      const classes = {
        'High': 'bg-red-100 text-red-700',
        'Medium': 'bg-yellow-100 text-yellow-700',
        'Low': 'bg-green-100 text-green-700'
      }
      return classes[priority] || 'bg-gray-100 text-gray-700'
    }

    const formatTime = (timestamp) => {
      return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const formatDate = (date) => {
      return date.toLocaleDateString()
    }

    const scrollToBottom = () => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    }

    // Auto-resize textarea
    watch(newMessage, () => {
      nextTick(() => {
        if (messageInput.value) {
          messageInput.value.style.height = 'auto'
          messageInput.value.style.height = Math.min(messageInput.value.scrollHeight, 120) + 'px'
        }
      })
    })

    // Lifecycle
    onMounted(() => {
      // Load patient data and conversation history
      messages.value = sampleMessages.value
      console.log('Doctor chat interface mounted for patient:', props.patientId)
      
      nextTick(() => {
        messageInput.value?.focus()
        scrollToBottom()
      })

      // Simulate patient typing occasionally
      setInterval(() => {
        if (Math.random() < 0.1) { // 10% chance every interval
          patientTyping.value = true
          setTimeout(() => {
            patientTyping.value = false
          }, 3000)
        }
      }, 30000)
    })

    return {
      // Reactive data
      newMessage,
      isTyping,
      patientTyping,
      messages,
      messagesContainer,
      messageInput,
      showPatientInfo,
      showTemplatesModal,
      viewingImage,
      conversationPriority,
      aiAnalysis,
      currentPatient,
      quickReplyTemplates,
      
      // Methods
      sendMessage,
      addNewLine,
      insertTemplate,
      useTemplate,
      assignTask,
      markAsUrgent,
      viewPatientProfile,
      viewMedicalHistory,
      scheduleAppointment,
      analyzeImage,
      openImageViewer,
      openAttachment,
      getMessageClass,
      getPriorityClass,
      formatTime,
      formatDate,
      scrollToBottom
    }
  }
}
</script>

<style scoped>
/* Color classes */
.bg-primary-600 { background-color: #0066CC; }
.bg-primary-700 { background-color: #0052a3; }
.bg-primary-100 { background-color: #e6f3ff; }
.text-primary-600 { color: #0066CC; }

/* Action button styling */
.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #475569;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.action-btn:hover {
  background-color: #f1f5f9;
  border-color: #cbd5e1;
}

.action-btn-active {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #dc2626;
  transition: all 0.2s ease;
  white-space: nowrap;
}

/* Message bubble styling */
.message-bubble {
  word-wrap: break-word;
  max-width: 100%;
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

/* Textarea auto-resize */
textarea {
  overflow-y: hidden;
  resize: none;
}

/* Animation for typing indicator */
@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.animate-bounce {
  animation: bounce 1s infinite;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .action-btn span {
    display: none;
  }
  
  .action-btn {
    padding: 0.5rem;
  }
  
  .grid-cols-3 {
    grid-template-columns: 1fr;
  }
}

/* Modal backdrop */
.fixed.inset-0.bg-black.bg-opacity-50,
.fixed.inset-0.bg-black.bg-opacity-75 {
  backdrop-filter: blur(4px);
}

/* Image hover effects */
img:hover {
  opacity: 0.9;
}

/* Focus states */
.focus\:ring-2:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px #0066CC;
}
</style>
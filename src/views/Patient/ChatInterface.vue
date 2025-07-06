<!-- Full-Screen Chat Interface Component -->
<template>
  <!-- Full-Screen Chat Modal -->
  <div v-if="isOpen" class="fixed inset-0 bg-white z-50 flex flex-col">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <button 
          @click="$emit('close')"
          class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg class="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <div>
          <h1 class="text-lg font-semibold text-slate-800">
            {{ activeChatType === 'ai' ? 'AI Assistant' : 'Dr. ' + currentDoctor }}
          </h1>
          <p class="text-sm text-slate-500">
            {{ activeChatType === 'ai' ? 'Get instant dental care guidance' : 'Professional dental consultation' }}
          </p>
        </div>
      </div>
      
      <!-- Chat Type Toggle -->
      <div class="flex bg-gray-100 rounded-lg p-1">
        <button
          @click="switchChatType('ai')"
          class="px-3 py-1 rounded-md text-sm font-medium transition-colors"
          :class="activeChatType === 'ai' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'"
        >
          AI Assistant
        </button>
        <button
          @click="switchChatType('doctor')"
          class="px-3 py-1 rounded-md text-sm font-medium transition-colors"
          :class="activeChatType === 'doctor' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'"
        >
          Doctor
        </button>
      </div>
    </header>

    <!-- Messages Area -->
    <main class="flex-1 overflow-hidden flex flex-col">
      <!-- Doctor Selection (when doctor chat is active) -->
      <div v-if="activeChatType === 'doctor' && !selectedDoctor" class="p-4 bg-blue-50 border-b border-blue-200">
        <h3 class="text-sm font-medium text-blue-900 mb-2">Select a Doctor to Chat With:</h3>
        <div class="space-y-2">
          <button
            v-for="doctor in availableDoctors"
            :key="doctor.id"
            @click="selectDoctor(doctor)"
            class="w-full text-left p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-300 transition-colors"
          >
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span class="text-primary-600 text-sm font-semibold">{{ doctor.initials }}</span>
              </div>
              <div>
                <div class="font-medium text-slate-800">Dr. {{ doctor.name }}</div>
                <div class="text-sm text-slate-600">{{ doctor.specialty }}</div>
              </div>
              <div class="ml-auto">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                      :class="doctor.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                  {{ doctor.status }}
                </span>
              </div>
            </div>
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
            {{ activeChatType === 'ai' ? 'Hello! I\'m your AI Dental Assistant' : 'Start a conversation with Dr. ' + currentDoctor }}
          </h3>
          <p class="text-slate-600">
            {{ activeChatType === 'ai' ? 'Ask me about oral hygiene, symptoms, or upload photos for analysis.' : 'Ask questions about your treatment, schedule appointments, or discuss concerns.' }}
          </p>
        </div>

        <!-- Message List -->
        <div
          v-for="message in messages"
          :key="message.id"
          class="flex"
          :class="message.sender === 'user' ? 'justify-end' : 'justify-start'"
        >
          <div class="max-w-xs lg:max-w-md">
            <!-- Sender Avatar (for non-user messages) -->
            <div v-if="message.sender !== 'user'" class="flex items-center space-x-2 mb-1">
              <div class="w-6 h-6 rounded-full flex items-center justify-center"
                   :class="message.sender === 'ai' ? 'bg-blue-100' : 'bg-green-100'">
                <svg v-if="message.sender === 'ai'" class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"></path>
                </svg>
                <svg v-else class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <span class="text-xs text-slate-500">
                {{ message.sender === 'ai' ? 'AI Assistant' : 'Dr. ' + currentDoctor }}
              </span>
            </div>

            <!-- Message Bubble -->
            <div class="message-bubble" :class="getMessageClass(message.sender)">
              <!-- Image Preview -->
              <div v-if="message.image" class="mb-2">
                <img :src="message.image" alt="Uploaded image" class="rounded-lg max-w-full h-auto" />
              </div>
              
              <!-- Message Text -->
              <p class="text-sm">{{ message.text }}</p>
              
              <!-- AI Disclaimer -->
              <div v-if="message.sender === 'ai'" class="mt-2 pt-2 border-t border-blue-200">
                <p class="text-xs text-blue-600 font-medium">AI Suggestion</p>
              </div>
              
              <!-- Message Time -->
              <div class="flex justify-between items-center mt-2">
                <span class="text-xs opacity-70">{{ formatTime(message.timestamp) }}</span>
                <div v-if="message.sender === 'user'" class="flex items-center space-x-1">
                  <svg v-if="message.status === 'sent'" class="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <svg v-else-if="message.status === 'delivered'" class="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div v-if="isTyping" class="flex justify-start">
          <div class="bg-gray-100 rounded-lg px-4 py-3">
            <div class="flex space-x-1">
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Input Area -->
    <footer class="border-t border-gray-200 p-4 bg-white">
      <!-- Action Buttons -->
      <div class="flex space-x-2 mb-3">
        <button
          @click="openPhotoUpload"
          class="action-btn"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <span>Upload Photo</span>
        </button>
        
        <button
          @click="openProblemReport"
          class="action-btn"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <span>Report Problem</span>
        </button>

        <button
          v-if="activeChatType === 'ai'"
          @click="escalateToDoctor"
          class="action-btn"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          <span>Talk to Doctor</span>
        </button>
      </div>

      <!-- Message Input -->
      <div class="flex space-x-2">
        <div class="flex-1 relative">
          <input
            ref="messageInput"
            v-model="newMessage"
            @keypress.enter="sendMessage"
            type="text"
            placeholder="Type your message..."
            class="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            :disabled="isTyping"
          />
          
          <!-- Emoji/Attachment Button -->
          <button 
            @click="toggleEmojiPicker"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </button>
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

    <!-- Photo Upload Modal -->
    <div v-if="showPhotoUpload" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-slate-800">Upload Oral Health Photo</h3>
          <button @click="showPhotoUpload = false" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Photo Description</label>
            <input 
              v-model="photoUpload.description"
              type="text" 
              placeholder="e.g., Tooth pain on upper left..."
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Choose Photo</label>
            <input 
              ref="photoInput"
              type="file"
              @change="handlePhotoSelect"
              accept="image/*"
              capture="environment"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p class="text-xs text-slate-500 mt-1">Take a clear photo in good lighting</p>
          </div>

          <div class="flex space-x-3 mt-6">
            <button 
              @click="showPhotoUpload = false"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              @click="uploadPhoto"
              :disabled="!photoUpload.file"
              class="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Upload & Analyze
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Problem Report Modal -->
    <div v-if="showProblemReport" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-slate-800">Report Dental Problem</h3>
          <button @click="showProblemReport = false" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Problem Type</label>
            <select v-model="problemReport.type" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="">Select problem type...</option>
              <option value="pain">Tooth Pain</option>
              <option value="sensitivity">Sensitivity</option>
              <option value="bleeding">Bleeding Gums</option>
              <option value="swelling">Swelling</option>
              <option value="broken">Broken/Chipped Tooth</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Pain Level (1-10)</label>
            <input 
              v-model="problemReport.painLevel"
              type="range"
              min="1"
              max="10"
              class="w-full"
            />
            <div class="flex justify-between text-xs text-slate-500 mt-1">
              <span>Mild (1)</span>
              <span class="font-medium">{{ problemReport.painLevel }}</span>
              <span>Severe (10)</span>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea 
              v-model="problemReport.description"
              rows="3"
              placeholder="Describe your symptoms, when it started, what triggers it..."
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Photo (Optional)</label>
            <input 
              ref="problemPhotoInput"
              type="file"
              @change="handleProblemPhotoSelect"
              accept="image/*"
              capture="environment"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div class="flex space-x-3 mt-6">
            <button 
              @click="showProblemReport = false"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              @click="submitProblemReport"
              :disabled="!problemReport.type || !problemReport.description"
              class="flex-1 px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Submit Report
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, nextTick, onMounted, watch } from 'vue'

export default {
  name: 'ChatInterface',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    // Reactive data
    const activeChatType = ref('ai')
    const selectedDoctor = ref(null)
    const newMessage = ref('')
    const isTyping = ref(false)
    const messages = ref([])
    const messagesContainer = ref(null)
    const messageInput = ref(null)
    
    // Modals
    const showPhotoUpload = ref(false)
    const showProblemReport = ref(false)
    
    // Upload forms
    const photoUpload = ref({
      description: '',
      file: null
    })
    
    const problemReport = ref({
      type: '',
      painLevel: 5,
      description: '',
      photo: null
    })

    // Sample data - replace with API calls
    const availableDoctors = ref([
      {
        id: 1,
        name: 'Johnson',
        initials: 'DJ',
        specialty: 'General Dentistry',
        status: 'online'
      },
      {
        id: 2,
        name: 'Smith',
        initials: 'ES',
        specialty: 'Endodontist',
        status: 'online'
      },
      {
        id: 3,
        name: 'Davis',
        initials: 'MD',
        specialty: 'Orthodontist',
        status: 'offline'
      }
    ])

    // Computed properties
    const currentDoctor = computed(() => {
      return selectedDoctor.value ? selectedDoctor.value.name : 'Doctor'
    })

    // Methods
    const switchChatType = (type) => {
      activeChatType.value = type
      if (type === 'ai') {
        selectedDoctor.value = null
      }
      // Clear messages when switching types (or keep them - depends on requirements)
      // messages.value = []
    }

    const selectDoctor = (doctor) => {
      selectedDoctor.value = doctor
      // TODO: Load existing conversation with this doctor
      console.log('Selected doctor:', doctor.name)
    }

    const sendMessage = async () => {
      if (!newMessage.value.trim()) return

      const userMessage = {
        id: Date.now(),
        sender: 'user',
        text: newMessage.value.trim(),
        timestamp: new Date(),
        status: 'sent'
      }

      messages.value.push(userMessage)
      const messageText = newMessage.value.trim()
      newMessage.value = ''

      // Scroll to bottom
      await nextTick()
      scrollToBottom()

      // Simulate typing and response
      isTyping.value = true
      setTimeout(() => {
        isTyping.value = false
        
        const response = {
          id: Date.now() + 1,
          sender: activeChatType.value,
          text: generateResponse(messageText),
          timestamp: new Date()
        }
        
        messages.value.push(response)
        userMessage.status = 'delivered'
        
        nextTick(() => scrollToBottom())
      }, 1500)

      // TODO: Send actual API request based on chat type
      console.log('Sending message:', messageText, 'to:', activeChatType.value)
    }

    const generateResponse = (message) => {
      // Simple response generation - replace with actual API calls
      if (activeChatType.value === 'ai') {
        const responses = [
          "Thank you for your question. Based on what you've described, I recommend maintaining good oral hygiene and scheduling a check-up if symptoms persist.",
          "That's a common concern. I suggest gentle brushing with a soft-bristled toothbrush and fluoride toothpaste. If pain continues, please consult with a dentist.",
          "I understand your concern. For immediate relief, you can rinse with warm salt water. However, I recommend seeing a dentist for proper evaluation.",
          "Based on your symptoms, this could indicate several conditions. I'd recommend taking a photo of the affected area for better analysis, or consulting with one of our dentists."
        ]
        return responses[Math.floor(Math.random() * responses.length)]
      } else {
        const responses = [
          "Thank you for reaching out. I've received your message and will review your case. Can you provide more details about when the symptoms started?",
          "I see your concern. Based on your description, we should schedule an appointment for a proper examination. Are you available this week?",
          "This sounds like something we should address promptly. I'm reviewing your medical history now. Have you experienced this before?",
          "Thank you for the information. I recommend coming in for an examination. In the meantime, avoid very hot or cold foods and drinks."
        ]
        return responses[Math.floor(Math.random() * responses.length)]
      }
    }

    const openPhotoUpload = () => {
      showPhotoUpload.value = true
    }

    const openProblemReport = () => {
      showProblemReport.value = true
    }

    const escalateToDoctor = () => {
      // Add escalation message
      const escalationMessage = {
        id: Date.now(),
        sender: 'ai',
        text: "I'm connecting you with a doctor for more specialized assistance. Please wait a moment...",
        timestamp: new Date()
      }
      messages.value.push(escalationMessage)
      
      // Switch to doctor chat
      setTimeout(() => {
        switchChatType('doctor')
      }, 1000)
    }

    const handlePhotoSelect = (event) => {
      const file = event.target.files[0]
      if (file) {
        photoUpload.value.file = file
      }
    }

    const uploadPhoto = () => {
      // TODO: Implement photo upload and AI analysis
      console.log('Uploading photo:', photoUpload.value)
      
      // Simulate photo upload
      const photoMessage = {
        id: Date.now(),
        sender: 'user',
        text: photoUpload.value.description || 'Uploaded oral health photo for analysis',
        image: URL.createObjectURL(photoUpload.value.file),
        timestamp: new Date(),
        status: 'sent'
      }
      
      messages.value.push(photoMessage)
      showPhotoUpload.value = false
      photoUpload.value = { description: '', file: null }
      
      // Simulate AI analysis response
      setTimeout(() => {
        const analysisResponse = {
          id: Date.now() + 1,
          sender: 'ai',
          text: "I've analyzed your photo. I can see some plaque buildup and mild inflammation. I recommend improved brushing technique and scheduling a professional cleaning. Would you like me to help you book an appointment?",
          timestamp: new Date()
        }
        messages.value.push(analysisResponse)
        nextTick(() => scrollToBottom())
      }, 2000)
      
      nextTick(() => scrollToBottom())
    }

    const handleProblemPhotoSelect = (event) => {
      const file = event.target.files[0]
      if (file) {
        problemReport.value.photo = file
      }
    }

    const submitProblemReport = () => {
      // TODO: Implement problem report submission
      console.log('Submitting problem report:', problemReport.value)
      
      // Create problem report message
      let reportText = `Problem Report:\n• Type: ${problemReport.value.type}\n• Pain Level: ${problemReport.value.painLevel}/10\n• Description: ${problemReport.value.description}`
      
      const reportMessage = {
        id: Date.now(),
        sender: 'user',
        text: reportText,
        image: problemReport.value.photo ? URL.createObjectURL(problemReport.value.photo) : null,
        timestamp: new Date(),
        status: 'sent'
      }
      
      messages.value.push(reportMessage)
      showProblemReport.value = false
      problemReport.value = { type: '', painLevel: 5, description: '', photo: null }
      
      // Simulate urgent response for high pain levels
      setTimeout(() => {
        let responseText = "Thank you for your problem report. "
        if (problemReport.value.painLevel >= 8) {
          responseText += "This seems urgent. I recommend seeking immediate dental care or visiting an emergency dentist."
        } else if (problemReport.value.painLevel >= 6) {
          responseText += "I understand you're in significant discomfort. Let me help you schedule an urgent appointment."
        } else {
          responseText += "I've received your report and will help you address this issue. Let's discuss your symptoms further."
        }
        
        const response = {
          id: Date.now() + 1,
          sender: activeChatType.value,
          text: responseText,
          timestamp: new Date()
        }
        messages.value.push(response)
        nextTick(() => scrollToBottom())
      }, 1000)
      
      nextTick(() => scrollToBottom())
    }

    const toggleEmojiPicker = () => {
      // TODO: Implement emoji picker
      console.log('Toggle emoji picker')
    }

    const getMessageClass = (sender) => {
      if (sender === 'user') {
        return 'bg-primary-600 text-white rounded-lg px-4 py-3'
      } else if (sender === 'ai') {
        return 'bg-blue-50 text-slate-800 rounded-lg px-4 py-3 border border-blue-200'
      } else {
        return 'bg-green-50 text-slate-800 rounded-lg px-4 py-3 border border-green-200'
      }
    }

    const formatTime = (timestamp) => {
      return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const scrollToBottom = () => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    }

    // Watchers
    watch(() => props.isOpen, (isOpen) => {
      if (isOpen) {
        nextTick(() => {
          messageInput.value?.focus()
          scrollToBottom()
        })
      }
    })

    // Lifecycle
    onMounted(() => {
      // TODO: Load existing chat history
      console.log('Chat interface mounted')
      
      // Sample welcome message for AI
      if (activeChatType.value === 'ai') {
        messages.value.push({
          id: 1,
          sender: 'ai',
          text: 'Hello! I\'m your AI dental assistant. I can help you with oral health questions, analyze photos of your teeth, and connect you with dentists when needed. How can I help you today?',
          timestamp: new Date()
        })
      }
    })

    return {
      // Reactive data
      activeChatType,
      selectedDoctor,
      newMessage,
      isTyping,
      messages,
      messagesContainer,
      messageInput,
      showPhotoUpload,
      showProblemReport,
      photoUpload,
      problemReport,
      availableDoctors,
      
      // Computed
      currentDoctor,
      
      // Methods
      switchChatType,
      selectDoctor,
      sendMessage,
      openPhotoUpload,
      openProblemReport,
      escalateToDoctor,
      handlePhotoSelect,
      uploadPhoto,
      handleProblemPhotoSelect,
      submitProblemReport,
      toggleEmojiPicker,
      getMessageClass,
      formatTime,
      scrollToBottom
    }
  }
}
</script>

<style scoped>
/* Ensure proper color classes */
.bg-primary-600 { background-color: #0066CC; }
.bg-primary-700 { background-color: #0052a3; }
.bg-primary-100 { background-color: #e6f3ff; }
.text-primary-600 { color: #0066CC; }
.text-primary-700 { color: #0052a3; }
.bg-secondary-600 { background-color: #00A86B; }
.text-secondary-600 { color: #00A86B; }
.bg-accent-500 { background-color: #FF6B35; }
.bg-accent-600 { background-color: #e55a2b; }

/* Message bubble styling */
.message-bubble {
  word-wrap: break-word;
  max-width: 100%;
}

/* Action button styling */
.action-btn {
  @apply flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 hover:bg-gray-200 transition-colors duration-200;
}

/* Custom scrollbar for messages */
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

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Animation for typing indicator */
@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}

/* Modal backdrop blur */
.fixed.inset-0.bg-black.bg-opacity-50 {
  backdrop-filter: blur(4px);
}

/* File input styling */
input[type="file"] {
  font-size: 14px;
}

input[type="file"]::-webkit-file-upload-button {
  background-color: #f8fafc;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  color: #374151;
  cursor: pointer;
  font-size: 14px;
  margin-right: 12px;
  padding: 8px 12px;
}

input[type="file"]::-webkit-file-upload-button:hover {
  background-color: #f1f5f9;
}

/* Range input styling */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-track {
  background: #e5e7eb;
  height: 6px;
  border-radius: 3px;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  background: #0066CC;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  cursor: pointer;
}

input[type="range"]::-moz-range-track {
  background: #e5e7eb;
  height: 6px;
  border-radius: 3px;
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

/* Responsive adjustments */
@media (max-width: 640px) {
  .max-w-xs {
    max-width: 16rem;
  }
  
  .action-btn {
    @apply px-2 py-1 text-xs;
  }
  
  .action-btn span {
    @apply hidden sm:inline;
  }
}
</style>
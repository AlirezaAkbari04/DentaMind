<!--
  Communication Hub Component
  
  Central communication interface with:
  - Chat Management (Doctor)
  - Patient Communication (Secretary)
  - Problem Reports with color-coded flags
  - Real-time messaging interface
  - File sharing and photo analysis
-->
<template>
  <div class="h-screen flex flex-col bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 p-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-slate-800">Communication Hub</h1>
          <p class="text-sm text-slate-600">
            {{ userRole === 'doctor' ? 'Manage patient communications and consultations' : 'Handle patient inquiries and administrative messages' }}
          </p>
        </div>
        
        <!-- Status Indicator -->
        <div class="flex items-center space-x-2">
          <div class="flex items-center space-x-1">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span class="text-sm text-slate-600">Online</span>
          </div>
        </div>
      </div>

      <!-- Communication Type Tabs -->
      <div class="mt-4 flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button 
          @click="activeTab = 'chat'"
          class="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors"
          :class="activeTab === 'chat' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-800'"
        >
          <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {{ userRole === 'doctor' ? 'Chat Management' : 'Patient Communication' }}
        </button>
        
        <button 
          @click="activeTab = 'problems'"
          class="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors relative"
          :class="activeTab === 'problems' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-800'"
        >
          <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          Problem Reports
          <!-- Urgent badge -->
          <span v-if="urgentProblems > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {{ urgentProblems }}
          </span>
        </button>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 flex min-h-0">
      <!-- Sidebar - Chat/Problem List -->
      <div class="w-80 bg-white border-r border-gray-200 flex flex-col">
        <!-- Search Bar -->
        <div class="p-4 border-b border-gray-100">
          <div class="relative">
            <input 
              v-model="searchQuery"
              type="text"
              :placeholder="activeTab === 'chat' ? 'Search conversations...' : 'Search reports...'"
              class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <svg class="w-5 h-5 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <!-- Chat Tab Content -->
        <div v-if="activeTab === 'chat'" class="flex-1 overflow-y-auto">
          <div class="p-2 space-y-1">
            <div
              v-for="conversation in filteredConversations"
              :key="conversation.id"
              class="p-3 rounded-lg cursor-pointer transition-colors"
              :class="selectedConversation?.id === conversation.id ? 'bg-primary-50 border border-primary-200' : 'hover:bg-gray-50'"
              @click="selectConversation(conversation)"
            >
              <div class="flex items-center space-x-3">
                <!-- Patient Avatar -->
                <div class="relative">
                  <div class="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                    <span class="text-sm font-medium text-slate-600">
                      {{ conversation.patientName.split(' ').map(n => n[0]).join('') }}
                    </span>
                  </div>
                  <!-- Online indicator -->
                  <div v-if="conversation.isOnline" class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <h3 class="text-sm font-medium text-slate-800 truncate">{{ conversation.patientName }}</h3>
                    <span class="text-xs text-slate-500">{{ formatTime(conversation.lastMessage.time) }}</span>
                  </div>
                  <p class="text-sm text-slate-600 truncate">{{ conversation.lastMessage.text }}</p>
                  
                  <!-- Message indicators -->
                  <div class="flex items-center justify-between mt-1">
                    <div class="flex items-center space-x-2">
                      <!-- Message type badges -->
                      <span v-if="conversation.hasImages" class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Photos
                      </span>
                      <span v-if="conversation.isUrgent" class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        Urgent
                      </span>
                    </div>
                    
                    <!-- Unread count -->
                    <span v-if="conversation.unreadCount > 0" class="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-primary-600 rounded-full">
                      {{ conversation.unreadCount > 9 ? '9+' : conversation.unreadCount }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty state for chats -->
          <div v-if="filteredConversations.length === 0" class="p-8 text-center">
            <svg class="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p class="text-slate-500">No conversations found</p>
          </div>
        </div>

        <!-- Problem Reports Tab Content -->
        <div v-else class="flex-1 overflow-y-auto">
          <div class="p-2 space-y-1">
            <div
              v-for="problem in filteredProblems"
              :key="problem.id"
              class="p-3 rounded-lg cursor-pointer transition-colors border-l-4"
              :class="[
                selectedProblem?.id === problem.id ? 'bg-primary-50 border-primary-200' : 'hover:bg-gray-50',
                getProblemBorderColor(problem.priority)
              ]"
              @click="selectProblem(problem)"
            >
              <div class="flex items-start space-x-3">
                <!-- Priority Flag -->
                <div class="flex-shrink-0">
                  <div 
                    class="w-3 h-3 rounded-full mt-1"
                    :class="getPriorityColor(problem.priority)"
                  ></div>
                </div>
                
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <h3 class="text-sm font-medium text-slate-800 truncate">{{ problem.patientName }}</h3>
                    <span class="text-xs text-slate-500">{{ formatTime(problem.reportedAt) }}</span>
                  </div>
                  <p class="text-sm text-slate-600 truncate">{{ problem.subject }}</p>
                  <p class="text-xs text-slate-500 mt-1">{{ problem.description }}</p>
                  
                  <!-- Problem indicators -->
                  <div class="flex items-center justify-between mt-2">
                    <div class="flex items-center space-x-2">
                      <!-- Problem type and status -->
                      <span 
                        class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium"
                        :class="getPriorityClasses(problem.priority)"
                      >
                        {{ problem.priority }} Priority
                      </span>
                      
                      <span v-if="problem.hasPhotos" class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {{ problem.photoCount }} Photos
                      </span>
                    </div>
                    
                    <!-- Status indicator -->
                    <span 
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                      :class="getStatusClasses(problem.status)"
                    >
                      {{ problem.status }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty state for problems -->
          <div v-if="filteredProblems.length === 0" class="p-8 text-center">
            <svg class="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p class="text-slate-500">No problem reports found</p>
          </div>
        </div>
      </div>

      <!-- Main Chat/Problem View Area -->
      <div class="flex-1 flex flex-col">
        <!-- No selection state -->
        <div v-if="!selectedConversation && !selectedProblem" class="flex-1 flex items-center justify-center bg-gray-50">
          <div class="text-center">
            <svg class="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 class="text-lg font-medium text-slate-800 mb-2">
              {{ activeTab === 'chat' ? 'Select a conversation' : 'Select a problem report' }}
            </h3>
            <p class="text-slate-600">
              {{ activeTab === 'chat' ? 'Choose a patient conversation to start messaging' : 'Choose a problem report to review and respond' }}
            </p>
          </div>
        </div>

        <!-- Chat Interface -->
        <div v-else-if="selectedConversation" class="flex-1 flex flex-col">
          <!-- Chat Header -->
          <div class="bg-white border-b border-gray-200 p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                  <span class="text-sm font-medium text-slate-600">
                    {{ selectedConversation.patientName.split(' ').map(n => n[0]).join('') }}
                  </span>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-slate-800">{{ selectedConversation.patientName }}</h2>
                  <p class="text-sm text-slate-600">
                    {{ selectedConversation.isOnline ? 'Online now' : `Last seen ${formatTime(selectedConversation.lastSeen)}` }}
                  </p>
                </div>
              </div>
              
              <div class="flex items-center space-x-2">
                <!-- Action buttons -->
                <button 
                  @click="viewPatientProfile(selectedConversation.patientId)"
                  class="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-gray-100 transition-colors"
                  title="View Patient Profile"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
                
                <button 
                  v-if="userRole === 'doctor'"
                  @click="openClinicalNotes(selectedConversation.patientId)"
                  class="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Clinical Notes"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Messages Area -->
          <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            <div
              v-for="message in selectedConversation.messages"
              :key="message.id"
              class="flex"
              :class="message.isFromPatient ? 'justify-start' : 'justify-end'"
            >
              <div 
                class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg"
                :class="message.isFromPatient ? 'bg-white text-slate-800 shadow-sm' : 'bg-primary-600 text-white'"
              >
                <!-- Text message -->
                <p v-if="message.type === 'text'" class="text-sm">{{ message.content }}</p>
                
                <!-- Image message -->
                <div v-else-if="message.type === 'image'" class="space-y-2">
                  <img 
                    :src="message.imageUrl" 
                    :alt="message.content"
                    class="rounded-lg max-w-full h-auto cursor-pointer"
                    @click="openImageModal(message.imageUrl)"
                  />
                  <p v-if="message.content" class="text-sm">{{ message.content }}</p>
                  
                  <!-- AI Analysis button for patient images -->
                  <button 
                    v-if="message.isFromPatient && userRole === 'doctor'"
                    @click="analyzeImage(message.imageUrl)"
                    class="mt-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded hover:bg-purple-200 transition-colors"
                  >
                    AI Analysis
                  </button>
                </div>
                
                <!-- File message -->
                <div v-else-if="message.type === 'file'" class="flex items-center space-x-2">
                  <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span class="text-sm">{{ message.fileName }}</span>
                  <button class="text-xs underline">Download</button>
                </div>
                
                <!-- Message timestamp -->
                <p class="text-xs mt-1 opacity-70">{{ formatTime(message.timestamp) }}</p>
              </div>
            </div>
          </div>

          <!-- Message Input -->
          <div class="bg-white border-t border-gray-200 p-4">
            <div class="flex items-end space-x-2">
              <!-- File upload button -->
              <button 
                @click="$refs.fileInput.click()"
                class="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-gray-100 transition-colors"
                title="Attach File"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              <input 
                ref="fileInput"
                type="file"
                class="hidden"
                accept="image/*,.pdf,.doc,.docx"
                @change="handleFileUpload"
              />
              
              <!-- Message input -->
              <div class="flex-1">
                <textarea
                  v-model="newMessage"
                  @keydown.enter.prevent="sendMessage"
                  placeholder="Type your message..."
                  rows="1"
                  class="w-full resize-none border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                ></textarea>
              </div>
              
              <!-- Send button -->
              <button 
                @click="sendMessage"
                :disabled="!newMessage.trim()"
                class="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Problem Report Interface -->
        <div v-else-if="selectedProblem" class="flex-1 flex flex-col">
          <!-- Problem Header -->
          <div class="bg-white border-b border-gray-200 p-4">
            <div class="flex items-center justify-between">
              <div>
                <div class="flex items-center space-x-3">
                  <div 
                    class="w-4 h-4 rounded-full"
                    :class="getPriorityColor(selectedProblem.priority)"
                  ></div>
                  <h2 class="text-lg font-semibold text-slate-800">{{ selectedProblem.subject }}</h2>
                  <span 
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    :class="getPriorityClasses(selectedProblem.priority)"
                  >
                    {{ selectedProblem.priority }} Priority
                  </span>
                </div>
                <p class="text-sm text-slate-600 mt-1">
                  Reported by {{ selectedProblem.patientName }} • {{ formatTime(selectedProblem.reportedAt) }}
                </p>
              </div>
              
              <div class="flex items-center space-x-2">
                <!-- Status change dropdown -->
                <select 
                  v-model="selectedProblem.status"
                  @change="updateProblemStatus"
                  class="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
                
                <button 
                  @click="viewPatientProfile(selectedProblem.patientId)"
                  class="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-gray-100 transition-colors"
                  title="View Patient Profile"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Problem Details -->
          <div class="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50">
            <!-- Problem Description -->
            <div class="bg-white rounded-lg p-4 shadow-sm">
              <h3 class="text-sm font-medium text-slate-800 mb-2">Problem Description</h3>
              <p class="text-sm text-slate-600">{{ selectedProblem.description }}</p>
            </div>

            <!-- Attached Photos -->
            <div v-if="selectedProblem.hasPhotos" class="bg-white rounded-lg p-4 shadow-sm">
              <h3 class="text-sm font-medium text-slate-800 mb-3">Attached Photos ({{ selectedProblem.photoCount }})</h3>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div
                  v-for="photo in selectedProblem.photos"
                  :key="photo.id"
                  class="relative group cursor-pointer"
                  @click="openImageModal(photo.url)"
                >
                  <img 
                    :src="photo.thumbnail"
                    :alt="`Problem photo ${photo.id}`"
                    class="w-full h-24 object-cover rounded-lg"
                  />
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  
                  <!-- AI Analysis button -->
                  <button 
                    v-if="userRole === 'doctor'"
                    @click.stop="analyzeImage(photo.url)"
                    class="absolute bottom-1 right-1 text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    AI Analysis
                  </button>
                </div>
              </div>
            </div>

            <!-- Response/Follow-up Actions -->
            <div class="bg-white rounded-lg p-4 shadow-sm">
              <h3 class="text-sm font-medium text-slate-800 mb-3">Response Actions</h3>
              <div class="space-y-3">
                <!-- Quick response buttons -->
                <div class="flex flex-wrap gap-2">
                  <button 
                    @click="setQuickResponse('schedule')"
                    class="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    Schedule Appointment
                  </button>
                  <button 
                    @click="setQuickResponse('advice')"
                    class="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    Provide Advice
                  </button>
                  <button 
                    @click="setQuickResponse('refer')"
                    class="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors"
                  >
                    Refer to Specialist
                  </button>
                </div>
                
                <!-- Response textarea -->
                <textarea
                  v-model="problemResponse"
                  placeholder="Type your response to the patient..."
                  rows="4"
                  class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                ></textarea>
                
                <!-- Send response button -->
                <div class="flex justify-end">
                  <button 
                    @click="sendProblemResponse"
                    :disabled="!problemResponse.trim()"
                    class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Send Response
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Modal -->
    <div v-if="showImageModal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" @click="closeImageModal">
      <div class="max-w-4xl max-h-full p-4">
        <img :src="modalImageUrl" alt="Full size image" class="max-w-full max-h-full object-contain rounded-lg" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'CommunicationHub',
  emits: ['show-toast', 'show-error', 'show-success'],
  setup(props, { emit }) {
    const router = useRouter()
    const authStore = useAuthStore()
    
    // ==========================================
    // REACTIVE STATE
    // ==========================================
    
    const activeTab = ref('chat')
    const searchQuery = ref('')
    const selectedConversation = ref(null)
    const selectedProblem = ref(null)
    const newMessage = ref('')
    const problemResponse = ref('')
    const showImageModal = ref(false)
    const modalImageUrl = ref('')
    
    // Mock data - replace with API calls
    const conversations = ref([
      {
        id: 'c1',
        patientId: 'P001',
        patientName: 'John Smith',
        isOnline: true,
        lastSeen: new Date(),
        unreadCount: 2,
        hasImages: true,
        isUrgent: false,
        lastMessage: {
          text: 'My tooth is still hurting after the procedure',
          time: new Date(Date.now() - 10 * 60 * 1000),
          isFromPatient: true
        },
        messages: [
          {
            id: 'm1',
            type: 'text',
            content: 'Hello Doctor, I had a tooth extraction yesterday and I\'m experiencing some pain.',
            isFromPatient: true,
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
          },
          {
            id: 'm2',
            type: 'text',
            content: 'I understand your concern. Some pain after extraction is normal. Are you taking the prescribed medication?',
            isFromPatient: false,
            timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000)
          },
          {
            id: 'm3',
            type: 'image',
            content: 'Here\'s how the area looks now',
            imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
            isFromPatient: true,
            timestamp: new Date(Date.now() - 20 * 60 * 1000)
          },
          {
            id: 'm4',
            type: 'text',
            content: 'My tooth is still hurting after the procedure',
            isFromPatient: true,
            timestamp: new Date(Date.now() - 10 * 60 * 1000)
          }
        ]
      },
      {
        id: 'c2',
        patientId: 'P002',
        patientName: 'Sarah Johnson',
        isOnline: false,
        lastSeen: new Date(Date.now() - 30 * 60 * 1000),
        unreadCount: 0,
        hasImages: false,
        isUrgent: true,
        lastMessage: {
          text: 'Thank you for the appointment confirmation',
          time: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isFromPatient: true
        },
        messages: []
      }
    ])
    
    const problems = ref([
      {
        id: 'pr1',
        patientId: 'P003',
        patientName: 'Mike Davis',
        subject: 'Severe tooth pain after cleaning',
        description: 'I had a cleaning done 3 days ago and since then I\'ve been experiencing severe pain in my upper left molar. The pain is constant and gets worse when I eat or drink anything cold.',
        priority: 'High',
        status: 'New',
        reportedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        hasPhotos: true,
        photoCount: 2,
        photos: [
          {
            id: 'ph1',
            url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop',
            thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=200&h=150&fit=crop'
          },
          {
            id: 'ph2',
            url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop',
            thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=200&h=150&fit=crop'
          }
        ]
      },
      {
        id: 'pr2',
        patientId: 'P004',
        patientName: 'Emily Wilson',
        subject: 'Bleeding gums',
        description: 'I\'ve noticed my gums have been bleeding when I brush my teeth for the past week. There\'s also some swelling.',
        priority: 'Medium',
        status: 'In Progress',
        reportedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        hasPhotos: false,
        photoCount: 0,
        photos: []
      },
      {
        id: 'pr3',
        patientId: 'P005',
        patientName: 'Robert Brown',
        subject: 'Loose crown',
        description: 'My crown on the right side feels loose when I chew. It happened yesterday during lunch.',
        priority: 'Low',
        status: 'New',
        reportedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        hasPhotos: false,
        photoCount: 0,
        photos: []
      }
    ])
    
    // ==========================================
    // COMPUTED PROPERTIES
    // ==========================================
    
    const userRole = computed(() => authStore.user?.role)
    
    const urgentProblems = computed(() => {
      return problems.value.filter(p => p.priority === 'High' && p.status === 'New').length
    })
    
    const filteredConversations = computed(() => {
      if (!searchQuery.value) return conversations.value
      
      return conversations.value.filter(conv =>
        conv.patientName.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    })
    
    const filteredProblems = computed(() => {
      if (!searchQuery.value) return problems.value
      
      return problems.value.filter(prob =>
        prob.patientName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        prob.subject.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    })
    
    // ==========================================
    // METHODS
    // ==========================================
    
    const formatTime = (date) => {
      const now = new Date()
      const diffInMinutes = Math.floor((now - new Date(date)) / (1000 * 60))
      
      if (diffInMinutes < 1) return 'Just now'
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
      
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    // Priority and status styling
    const getPriorityColor = (priority) => {
      switch (priority) {
        case 'High':
          return 'bg-red-500'
        case 'Medium':
          return 'bg-yellow-500'
        case 'Low':
          return 'bg-green-500'
        default:
          return 'bg-gray-500'
      }
    }
    
    const getPriorityClasses = (priority) => {
      switch (priority) {
        case 'High':
          return 'bg-red-100 text-red-800'
        case 'Medium':
          return 'bg-yellow-100 text-yellow-800'
        case 'Low':
          return 'bg-green-100 text-green-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }
    
    const getProblemBorderColor = (priority) => {
      switch (priority) {
        case 'High':
          return 'border-l-red-500'
        case 'Medium':
          return 'border-l-yellow-500'
        case 'Low':
          return 'border-l-green-500'
        default:
          return 'border-l-gray-500'
      }
    }
    
    const getStatusClasses = (status) => {
      switch (status) {
        case 'New':
          return 'bg-blue-100 text-blue-800'
        case 'In Progress':
          return 'bg-yellow-100 text-yellow-800'
        case 'Resolved':
          return 'bg-green-100 text-green-800'
        case 'Closed':
          return 'bg-gray-100 text-gray-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }
    
    // Selection methods
    const selectConversation = (conversation) => {
      selectedConversation.value = conversation
      selectedProblem.value = null
      
      // Mark as read
      conversation.unreadCount = 0
    }
    
    const selectProblem = (problem) => {
      selectedProblem.value = problem
      selectedConversation.value = null
    }
    
    // Message handling
    const sendMessage = async () => {
      if (!newMessage.value.trim() || !selectedConversation.value) return
      
      const message = {
        id: `m${Date.now()}`,
        type: 'text',
        content: newMessage.value.trim(),
        isFromPatient: false,
        timestamp: new Date()
      }
      
      selectedConversation.value.messages.push(message)
      selectedConversation.value.lastMessage = {
        text: message.content,
        time: message.timestamp,
        isFromPatient: false
      }
      
      newMessage.value = ''
      
      // TODO: Send to API
      emit('show-success', 'Message sent successfully')
      
      // Scroll to bottom
      await nextTick()
      const messagesContainer = document.querySelector('.overflow-y-auto')
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight
      }
    }
    
    const handleFileUpload = (event) => {
      const file = event.target.files[0]
      if (!file) return
      
      // TODO: Implement file upload to server
      // For now, just show success message
      emit('show-success', `File "${file.name}" uploaded successfully`)
      
      // Reset file input
      event.target.value = ''
    }
    
    // Problem handling
    const updateProblemStatus = () => {
      if (!selectedProblem.value) return
      
      // TODO: Send status update to API
      emit('show-success', `Problem status updated to ${selectedProblem.value.status}`)
    }
    
    const setQuickResponse = (type) => {
      const responses = {
        schedule: 'Thank you for reporting this issue. I would like to schedule an appointment to examine this more closely. Please let me know your availability.',
        advice: 'Based on your description, I recommend the following steps: ',
        refer: 'I believe this requires specialized attention. I will refer you to a specialist who can better address this concern.'
      }
      
      problemResponse.value = responses[type] || ''
    }
    
    const sendProblemResponse = async () => {
      if (!problemResponse.value.trim() || !selectedProblem.value) return
      
      // TODO: Send response to API
      emit('show-success', 'Response sent to patient')
      
      // Update problem status if it's new
      if (selectedProblem.value.status === 'New') {
        selectedProblem.value.status = 'In Progress'
      }
      
      problemResponse.value = ''
    }
    
    // Image handling
    const openImageModal = (imageUrl) => {
      modalImageUrl.value = imageUrl
      showImageModal.value = true
    }
    
    const closeImageModal = () => {
      showImageModal.value = false
      modalImageUrl.value = ''
    }
    
    const analyzeImage = (imageUrl) => {
      // TODO: Implement AI image analysis
      emit('show-success', 'AI analysis initiated for the image')
      router.push('/doctor-secretary/ai-diagnostics')
    }
    
    // Navigation methods
    const viewPatientProfile = (patientId) => {
      router.push(`/doctor-secretary/patient/${patientId}`)
    }
    
    const openClinicalNotes = (patientId) => {
      router.push(`/doctor-secretary/clinical-notes?patient=${patientId}`)
    }
    
    // Data loading
    const loadCommunicationData = async () => {
      try {
        // TODO: Replace with actual API calls
        // const [conversationsResponse, problemsResponse] = await Promise.all([
        //   api.get('/communications/conversations'),
        //   api.get('/communications/problems')
        // ])
        
        // conversations.value = conversationsResponse.data
        // problems.value = problemsResponse.data
        
        emit('show-success', 'Communication data loaded successfully')
      } catch (error) {
        console.error('Error loading communication data:', error)
        emit('show-error', 'Failed to load communication data')
      }
    }
    
    // ==========================================
    // LIFECYCLE
    // ==========================================
    
    onMounted(() => {
      loadCommunicationData()
    })
    
    // ==========================================
    // RETURN FOR TEMPLATE
    // ==========================================
    
    return {
      // State
      activeTab,
      searchQuery,
      selectedConversation,
      selectedProblem,
      newMessage,
      problemResponse,
      showImageModal,
      modalImageUrl,
      conversations,
      problems,
      
      // Computed
      userRole,
      urgentProblems,
      filteredConversations,
      filteredProblems,
      
      // Methods
      formatTime,
      getPriorityColor,
      getPriorityClasses,
      getProblemBorderColor,
      getStatusClasses,
      selectConversation,
      selectProblem,
      sendMessage,
      handleFileUpload,
      updateProblemStatus,
      setQuickResponse,
      sendProblemResponse,
      openImageModal,
      closeImageModal,
      analyzeImage,
      viewPatientProfile,
      openClinicalNotes,
      loadCommunicationData
    }
  }
}
</script>

<style scoped>
/* Custom scrollbar for messages */
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

.hover\\:bg-gray-100:hover {
  background-color: #f3f4f6;
}

.hover\\:bg-primary-700:hover {
  background-color: #0052a3;
}

.hover\\:text-slate-600:hover {
  color: #475569;
}

.hover\\:text-slate-800:hover {
  color: #1e293b;
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

.transition-opacity {
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Custom color classes */
.bg-primary-50 { background-color: #eff6ff; }
.bg-primary-100 { background-color: #dbeafe; }
.bg-primary-600 { background-color: #0066CC; }
.bg-primary-700 { background-color: #0052a3; }
.text-primary-600 { color: #0066CC; }
.border-primary-200 { border-color: #bfdbfe; }
.border-primary-500 { border-color: #0066CC; }

/* Focus states */
textarea:focus,
input:focus,
select:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

/* Message bubbles */
.max-w-xs {
  max-width: 20rem;
}

.max-w-md {
  max-width: 28rem;
}

@media (min-width: 1024px) {
  .lg\\:max-w-md {
    max-width: 28rem;
  }
}

/* File input hidden */
.hidden {
  display: none;
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

/* Grid responsive */
.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

@media (min-width: 768px) {
  .md\\:grid-cols-3 {
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

/* Flex utilities */
.justify-start {
  justify-content: flex-start;
}

.justify-end {
  justify-content: flex-end;
}

.items-end {
  align-items: flex-end;
}

.items-start {
  align-items: flex-start;
}

/* Shadow utilities */
.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

/* Resize utilities */
.resize-none {
  resize: none;
}

/* Object fit utilities */
.object-cover {
  object-fit: cover;
}

.object-contain {
  object-fit: contain;
}

/* Opacity utilities */
.opacity-70 {
  opacity: 0.7;
}

.opacity-0 {
  opacity: 0;
}

.opacity-100 {
  opacity: 1;
}

/* Group hover utilities */
.group:hover .group-hover\\:opacity-100 {
  opacity: 1;
}

.group:hover .group-hover\\:bg-opacity-20 {
  background-color: rgba(0, 0, 0, 0.2);
}
</style>
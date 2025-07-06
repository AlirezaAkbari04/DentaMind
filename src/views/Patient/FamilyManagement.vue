<!-- Family Management Page -->
<template>
  <div class="min-h-screen bg-neutral-50 pb-20">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-100 px-4 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <button 
            @click="$router.go(-1)"
            class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg class="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <div>
            <h1 class="text-xl font-semibold text-slate-800">Family Management</h1>
            <p class="text-sm text-slate-600 mt-1">Manage your family's dental care</p>
          </div>
        </div>
        <button 
          @click="showAddMemberModal = true"
          class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          Add Member
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="px-4 py-6 space-y-6">
      <!-- Family Overview Stats -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div>
              <div class="text-2xl font-bold text-slate-800">{{ familyMembers.length }}</div>
              <div class="text-sm text-slate-600">Family Members</div>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <div class="text-2xl font-bold text-slate-800">{{ upcomingAppointments }}</div>
              <div class="text-sm text-slate-600">Upcoming Appointments</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Primary Account Holder -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-slate-800">Primary Account Holder</h2>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Account Manager
          </span>
        </div>
        
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <span class="text-primary-600 text-xl font-bold">{{ primaryAccount.initials }}</span>
          </div>
          <div class="flex-1">
            <div class="font-semibold text-slate-800">{{ primaryAccount.name }}</div>
            <div class="text-sm text-slate-600">{{ primaryAccount.email }}</div>
            <div class="text-sm text-slate-600">{{ primaryAccount.phone }}</div>
          </div>
          <button 
            @click="editMember(primaryAccount)"
            class="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Edit Profile
          </button>
        </div>
      </div>

      <!-- Family Members List -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-slate-800">Family Members</h2>
          <span class="text-sm text-slate-500">{{ familyMembers.length - 1 }} additional members</span>
        </div>

        <div v-if="familyMembers.length <= 1" class="text-center py-8">
          <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          <p class="text-gray-500 mb-2">No family members added yet</p>
          <button 
            @click="showAddMemberModal = true"
            class="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Add your first family member
          </button>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="member in otherFamilyMembers"
            :key="member.id"
            class="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 rounded-full flex items-center justify-center"
                     :class="getAvatarClass(member.relationship)">
                  <span class="text-white text-sm font-bold">{{ member.initials }}</span>
                </div>
                <div class="flex-1">
                  <div class="font-semibold text-slate-800">{{ member.name }}</div>
                  <div class="text-sm text-slate-600">{{ member.relationship }} • Age {{ member.age }}</div>
                  <div class="text-xs text-slate-500">{{ member.email || 'No email provided' }}</div>
                </div>
              </div>
              
              <div class="flex items-center space-x-2">
                <!-- Health Status Indicator -->
                <div class="flex items-center space-x-1">
                  <div class="w-2 h-2 rounded-full"
                       :class="getHealthStatusColor(member.healthStatus)"></div>
                  <span class="text-xs text-slate-500">{{ member.healthStatus }}</span>
                </div>
                
                <!-- Actions Menu -->
                <div class="relative">
                  <button 
                    @click="toggleMemberMenu(member.id)"
                    class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01"></path>
                    </svg>
                  </button>
                  
                  <!-- Dropdown Menu -->
                  <div v-if="activeMenuId === member.id" 
                       class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                    <button 
                      @click="viewMemberProfile(member)"
                      class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-gray-50"
                    >
                      View Profile
                    </button>
                    <button 
                      @click="editMember(member)"
                      class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-gray-50"
                    >
                      Edit Information
                    </button>
                    <button 
                      @click="bookAppointmentFor(member)"
                      class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-gray-50"
                    >
                      Book Appointment
                    </button>
                    <button 
                      @click="viewMedicalHistory(member)"
                      class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-gray-50"
                    >
                      Medical History
                    </button>
                    <div class="border-t border-gray-100 my-1"></div>
                    <button 
                      @click="removeMember(member)"
                      class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Remove Member
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Stats for Member -->
            <div class="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div class="text-center">
                <div class="text-lg font-semibold text-slate-800">{{ member.stats.lastVisit }}</div>
                <div class="text-xs text-slate-500">Days Since Visit</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-semibold text-slate-800">{{ member.stats.appointments }}</div>
                <div class="text-xs text-slate-500">Total Appointments</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-semibold text-slate-800">{{ member.stats.compliance }}%</div>
                <div class="text-xs text-slate-500">Task Compliance</div>
              </div>
            </div>

            <!-- Recent Activity -->
            <div v-if="member.recentActivity.length > 0" class="mt-4 pt-4 border-t border-gray-100">
              <div class="text-sm font-medium text-slate-700 mb-2">Recent Activity</div>
              <div class="space-y-1">
                <div 
                  v-for="activity in member.recentActivity.slice(0, 2)"
                  :key="activity.id"
                  class="text-xs text-slate-600"
                >
                  {{ activity.description }} • {{ formatTimeAgo(activity.date) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Family Notes Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-slate-800">Family Notes</h2>
          <button 
            @click="editFamilyNotes"
            class="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Edit Notes
          </button>
        </div>
        
        <div v-if="!familyNotes.trim()" class="text-center py-6">
          <svg class="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          <p class="text-gray-500 text-sm">No family notes yet. Add important information about your family's dental care.</p>
        </div>
        
        <div v-else class="prose prose-sm text-slate-700">
          <p>{{ familyNotes }}</p>
        </div>
      </div>
    </main>

    <!-- Add Family Member Modal -->
    <div v-if="showAddMemberModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-slate-800">Add Family Member</h3>
          <button @click="closeAddMemberModal" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="addFamilyMember" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">First Name</label>
              <input 
                v-model="newMember.firstName"
                type="text" 
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
              <input 
                v-model="newMember.lastName"
                type="text" 
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Relationship</label>
              <select v-model="newMember.relationship" required class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option value="">Select relationship...</option>
                <option value="spouse">Spouse/Partner</option>
                <option value="child">Child</option>
                <option value="parent">Parent</option>
                <option value="sibling">Sibling</option>
                <option value="grandparent">Grandparent</option>
                <option value="grandchild">Grandchild</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Age</label>
              <input 
                v-model="newMember.age"
                type="number" 
                min="0"
                max="120"
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
            <input 
              v-model="newMember.dateOfBirth"
              type="date" 
              required
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Email (Optional)</label>
            <input 
              v-model="newMember.email"
              type="email"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Phone (Optional)</label>
            <input 
              v-model="newMember.phone"
              type="tel"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Medical Conditions (Optional)</label>
            <textarea 
              v-model="newMember.medicalConditions"
              rows="3"
              placeholder="Any known allergies, medical conditions, or special considerations..."
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Insurance Information (Optional)</label>
            <input 
              v-model="newMember.insurance"
              type="text"
              placeholder="Insurance provider and policy number"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div class="flex items-center space-x-2">
            <input 
              v-model="newMember.shareData"
              type="checkbox"
              id="shareData"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label for="shareData" class="text-sm text-slate-700">
              Allow this member to access and manage family dental data
            </label>
          </div>

          <div class="flex space-x-3 mt-6">
            <button 
              type="button"
              @click="closeAddMemberModal"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Member Modal -->
    <div v-if="showEditMemberModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-slate-800">Edit {{ editingMember?.name }}</h3>
          <button @click="closeEditMemberModal" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveEditMember" class="space-y-4">
          <!-- Similar form fields as add member, but pre-populated -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">First Name</label>
              <input 
                v-model="editMemberForm.firstName"
                type="text" 
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
              <input 
                v-model="editMemberForm.lastName"
                type="text" 
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <input 
              v-model="editMemberForm.email"
              type="email"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Phone</label>
            <input 
              v-model="editMemberForm.phone"
              type="tel"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div class="flex space-x-3 mt-6">
            <button 
              type="button"
              @click="closeEditMemberModal"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Click outside to close menu -->
    <div v-if="activeMenuId" @click="activeMenuId = null" class="fixed inset-0 z-5"></div>

    <!-- Floating Chat Button -->
    <button 
      @click="openChat"
      class="fixed bottom-24 right-4 w-14 h-14 bg-accent-500 hover:bg-accent-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
      </svg>
    </button>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'FamilyManagement',
  setup() {
    const router = useRouter()
    
    // Reactive data
    const showAddMemberModal = ref(false)
    const showEditMemberModal = ref(false)
    const activeMenuId = ref(null)
    const editingMember = ref(null)
    const familyNotes = ref("Family dental care plan: Regular checkups every 6 months. Sarah has sensitive teeth - needs fluoride treatments. Michael is due for orthodontic consultation.")

    // Forms
    const newMember = ref({
      firstName: '',
      lastName: '',
      relationship: '',
      age: '',
      dateOfBirth: '',
      email: '',
      phone: '',
      medicalConditions: '',
      insurance: '',
      shareData: false
    })

    const editMemberForm = ref({
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    })

    // Sample data - replace with API calls
    const primaryAccount = ref({
      id: 0,
      name: 'Sarah Johnson',
      initials: 'SJ',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      isPrimary: true
    })

    const familyMembers = ref([
      {
        id: 0,
        name: 'Sarah Johnson',
        initials: 'SJ',
        relationship: 'self',
        age: 34,
        email: 'sarah.johnson@email.com',
        phone: '+1 (555) 123-4567',
        healthStatus: 'good',
        isPrimary: true,
        stats: {
          lastVisit: 23,
          appointments: 12,
          compliance: 92
        },
        recentActivity: [
          {
            id: 1,
            description: 'Completed daily fluoride rinse',
            date: new Date('2024-07-05')
          },
          {
            id: 2,
            description: 'Uploaded oral health photo',
            date: new Date('2024-07-04')
          }
        ]
      },
      {
        id: 1,
        name: 'Michael Johnson',
        initials: 'MJ',
        relationship: 'spouse',
        age: 36,
        email: 'michael.johnson@email.com',
        phone: '+1 (555) 123-4568',
        healthStatus: 'excellent',
        stats: {
          lastVisit: 45,
          appointments: 8,
          compliance: 85
        },
        recentActivity: [
          {
            id: 1,
            description: 'Completed cleaning appointment',
            date: new Date('2024-07-03')
          },
          {
            id: 2,
            description: 'Started whitening treatment',
            date: new Date('2024-06-30')
          }
        ]
      },
      {
        id: 2,
        name: 'Emily Johnson',
        initials: 'EJ',
        relationship: 'child',
        age: 12,
        email: '',
        phone: '',
        healthStatus: 'needs-attention',
        stats: {
          lastVisit: 67,
          appointments: 15,
          compliance: 78
        },
        recentActivity: [
          {
            id: 1,
            description: 'Orthodontic adjustment scheduled',
            date: new Date('2024-07-02')
          },
          {
            id: 2,
            description: 'Missed brushing reminder',
            date: new Date('2024-07-01')
          }
        ]
      },
      {
        id: 3,
        name: 'David Johnson',
        initials: 'DJ',
        relationship: 'child',
        age: 8,
        email: '',
        phone: '',
        healthStatus: 'good',
        stats: {
          lastVisit: 34,
          appointments: 6,
          compliance: 95
        },
        recentActivity: [
          {
            id: 1,
            description: 'Completed evening brushing',
            date: new Date('2024-07-05')
          },
          {
            id: 2,
            description: 'Fluoride treatment completed',
            date: new Date('2024-07-04')
          }
        ]
      }
    ])

    // Computed properties
    const otherFamilyMembers = computed(() => {
      return familyMembers.value.filter(member => !member.isPrimary)
    })

    const upcomingAppointments = computed(() => {
      // TODO: Calculate from actual appointment data
      return 3
    })

    // Methods
    const toggleMemberMenu = (memberId) => {
      activeMenuId.value = activeMenuId.value === memberId ? null : memberId
    }

    const getAvatarClass = (relationship) => {
      const colors = {
        spouse: 'bg-purple-500',
        child: 'bg-green-500',
        parent: 'bg-blue-500',
        sibling: 'bg-yellow-500',
        grandparent: 'bg-indigo-500',
        grandchild: 'bg-pink-500',
        other: 'bg-gray-500'
      }
      return colors[relationship] || 'bg-gray-500'
    }

    const getHealthStatusColor = (status) => {
      const colors = {
        excellent: 'bg-green-500',
        good: 'bg-blue-500',
        'needs-attention': 'bg-yellow-500',
        poor: 'bg-red-500'
      }
      return colors[status] || 'bg-gray-500'
    }

    const formatTimeAgo = (date) => {
      const now = new Date()
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
      
      if (diffInHours < 24) {
        return `${diffInHours}h ago`
      } else {
        const diffInDays = Math.floor(diffInHours / 24)
        return `${diffInDays}d ago`
      }
    }

    const addFamilyMember = () => {
      // TODO: Send API request to add family member
      console.log('Adding family member:', newMember.value)
      
      // Create new member object
      const member = {
        id: Date.now(),
        name: `${newMember.value.firstName} ${newMember.value.lastName}`,
        initials: `${newMember.value.firstName[0]}${newMember.value.lastName[0]}`,
        relationship: newMember.value.relationship,
        age: parseInt(newMember.value.age),
        email: newMember.value.email,
        phone: newMember.value.phone,
        healthStatus: 'good', // Default status
        stats: {
          lastVisit: 0,
          appointments: 0,
          compliance: 100
        },
        recentActivity: []
      }
      
      familyMembers.value.push(member)
      closeAddMemberModal()
    }

    const closeAddMemberModal = () => {
      showAddMemberModal.value = false
      newMember.value = {
        firstName: '',
        lastName: '',
        relationship: '',
        age: '',
        dateOfBirth: '',
        email: '',
        phone: '',
        medicalConditions: '',
        insurance: '',
        shareData: false
      }
    }

    const editMember = (member) => {
      editingMember.value = member
      editMemberForm.value = {
        firstName: member.name.split(' ')[0],
        lastName: member.name.split(' ')[1] || '',
        email: member.email,
        phone: member.phone
      }
      showEditMemberModal.value = true
      activeMenuId.value = null
    }

    const closeEditMemberModal = () => {
      showEditMemberModal.value = false
      editingMember.value = null
      editMemberForm.value = {
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      }
    }

    const saveEditMember = () => {
      // TODO: Send API request to update member
      console.log('Updating member:', editingMember.value.id, editMemberForm.value)
      
      // Update the member in the array
      const memberIndex = familyMembers.value.findIndex(m => m.id === editingMember.value.id)
      if (memberIndex !== -1) {
        familyMembers.value[memberIndex] = {
          ...familyMembers.value[memberIndex],
          name: `${editMemberForm.value.firstName} ${editMemberForm.value.lastName}`,
          initials: `${editMemberForm.value.firstName[0]}${editMemberForm.value.lastName[0]}`,
          email: editMemberForm.value.email,
          phone: editMemberForm.value.phone
        }
      }
      
      closeEditMemberModal()
    }

    const viewMemberProfile = (member) => {
      // TODO: Navigate to member profile or show detailed view
      console.log('Viewing profile for:', member.name)
      activeMenuId.value = null
    }

    const bookAppointmentFor = (member) => {
      // TODO: Navigate to appointment booking with member pre-selected
      console.log('Booking appointment for:', member.name)
      router.push(`/patient/all-appointments?member=${member.id}`)
      activeMenuId.value = null
    }

    const viewMedicalHistory = (member) => {
      // TODO: Navigate to medical history filtered for this member
      console.log('Viewing medical history for:', member.name)
      router.push(`/patient/medical-records?member=${member.id}`)
      activeMenuId.value = null
    }

    const removeMember = (member) => {
      // TODO: Show confirmation dialog and send API request
      if (confirm(`Are you sure you want to remove ${member.name} from your family account?`)) {
        console.log('Removing member:', member.id)
        const index = familyMembers.value.findIndex(m => m.id === member.id)
        if (index !== -1) {
          familyMembers.value.splice(index, 1)
        }
      }
      activeMenuId.value = null
    }

    const editFamilyNotes = () => {
      // TODO: Show edit modal for family notes
      const newNotes = prompt('Edit family notes:', familyNotes.value)
      if (newNotes !== null) {
        familyNotes.value = newNotes
        // TODO: Save to API
        console.log('Updated family notes:', newNotes)
      }
    }

    const openChat = () => {
      // TODO: Open chat interface
      console.log('Opening chat...')
    }

    onMounted(() => {
      // TODO: Fetch family members from API
      console.log('Fetching family members...')
    })

    return {
      // Reactive data
      showAddMemberModal,
      showEditMemberModal,
      activeMenuId,
      editingMember,
      familyNotes,
      newMember,
      editMemberForm,
      primaryAccount,
      familyMembers,
      
      // Computed
      otherFamilyMembers,
      upcomingAppointments,
      
      // Methods
      toggleMemberMenu,
      getAvatarClass,
      getHealthStatusColor,
      formatTimeAgo,
      addFamilyMember,
      closeAddMemberModal,
      editMember,
      closeEditMemberModal,
      saveEditMember,
      viewMemberProfile,
      bookAppointmentFor,
      viewMedicalHistory,
      removeMember,
      editFamilyNotes,
      openChat
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
.bg-neutral-50 { background-color: #F8FAFC; }

/* Modal backdrop blur */
.fixed.inset-0.bg-black.bg-opacity-50 {
  backdrop-filter: blur(4px);
}

/* Custom scrollbar for modal content */
.max-h-\[90vh\]::-webkit-scrollbar {
  width: 4px;
}

.max-h-\[90vh\]::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.max-h-\[90vh\]::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.max-h-\[90vh\]::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Dropdown menu animation */
.absolute.right-0.mt-2 {
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Checkbox styling */
input[type="checkbox"]:checked {
  background-color: #0066CC;
  border-color: #0066CC;
}

input[type="checkbox"]:focus {
  ring-color: #0066CC;
  border-color: #0066CC;
}

/* Form input focus states */
input:focus,
select:focus,
textarea:focus {
  outline: none;
  ring: 2px;
  ring-color: #0066CC;
  border-color: transparent;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .grid-cols-2 {
    grid-template-columns: 1fr;
  }
  
  .grid-cols-3 {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }
  
  .text-lg {
    font-size: 1rem;
  }
  
  .text-xl {
    font-size: 1.125rem;
  }
}

/* Health status indicators */
.bg-green-500 { background-color: #10b981; }
.bg-blue-500 { background-color: #3b82f6; }
.bg-yellow-500 { background-color: #f59e0b; }
.bg-red-500 { background-color: #ef4444; }
.bg-purple-500 { background-color: #8b5cf6; }
.bg-indigo-500 { background-color: #6366f1; }
.bg-pink-500 { background-color: #ec4899; }
.bg-gray-500 { background-color: #6b7280; }

/* Hover effects for interactive elements */
.hover\:shadow-sm:hover {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.transition-shadow {
  transition: box-shadow 0.15s ease-in-out;
}

.transition-colors {
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
}
</style>
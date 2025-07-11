<!--
  Doctor/Secretary Layout Component
  
  Main layout wrapper for doctor and secretary interfaces with:
  - Bottom navigation (3 icons)
  - Hamburger menu on LEFT with role-specific options
  - Toast notifications
  - Responsive design with medical trust colors
  - Role Switcher for development testing
-->
<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Role Switcher for Development Testing -->
    <RoleSwitcher />
    
    <!-- Header with hamburger menu -->
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div class="flex items-center justify-between px-4 py-3">
        <!-- Hamburger Menu Button - NOW ON LEFT -->
        <button 
          @click="toggleMenu"
          class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Open menu"
        >
          <svg class="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- Logo and Role Indicator - NOW ON RIGHT -->
        <div class="flex items-center space-x-3">
          <div>
            <h1 class="text-lg font-semibold text-slate-800 text-right">
              {{ userRole === 'doctor' ? 'Doctor Portal' : 'Secretary Portal' }}
            </h1>
            <p class="text-xs text-slate-500 text-right">{{ currentUser?.username || 'User' }}</p>
          </div>
          <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="pb-20">
      <!-- Dynamic content based on current route -->
      <router-view 
        :key="$route.fullPath"
        @show-toast="showToast"
        @show-error="showError"
        @show-success="showSuccess"
      />
    </main>

    <!-- Bottom Navigation Bar -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-30">
      <div class="flex justify-around items-center">
        <!-- Left Icon: Patient Management -->
        <router-link 
          :to="'/doctor-secretary/patients'"
          class="nav-item"
          :class="isPatientManagementActive ? 'nav-item-active' : ''"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span class="text-xs font-medium">Patients</span>
        </router-link>

        <!-- Center Icon: Dashboard (Default) -->
        <router-link 
          :to="'/doctor-secretary/dashboard'"
          class="nav-item"
          :class="$route.path === '/doctor-secretary/dashboard' ? 'nav-item-active' : ''"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4" />
          </svg>
          <span class="text-xs font-medium">Dashboard</span>
        </router-link>

        <!-- Right Icon: Communication Hub - FIXED LINK -->
        <router-link 
          :to="'/doctor-secretary/communication'"
          class="nav-item relative"
          :class="isCommunicationActive ? 'nav-item-active' : ''"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span class="text-xs font-medium">Chat</span>
          <!-- Unread message badge -->
          <span v-if="unreadMessages > 0" class="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {{ unreadMessages > 9 ? '9+' : unreadMessages }}
          </span>
        </router-link>
      </div>
    </nav>

    <!-- Hamburger Menu Overlay -->
    <Transition name="menu-overlay">
      <div 
        v-if="isMenuOpen" 
        class="fixed inset-0 bg-black bg-opacity-50 z-50"
        @click="closeMenu"
      />
    </Transition>

    <!-- Hamburger Menu - NOW SLIDES FROM LEFT -->
    <Transition name="menu-slide-left">
      <div 
        v-if="isMenuOpen" 
        class="fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 overflow-y-auto"
      >
        <div class="p-4">
          <!-- Menu Header -->
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-slate-800">Menu</h2>
            <button 
              @click="closeMenu"
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Menu Items -->
          <div class="space-y-2">
            <!-- Appointment Center -->
            <div class="menu-section">
              <h3 class="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Appointment Center</h3>
              <router-link 
                v-if="userRole === 'doctor'"
                :to="'/doctor-secretary/appointments'"
                class="menu-item"
                @click="closeMenu"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a1 1 0 001 1h6a1 1 0 001-1V11a1 1 0 00-1-1H9a1 1 0 00-1 1z" />
                </svg>
                Appointment Management
              </router-link>
              
              <router-link 
                v-if="userRole === 'secretary'"
                :to="'/doctor-secretary/appointment-approval'"
                class="menu-item"
                @click="closeMenu"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Appointment Approval
              </router-link>
              
              <router-link 
                v-if="userRole === 'secretary'"
                :to="'/doctor-secretary/scheduling-dashboard'"
                class="menu-item"
                @click="closeMenu"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Scheduling Dashboard
              </router-link>
            </div>

            <!-- Task & Compliance -->
            <div class="menu-section">
              <h3 class="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Task & Compliance</h3>
              <router-link 
                v-if="userRole === 'doctor'"
                :to="'/doctor-secretary/task-templates'"
                class="menu-item"
                @click="closeMenu"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Task Templates
              </router-link>
              
              <router-link 
                :to="'/doctor-secretary/compliance-reports'"
                class="menu-item"
                @click="closeMenu"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Compliance Reports
              </router-link>
            </div>

            <!-- Secretary Tools (Secretary Only) -->
            <div v-if="userRole === 'secretary'" class="menu-section">
              <h3 class="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Secretary Tools</h3>
              <router-link 
                :to="'/doctor-secretary/reminder-system'"
                class="menu-item"
                @click="closeMenu"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5V9a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Reminder System
              </router-link>
              
              <router-link 
                :to="'/doctor-secretary/patient-records-overview'"
                class="menu-item"
                @click="closeMenu"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Patient Records Overview
              </router-link>
              
              <router-link 
                :to="'/doctor-secretary/clinic-flow'"
                class="menu-item"
                @click="closeMenu"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Clinic Flow Management
              </router-link>
            </div>

            <!-- Profile & Settings -->
            <div class="menu-section">
              <h3 class="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Account</h3>
              <router-link 
                :to="'/doctor-secretary/profile'"
                class="menu-item"
                @click="closeMenu"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile & Settings
              </router-link>
              
              <button 
                @click="handleSignOut"
                class="menu-item w-full text-left text-red-600 hover:bg-red-50"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toast Notifications -->
    <Transition name="toast">
      <div 
        v-if="toast.visible" 
        class="fixed top-4 right-4 z-50 max-w-sm bg-white rounded-lg shadow-lg border p-4"
        :class="toastClasses"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg v-if="toast.type === 'success'" class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else-if="toast.type === 'error'" class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <svg v-else class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-3 flex-1">
            <p class="text-sm font-medium text-slate-800">{{ toast.message }}</p>
          </div>
          <button 
            @click="hideToast"
            class="ml-3 flex-shrink-0 p-1 rounded-md hover:bg-gray-100"
          >
            <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import RoleSwitcher from '@/components/dev/RoleSwitcher.vue'

export default {
  name: 'DoctorSecretaryLayout',
  components: {
    RoleSwitcher
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    // ==========================================
    // REACTIVE STATE
    // ==========================================
    
    const isMenuOpen = ref(false)
    const unreadMessages = ref(3) // Mock data - replace with real data
    
    // Toast notification state
    const toast = ref({
      visible: false,
      message: '',
      type: 'info' // 'success', 'error', 'info'
    })
    
    // ==========================================
    // COMPUTED PROPERTIES
    // ==========================================
    
    const currentUser = computed(() => authStore.user)
    const userRole = computed(() => authStore.user?.role)
    
    // Navigation active states
    const isPatientManagementActive = computed(() => {
      const path = router.currentRoute.value.path
      return path.includes('/patients') || 
             path.includes('/clinical-notes') || 
             path.includes('/ai-diagnostics')
    })
    
    const isCommunicationActive = computed(() => {
      const path = router.currentRoute.value.path
      return path.includes('/communication')
    })
    
    const toastClasses = computed(() => {
      const baseClasses = 'border-l-4'
      switch (toast.value.type) {
        case 'success':
          return `${baseClasses} border-green-500 bg-green-50`
        case 'error':
          return `${baseClasses} border-red-500 bg-red-50`
        default:
          return `${baseClasses} border-blue-500 bg-blue-50`
      }
    })
    
    // ==========================================
    // METHODS
    // ==========================================
    
    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value
    }
    
    const closeMenu = () => {
      isMenuOpen.value = false
    }
    
    const handleSignOut = async () => {
      try {
        await authStore.signOut()
        await router.push('/auth/login')
      } catch (error) {
        console.error('Sign out error:', error)
      }
    }
    
    // Toast notification methods
    const showToast = (message, type = 'info') => {
      toast.value = {
        visible: true,
        message,
        type
      }
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        hideToast()
      }, 5000)
    }
    
    const showSuccess = (message) => {
      showToast(message, 'success')
    }
    
    const showError = (message) => {
      showToast(message, 'error')
    }
    
    const hideToast = () => {
      toast.value.visible = false
    }
    
    // ==========================================
    // LIFECYCLE
    // ==========================================
    
    onMounted(() => {
      // Initialize component
      console.log('Doctor/Secretary layout mounted')
    })
    
    // ==========================================
    // RETURN FOR TEMPLATE
    // ==========================================
    
    return {
      // State
      isMenuOpen,
      unreadMessages,
      toast,
      
      // Computed
      currentUser,
      userRole,
      isPatientManagementActive,
      isCommunicationActive,
      toastClasses,
      
      // Methods
      toggleMenu,
      closeMenu,
      handleSignOut,
      showToast,
      showSuccess,
      showError,
      hideToast
    }
  }
}
</script>

<style scoped>
/* Navigation styles */
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: color 0.2s ease;
  text-decoration: none;
  padding: 0.75rem;
  border-radius: 0.5rem;
}

.nav-item:hover {
  color: #1e293b;
}

.nav-item-active {
  color: #00A86B;
  background-color: #f0fdf4;
}

/* Menu styles */
.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  color: #374151;
  transition: all 0.2s ease;
  text-decoration: none;
}

.menu-item:hover {
  background-color: #f9fafb;
  transform: translateX(2px);
}

.menu-section {
  margin-bottom: 1.5rem;
}

/* Transition animations */
.menu-overlay-enter-active,
.menu-overlay-leave-active {
  transition: opacity 0.3s ease;
}

.menu-overlay-enter-from,
.menu-overlay-leave-to {
  opacity: 0;
}

/* LEFT SIDE MENU ANIMATION */
.menu-slide-left-enter-active,
.menu-slide-left-leave-active {
  transition: transform 0.3s ease;
}

.menu-slide-left-enter-from,
.menu-slide-left-leave-to {
  transform: translateX(-100%);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Tailwind custom classes */
.bg-primary-50 { background-color: #eff6ff; }
.bg-primary-600 { background-color: #0066CC; }
.text-primary-600 { color: #0066CC; }
.bg-secondary-50 { background-color: #f0fdf4; }
.text-secondary-600 { color: #00A86B; }
.bg-accent-500 { background-color: #FF6B35; }
.bg-accent-600 { background-color: #e55a2b; }
</style>
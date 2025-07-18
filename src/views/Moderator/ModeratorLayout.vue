<!--
  Moderator Layout Component
  
  Main layout wrapper for moderator interface with:
  - Bottom navigation (3 icons: Treatment Plans, Task Templates, System Admin)
  - Hamburger menu on LEFT with moderator-specific options
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
        <!-- Hamburger Menu Button - ON LEFT -->
        <button 
          @click="toggleMenu"
          class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Open menu"
        >
          <svg class="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- Logo and Role Indicator - ON RIGHT -->
        <div class="flex items-center space-x-3">
          <div>
            <h1 class="text-lg font-semibold text-slate-800 text-right">
              Moderator Portal
            </h1>
            <p class="text-xs text-slate-500 text-right">{{ currentUser?.username || 'User' }}</p>
          </div>
          <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
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
        <!-- Left Icon: Treatment Plans -->
        <router-link 
          :to="'/moderator/treatment-plans'"
          class="nav-item"
          :class="isTreatmentPlansActive ? 'nav-item-active' : ''"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span class="text-xs font-medium">Treatment Plans</span>
        </router-link>

        <!-- Center Icon: Task Templates -->
        <router-link 
          :to="'/moderator/task-templates'"
          class="nav-item"
          :class="isTaskTemplatesActive ? 'nav-item-active' : ''"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <span class="text-xs font-medium">Task Templates</span>
        </router-link>

        <!-- Right Icon: System Admin -->
        <router-link 
          :to="'/moderator/system-admin'"
          class="nav-item"
          :class="isSystemAdminActive ? 'nav-item-active' : ''"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span class="text-xs font-medium">System Admin</span>
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

    <!-- Hamburger Menu - SLIDES FROM LEFT -->
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
            <!-- Dashboard -->
            <div class="menu-section">
              <h3 class="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Overview</h3>
              <router-link 
                :to="'/moderator/dashboard'"
                class="menu-item"
                @click="closeMenu"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
                Dashboard
              </router-link>
            </div>

            <!-- Core Features -->
            <div class="menu-section">
              <h3 class="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Core Features</h3>
              <router-link 
                :to="'/moderator/treatment-plans'"
                class="menu-item"
                @click="closeMenu"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Treatment Plan Generator
              </router-link>
              <router-link 
                :to="'/moderator/treatment-plan-requests'"
                class="menu-item"
                @click="closeMenu"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 8h6m-6 4h6" />
                </svg>
                Treatment Plan Requests
              </router-link>
              <router-link 
                :to="'/moderator/task-templates'"
                class="menu-item"
                @click="closeMenu"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Task Template Management
              </router-link>
            </div>

            <!-- System Administration -->
            <div class="menu-section">
              <h3 class="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">System Administration</h3>
              <router-link 
                :to="'/moderator/clinic-management'"
                class="menu-item"
                @click="closeMenu"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Clinic Management
              </router-link>
              
              <router-link 
                :to="'/moderator/subscription-management'"
                class="menu-item"
                @click="closeMenu"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Subscription Management
              </router-link>
              
              <router-link 
                :to="'/moderator/system-analytics'"
                class="menu-item"
                @click="closeMenu"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                System Analytics
              </router-link>
              
              <router-link 
                :to="'/moderator/ai-configuration'"
                class="menu-item"
                @click="closeMenu"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI Model Configuration
              </router-link>
              
              <router-link 
                :to="'/moderator/database-tools'"
                class="menu-item"
                @click="closeMenu"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
                Database Tools
              </router-link>
              
              <router-link 
                :to="'/moderator/security-settings'"
                class="menu-item"
                @click="closeMenu"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Security Settings
              </router-link>
            </div>

            <!-- Profile & Settings -->
            <div class="menu-section">
              <h3 class="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Account</h3>
              <router-link 
                :to="'/moderator/profile'"
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
  name: 'ModeratorLayout',
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
    
    // Navigation active states
    const isTreatmentPlansActive = computed(() => {
      const path = router.currentRoute.value.path
      return path.includes('/treatment-plans')
    })
    
    const isTaskTemplatesActive = computed(() => {
      const path = router.currentRoute.value.path
      return path.includes('/task-templates')
    })
    
    const isSystemAdminActive = computed(() => {
      const path = router.currentRoute.value.path
      return path.includes('/system-admin') || 
             path.includes('/clinic-management') ||
             path.includes('/subscription-management') ||
             path.includes('/system-analytics') ||
             path.includes('/ai-configuration') ||
             path.includes('/database-tools') ||
             path.includes('/security-settings')||
             path.includes('/treatment-plan-requests')
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
      console.log('Moderator layout mounted')
    })
    
    // ==========================================
    // RETURN FOR TEMPLATE
    // ==========================================
    
    return {
      // State
      isMenuOpen,
      toast,
      
      // Computed
      currentUser,
      isTreatmentPlansActive,
      isTaskTemplatesActive,
      isSystemAdminActive,
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
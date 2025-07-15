<!-- Patient Layout Wrapper Component -->
<template>
  <div class="min-h-screen bg-neutral-50 relative">
    <!-- Loading Overlay -->
    <div v-if="isLoading" class="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
      <div class="flex flex-col items-center space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p class="text-slate-600">Loading...</p>
      </div>
    </div>

    <!-- Header with hamburger menu (SAME LOGIC AS DoctorSecretaryLayout) -->
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div class="flex items-center justify-between px-4 py-3">
        <!-- Hamburger Menu Button - LEFT SIDE -->
        <button 
          @click="toggleMenu"
          class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Open menu"
        >
          <svg class="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- Patient Info and Role Indicator - RIGHT SIDE -->
        <div class="flex items-center space-x-3">
          <div>
            <h1 class="text-lg font-semibold text-slate-800 text-right">Patient Portal</h1>
            <p class="text-xs text-slate-500 text-right">{{ userName }}</p>
          </div>
          <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span class="text-white text-sm font-semibold">{{ userInitials }}</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Hamburger Menu Overlay -->
    <transition name="menu-overlay">
      <div
        v-if="isMenuOpen"
        class="fixed inset-0 bg-black bg-opacity-50 z-50"
        @click="closeMenu"
      />
    </transition>

    <!-- Hamburger Menu Panel (SLIDES FROM LEFT) -->
    <transition name="menu-slide-left">
      <div
        v-if="isMenuOpen"
        class="fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform"
      >
        <!-- Menu Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Menu</h2>
          <button @click="closeMenu" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Menu Items -->
        <nav class="p-4 space-y-2">
          <router-link 
            to="/patient/family" 
            class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
            @click="closeMenu"
          >
            <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <span class="text-slate-800">Family Management</span>
          </router-link>

          <router-link 
            to="/patient/all-appointments" 
            class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
            @click="closeMenu"
          >
            <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span class="text-slate-800">All Appointments</span>
          </router-link>

          <router-link 
            to="/patient/profile" 
            class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
            @click="closeMenu"
          >
            <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            <span class="text-slate-800">Profile & Settings</span>
          </router-link>

          <hr class="my-4">

          <button 
            @click="handleLogout"
            class="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 transition-colors w-full text-left"
          >
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            <span class="text-red-600">Sign Out</span>
          </button>
        </nav>

        <!-- Menu Footer -->
        <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <div class="text-center text-xs text-slate-500">
            Dental Clinic Management v1.0
          </div>
        </div>
      </div>
    </transition>

    <!-- Main Content Area -->
    <main class="pb-20">
      <div class="pb-20" :class="{ 'blur-sm': isLoading }">
        <!-- Route-specific content -->
        <router-view 
          :key="$route.fullPath"
          @loading="handleLoading"
          @error="handleError"
        />
      </div>
    </main>

    <!-- Bottom Navigation Bar -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40" v-if="showBottomNav">
      <div class="grid grid-cols-3 h-16">
        <!-- Task Management -->
        <router-link 
          to="/patient/tasks"
          class="nav-item"
          :class="{ 'nav-item-active': isActiveRoute('/patient/tasks') }"
          @click="trackNavigation('tasks')"
        >
          <div class="relative">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
            <!-- Task count badge -->
            <span v-if="pendingTasksCount > 0" 
                  class="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
              {{ pendingTasksCount > 9 ? '9+' : pendingTasksCount }}
            </span>
          </div>
          <span class="text-xs mt-1">Tasks</span>
        </router-link>

        <!-- Dashboard -->
        <router-link 
          to="/patient/dashboard"
          class="nav-item"
          :class="{ 'nav-item-active': isActiveRoute('/patient/dashboard') }"
          @click="trackNavigation('dashboard')"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z M3 7l9 6 9-6"></path>
          </svg>
          <span class="text-xs mt-1">Dashboard</span>
        </router-link>

        <!-- Medical Records -->
        <router-link 
          to="/patient/medical-records"
          class="nav-item"
          :class="{ 'nav-item-active': isActiveRoute('/patient/medical-records') }"
          @click="trackNavigation('medical-records')"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <span class="text-xs mt-1">Records</span>
        </router-link>
      </div>
    </nav>

    <!-- Floating Chat Button -->
    <button 
      v-if="showChatButton"
      @click="openChat"
      class="fixed bottom-24 right-4 w-14 h-14 bg-accent-500 hover:bg-accent-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-30"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
      </svg>
      <!-- Unread messages badge -->
      <span v-if="unreadMessagesCount > 0" 
            class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
        {{ unreadMessagesCount > 9 ? '9+' : unreadMessagesCount }}
      </span>
    </button>

    <!-- Error Toast -->
    <transition name="toast">
      <div v-if="errorMessage" 
           class="fixed top-4 left-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg z-50">
        <div class="flex items-center space-x-3">
          <svg class="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>
          <div class="flex-1">
            <div class="font-medium text-red-800">Error</div>
            <div class="text-sm text-red-700">{{ errorMessage }}</div>
          </div>
          <button @click="clearError" class="text-red-500 hover:text-red-700">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </transition>

    <!-- Success Toast -->
    <transition name="toast">
      <div v-if="successMessage" 
           class="fixed top-4 left-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg z-50">
        <div class="flex items-center space-x-3">
          <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          <div class="flex-1">
            <div class="font-medium text-green-800">Success</div>
            <div class="text-sm text-green-700">{{ successMessage }}</div>
          </div>
          <button @click="clearSuccess" class="text-green-500 hover:text-green-700">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'PatientLayout',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const authStore = useAuthStore()

    // ===== REACTIVE STATE =====
    const isMenuOpen = ref(false)
    const isLoading = ref(false)
    const errorMessage = ref(null)
    const successMessage = ref(null)
    const pendingTasksCount = ref(3) // TODO: Get from API
    const unreadMessagesCount = ref(0) // TODO: Get from API

    // ===== COMPUTED PROPERTIES =====
    const userName = computed(() => authStore.user?.username || 'User')
    const userRole = computed(() => authStore.user?.role || 'Patient')
    const userInitials = computed(() => authStore.userInitials)

    const showBottomNav = computed(() => {
      // Hide bottom nav on chat page (full screen)
      return route.meta?.fullScreen !== true
    })

    const showChatButton = computed(() => {
      // Show chat button on all pages except chat page itself
      return route.name !== 'PatientChat'
    })

    // ===== METHODS =====
    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value
    }

    const closeMenu = () => {
      isMenuOpen.value = false
    }

    const openChat = () => {
      router.push('/patient/chat')
      trackNavigation('chat', 'floating-button')
    }

    const isActiveRoute = (routePath) => {
      return route.path === routePath
    }

    const handleLogout = async () => {
      closeMenu()
      
      if (confirm('Are you sure you want to sign out?')) {
        try {
          isLoading.value = true
          await authStore.logout()
          showSuccess('Successfully signed out')
        } catch (error) {
          console.error('Logout error:', error)
          showError('Error signing out. Please try again.')
        } finally {
          isLoading.value = false
        }
      }
    }

    const trackNavigation = (section, source = 'bottom-nav') => {
      // TODO: Send analytics event
      console.log(`Navigation: ${section} from ${source}`)
      authStore.updateLastActivity()
    }

    const handleLoading = (loading) => {
      isLoading.value = loading
    }

    const handleError = (error) => {
      showError(error.message || 'An unexpected error occurred')
    }

    const showError = (message) => {
      errorMessage.value = message
      setTimeout(() => {
        errorMessage.value = null
      }, 5000)
    }

    const showSuccess = (message) => {
      successMessage.value = message
      setTimeout(() => {
        successMessage.value = null
      }, 3000)
    }

    const clearError = () => {
      errorMessage.value = null
    }

    const clearSuccess = () => {
      successMessage.value = null
    }

    // ===== LIFECYCLE HOOKS =====
    onMounted(() => {
      // Initialize any necessary data
      console.log('Patient layout mounted for user:', userName.value)
      
      // TODO: Fetch pending tasks count
      // TODO: Fetch unread messages count
      
      // Close menu on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen.value) {
          closeMenu()
        }
      })

      // Update activity on any user interaction
      const activityEvents = ['click', 'keypress', 'scroll', 'touchstart']
      activityEvents.forEach(event => {
        document.addEventListener(event, () => {
          authStore.updateLastActivity()
        }, { passive: true })
      })
    })

    onUnmounted(() => {
      // Cleanup event listeners
      document.removeEventListener('keydown', closeMenu)
    })

    // ===== WATCHERS =====
    watch(() => route.path, () => {
      // Close menu when route changes
      closeMenu()
      
      // Clear any existing messages
      errorMessage.value = null
      successMessage.value = null
    })

    // Watch for authentication changes
    watch(() => authStore.isAuthenticated, (isAuth) => {
      if (!isAuth) {
        // User logged out, redirect handled by router guard
        console.log('User authentication lost')
      }
    })

    return {
      // State
      isMenuOpen,
      isLoading,
      errorMessage,
      successMessage,
      pendingTasksCount,
      unreadMessagesCount,
      
      // Computed
      userName,
      userRole,
      userInitials,
      showBottomNav,
      showChatButton,
      
      // Methods
      toggleMenu,
      closeMenu,
      openChat,
      isActiveRoute,
      handleLogout,
      trackNavigation,
      handleLoading,
      handleError,
      showError,
      showSuccess,
      clearError,
      clearSuccess
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

/* Transition animations */
.menu-overlay-enter-active,
.menu-overlay-leave-active {
  transition: opacity 0.3s ease;
}

.menu-overlay-enter-from,
.menu-overlay-leave-to {
  opacity: 0;
}

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

/* Color classes */
.bg-primary-50 { background-color: #eff6ff; }
.bg-primary-100 { background-color: #dbeafe; }
.bg-primary-600 { background-color: #0066CC; }
.text-primary-600 { color: #0066CC; }
.text-primary-700 { color: #0052a3; }

.bg-secondary-50 { background-color: #f0fdf4; }
.bg-secondary-600 { background-color: #00A86B; }
.text-secondary-600 { color: #00A86B; }

.bg-accent-500 { background-color: #FF6B35; }
.bg-accent-600 { background-color: #e55a2b; }

.bg-neutral-50 { background-color: #F8FAFC; }

/* Loading animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Badge positioning and styling */
.relative {
  position: relative;
}

.absolute {
  position: absolute;
}

.nav-item .absolute,
.fixed .absolute {
  font-size: 0.625rem;
  line-height: 1;
  min-width: 1.25rem;
  height: 1.25rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

/* Accessibility improvements */
.nav-item:focus {
  outline: 2px solid #0066CC;
  outline-offset: 2px;
}

button:focus {
  outline: 2px solid #0066CC;
  outline-offset: 2px;
}

/* Blur effect when loading */
.blur-sm {
  filter: blur(4px);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .w-80 {
    width: 100vw;
  }
  
  .fixed.bottom-24.right-4 {
    bottom: 6rem;
    right: 1rem;
  }
  
  .fixed.top-4 {
    max-width: calc(100vw - 2rem);
    margin: 0 1rem;
    left: 1rem;
    right: 1rem;
  }
}

@media (min-width: 640px) {
  .fixed.top-4 {
    max-width: 24rem;
    right: 1rem;
    left: auto;
    margin: 0;
  }
}
</style>
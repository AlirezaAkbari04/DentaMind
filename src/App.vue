<!--
  Root Application Component - Updated
  
  This is the main application shell that wraps all other components.
  It handles global application state initialization and provides
  the base layout structure with proper error boundaries.
-->
<template>
  <div id="app" class="min-h-screen bg-slate-50">
    <!-- 
      Loading Screen - Shows while app initializes
    -->
    <div v-if="isInitializing" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="mx-auto w-16 h-16 bg-primary-500 rounded-xl flex items-center justify-center mb-4 animate-pulse">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <p class="text-slate-600">Loading Dental Clinic Management System...</p>
      </div>
    </div>
    
    <!-- 
      Main Application Content
      Router View - This is where all page components will be rendered
      based on the current route (Login, Dashboard, etc.)
    -->
    <router-view v-else />
    
    <!-- 
      Teleport - Provides a portal for modals and overlays to render
      outside the normal component hierarchy (useful for z-index management)
    -->
    <Teleport to="body">
      <div id="modal-root"></div>
    </Teleport>
  </div>
</template>

<script>
/**
 * Root App Component Logic - Updated
 * 
 * Handles application initialization, global state setup, and error handling
 */
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

export default {
  name: 'App',
  
  setup() {
    // ==========================================
    // REACTIVE STATE
    // ==========================================
    
    const isInitializing = ref(true)
    
    // Get access to stores and utilities
    const authStore = useAuthStore()
    const toast = useToast()

    // ==========================================
    // INITIALIZATION FUNCTION
    // ==========================================
    
    /**
     * Initialize application state and services
     */
    const initializeApp = async () => {
      try {
        console.log('🚀 Initializing Dental Clinic Management System...')
        
        // Initialize authentication state from localStorage
        authStore.initializeAuth()
        
        // Check if user was previously authenticated
        if (authStore.isAuthenticated) {
          console.log(`✅ User session restored: ${authStore.user?.username}`)
          
          // You could verify token with backend here
          // await verifyTokenWithBackend()
        } else {
          console.log('ℹ️ No existing user session found')
        }
        
        // Initialize other services here if needed
        // await initializeNotificationService()
        // await loadUserPreferences()
        
        console.log('✅ Application initialized successfully')
        
      } catch (error) {
        console.error('❌ Error initializing application:', error)
        
        // Show user-friendly error message
        toast.error('Failed to initialize application. Please refresh the page.')
        
        // Clear potentially corrupted auth state
        authStore.clearAuth()
      } finally {
        // Always remove loading state
        setTimeout(() => {
          isInitializing.value = false
        }, 500) // Small delay for smooth transition
      }
    }

    // ==========================================
    // LIFECYCLE HOOKS
    // ==========================================
    
    // Initialize application when component mounts
    onMounted(async () => {
      await initializeApp()
    })

    // ==========================================
    // RETURN COMPONENT INTERFACE
    // ==========================================
    
    return {
      isInitializing
    }
  }
}
</script>

<style>
/**
 * Global App Styles - Updated
 * 
 * These styles apply to the entire application with enhancements
 * for loading states and accessibility.
 */

/* Prevent flash of transitions during page load */
body.preload * {
  transition: none !important;
}

/* Ensure full height for proper layout */
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Smooth scrolling for better UX */
html {
  scroll-behavior: smooth;
}

/* Custom focus styles for accessibility */
*:focus {
  outline: 2px solid #0066CC;
  outline-offset: 2px;
}

/* Hide focus outline for mouse users (still visible for keyboard users) */
*:focus:not(:focus-visible) {
  outline: none;
}

/* Custom toast styles for medical theme */
.custom-toast {
  border-radius: 0.75rem;
  font-family: 'Inter', system-ui, sans-serif;
}

.custom-toast-body {
  font-size: 0.875rem;
  line-height: 1.5;
}

/* Loading animation enhancement */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Print styles for medical records */
@media print {
  .no-print {
    display: none !important;
  }
  
  #app {
    background: white !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  * {
    border-color: currentColor !important;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
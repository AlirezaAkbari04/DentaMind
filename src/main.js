/**
 * Main Application Entry Point - Updated
 * 
 * This file initializes the Vue.js application with all necessary
 * plugins, stores, and global configurations for the dental clinic system.
 * 
 * Updated to include proper error handling and authentication initialization.
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// Import toast notifications for user feedback
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

// Import our custom Tailwind CSS styles
import './assets/css/style.css'

// ==========================================
// APPLICATION SETUP
// ==========================================

// Create the main Vue application instance
const app = createApp(App)

// Create Pinia store instance for state management
const pinia = createPinia()

// ==========================================
// PLUGIN REGISTRATION
// ==========================================

// Register Pinia for reactive state management across components
app.use(pinia)

// Register Vue Router for navigation between pages
app.use(router)

// Configure toast notifications with medical-appropriate settings
app.use(Toast, {
  position: 'top-right',           // Show notifications in top-right corner
  timeout: 5000,                   // Auto-dismiss after 5 seconds
  closeOnClick: true,              // Allow click to dismiss
  pauseOnFocusLoss: true,          // Pause timer when window loses focus
  pauseOnHover: true,              // Pause timer on hover
  draggable: true,                 // Allow drag to dismiss
  draggablePercent: 0.6,           // Drag threshold
  showCloseButtonOnHover: false,   // Hide close button by default
  hideProgressBar: false,          // Show progress bar
  closeButton: 'button',           // Show close button as button element
  icon: true,                      // Show icons in notifications
  rtl: false,                      // Left-to-right text direction
  
  // Custom toast styles for medical theme
  toastClassName: 'custom-toast',
  bodyClassName: 'custom-toast-body',
  
  // Custom default options for different toast types
  toastDefaults: {
    success: {
      timeout: 3000,
      hideProgressBar: true
    },
    error: {
      timeout: 7000,
      closeOnClick: false
    },
    warning: {
      timeout: 5000
    }
  }
})

// ==========================================
// GLOBAL ERROR HANDLING
// ==========================================

// Global error handler for uncaught errors
app.config.errorHandler = (error, instance, info) => {
  console.error('Global error:', error)
  console.error('Component instance:', instance)
  console.error('Error info:', info)
  
  // You could send errors to a logging service here
  // Example: errorReportingService.captureException(error)
}

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', event => {
  console.error('Unhandled promise rejection:', event.reason)
  event.preventDefault()
})

// ==========================================
// GLOBAL PROPERTIES
// ==========================================

// Add global properties that can be accessed in all components
app.config.globalProperties.$appName = 'Dental Clinic Management System'
app.config.globalProperties.$appVersion = '1.0.0'

// ==========================================
// DEVELOPMENT HELPERS
// ==========================================

// Add development tools in development mode
if (process.env.NODE_ENV === 'development') {
  // Enable Vue devtools
  app.config.devtools = true
  
  // Add debug information
  console.log('🦷 Dental Clinic Management System - Development Mode')
  console.log('Vue Version:', app.version)
  console.log('Environment:', process.env.NODE_ENV)
  console.log('API URL:', process.env.VUE_APP_API_URL)
}

// ==========================================
// APPLICATION MOUNTING
// ==========================================

// Add preload class to prevent transition flashing
document.body.classList.add('preload')

// Mount the application to the DOM element with id 'app'
app.mount('#app')

// Remove preload class after mounting
setTimeout(() => {
  document.body.classList.remove('preload')
}, 100)
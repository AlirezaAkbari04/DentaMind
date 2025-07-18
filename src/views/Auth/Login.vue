<!--
  Authentication Page Component
  
  This component handles both Sign In and Sign Up functionality for the
  Dental Clinic Management System. It includes:
  
  Features:
  - Toggle between Sign In and Sign Up modes
  - Form validation with real-time error display
  - Password visibility toggles
  - Forgot password modal
  - Role-based redirection after authentication
  - Medical Trust color palette styling
  - Responsive design for all devices
  
  Location: src/views/Auth/Login.vue
-->
<template>
  <!-- 
    Main Container 
    Full height with gradient background using Medical Trust colors
  -->
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      
      <!-- 
        Logo and Branding Section 
        Placeholder for clinic logo with professional medical styling
      -->
      <div class="text-center mb-8">
        <!-- Logo Container - Replace SVG with actual logo when available -->
        <div class="mx-auto w-20 h-20 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
          <!-- Placeholder medical/dental icon -->
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        
        <!-- Application Title -->
        <h1 class="text-2xl font-bold text-slate-900 mb-2"> DentaMind</h1>
        
        <!-- Dynamic subtitle based on current mode -->
        <p class="text-slate-600">{{ isSignUp ? 'Create your account' : 'Welcome back' }}</p>
      </div>

      <!-- 
        Main Authentication Form Card 
        White card with shadow for professional medical appearance
      -->
      <div class="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
        
        <!-- 
          Mode Toggle Buttons 
          Switch between Sign In and Sign Up modes
        -->
        <div class="flex bg-slate-100 rounded-xl p-1 mb-6">
          <button 
            @click="isSignUp = false"
            :class="[
              'flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200',
              !isSignUp ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'
            ]"
          >
            Sign In
          </button>
          <button 
            @click="isSignUp = true"
            :class="[
              'flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200',
              isSignUp ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'
            ]"
          >
            Sign Up
          </button>
        </div>

        <!-- 
          Authentication Form 
          Handles both login and registration with validation
        -->
        <form @submit.prevent="handleSubmit" class="space-y-5">
          
          <!-- 
            Username Field 
            Required for both Sign In and Sign Up
          -->
          <div>
            <label for="username" class="block text-sm font-medium text-slate-700 mb-2">
              Username
            </label>
            <input
              id="username"
              v-model="formData.username"
              type="text"
              required
              class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-slate-400"
              placeholder="Enter your username"
              :class="{ 'border-red-500': errors.username }"
            >
            <!-- Error message display -->
            <p v-if="errors.username" class="mt-1 text-sm text-red-600">{{ errors.username }}</p>
          </div>

          <!-- 
            Email Field 
            Only visible during Sign Up process
          -->
          <div v-if="isSignUp">
            <label for="email" class="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-slate-400"
              placeholder="Enter your email address"
              :class="{ 'border-red-500': errors.email }"
            >
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <!-- 
            Password Field 
            With visibility toggle for better UX
          -->
          <div>
            <label for="password" class="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-slate-400"
                placeholder="Enter your password"
                :class="{ 'border-red-500': errors.password }"
              >
              <!-- Password visibility toggle button -->
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
              >
                <!-- Eye slash icon (password hidden) -->
                <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
                <!-- Eye icon (password visible) -->
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
          </div>

          <!-- 
            Confirm Password Field 
            Only visible during Sign Up for password verification
          -->
          <div v-if="isSignUp">
            <label for="confirmPassword" class="block text-sm font-medium text-slate-700 mb-2">
              Confirm Password
            </label>
            <div class="relative">
              <input
                id="confirmPassword"
                v-model="formData.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-slate-400"
                placeholder="Confirm your password"
                :class="{ 'border-red-500': errors.confirmPassword }"
              >
              <!-- Confirm password visibility toggle -->
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
              >
                <svg v-if="showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">{{ errors.confirmPassword }}</p>
          </div>

          <!-- 
            Remember Me and Forgot Password 
            Only visible during Sign In mode
          -->
          <div v-if="!isSignUp" class="flex items-center justify-between">
            <!-- Remember me checkbox -->
            <div class="flex items-center">
              <input
                id="remember"
                v-model="formData.remember"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              >
              <label for="remember" class="ml-2 block text-sm text-slate-700">
                Remember me
              </label>
            </div>
            <!-- Forgot password link -->
            <button
              type="button"
              @click="showForgotPassword = true"
              class="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Forgot password?
            </button>
          </div>

          <!-- 
            Submit Button 
            Dynamic text and loading state based on current mode
          -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <!-- Loading state with spinner -->
            <span v-if="isLoading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
            <!-- Normal state button text -->
            <span v-else>
              {{ isSignUp ? 'Create Account' : 'Sign In' }}
            </span>
          </button>

          <!-- 
            Error Message Display 
            Shows general authentication errors
          -->
          <div v-if="generalError" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex">
              <!-- Error icon -->
              <svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm text-red-800">{{ generalError }}</p>
            </div>
          </div>
        </form>
      </div>

      <!-- 
        Footer 
        Copyright information
      -->
      <div class="text-center mt-8 text-sm text-slate-600">
        <p>© 2024 DentaMind. All rights reserved.</p>
      </div>
    </div>

    <!-- 
      Forgot Password Modal 
      Overlay modal for password reset functionality
    -->
    <div v-if="showForgotPassword" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Reset Password</h3>
        <p class="text-slate-600 mb-4">Enter your email address and we'll send you a link to reset your password.</p>
        
        <!-- Password reset form -->
        <form @submit.prevent="handleForgotPassword">
          <input
            v-model="forgotPasswordEmail"
            type="email"
            required
            class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
            placeholder="Enter your email address"
          >
          <!-- Modal action buttons -->
          <div class="flex gap-3">
            <button
              type="button"
              @click="showForgotPassword = false"
              class="flex-1 py-2 px-4 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Send Reset Link
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Authentication Component Logic
 * 
 * This script handles all authentication functionality including:
 * - Form validation
 * - API communication
 * - Role-based redirection
 * - Error handling
 * - Password reset functionality
 */

import { ref, reactive } from 'vue'

export default {
  name: 'AuthPage',
  
  setup() {
    // ==========================================
    // REACTIVE STATE VARIABLES
    // ==========================================
    
    // UI state controls
    const isSignUp = ref(false)                    // Toggle between sign in/up modes
    const isLoading = ref(false)                   // Loading state for API calls
    const showPassword = ref(false)                // Password visibility toggle
    const showConfirmPassword = ref(false)         // Confirm password visibility toggle
    const showForgotPassword = ref(false)          // Forgot password modal state
    const forgotPasswordEmail = ref('')            // Email for password reset
    const generalError = ref('')                   // General error message display

    // Form data object with all input fields
    const formData = reactive({
      username: '',           // User's chosen username
      email: '',             // User's email address (sign up only)
      password: '',          // User's password
      confirmPassword: '',   // Password confirmation (sign up only)
      remember: false        // Remember me checkbox (sign in only)
    })

    // Form validation errors object
    const errors = reactive({
      username: '',          // Username validation errors
      email: '',            // Email validation errors
      password: '',         // Password validation errors
      confirmPassword: ''   // Confirm password validation errors
    })

    // ==========================================
    // FORM VALIDATION FUNCTION
    // ==========================================
    
    /**
     * Validates all form fields based on current mode (sign in/up)
     * 
     * @returns {boolean} - True if form is valid, false otherwise
     */
    const validateForm = () => {
      // Clear any existing errors
      Object.keys(errors).forEach(key => {
        errors[key] = ''
      })

      let isValid = true

      // Username validation - required for both modes
      if (!formData.username.trim()) {
        errors.username = 'Username is required'
        isValid = false
      } else if (formData.username.length < 3) {
        errors.username = 'Username must be at least 3 characters long'
        isValid = false
      }

      // Email validation - only required for sign up
      if (isSignUp.value) {
        if (!formData.email.trim()) {
          errors.email = 'Email is required'
          isValid = false
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          errors.email = 'Please enter a valid email address'
          isValid = false
        }
      }

      // Password validation - required for both modes
      if (!formData.password) {
        errors.password = 'Password is required'
        isValid = false
      } else if (formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters long'
        isValid = false
      }

      // Confirm password validation - only required for sign up
      if (isSignUp.value) {
        if (!formData.confirmPassword) {
          errors.confirmPassword = 'Please confirm your password'
          isValid = false
        } else if (formData.password !== formData.confirmPassword) {
          errors.confirmPassword = 'Passwords do not match'
          isValid = false
        }
      }

      return isValid
    }

    // ==========================================
    // AUTHENTICATION HANDLER
    // ==========================================
    
    /**
     * Handles form submission for both sign in and sign up
     * Validates form, makes API call, and redirects based on user role
     */
    const handleSubmit = async () => {
      // Validate form before submission
      if (!validateForm()) return

      // Set loading state
      isLoading.value = true
      generalError.value = ''

      try {
        // Determine API endpoint based on current mode
        const endpoint = isSignUp.value ? '/auth/register' : '/auth/login'
        
        // Prepare payload with conditional fields
        const payload = {
          username: formData.username,
          password: formData.password,
          // Include email only for sign up
          ...(isSignUp.value && { email: formData.email }),
          // Include remember flag only if checked
          ...(formData.remember && { remember: true })
        }

        // Make API call to FastAPI backend
        const response = await fetch(`${process.env.VUE_APP_API_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        })

        const data = await response.json()

        if (response.ok) {
          // Store authentication data in localStorage
          localStorage.setItem('authToken', data.token)
          localStorage.setItem('userRole', data.role)
          localStorage.setItem('userId', data.userId)

          // Redirect based on user role as defined in project requirements
          switch (data.role) {
            case 'admin':
              window.location.href = '/admin/dashboard'
              break
            case 'patient':
              window.location.href = '/patient/dashboard'
              break
            case 'doctor':
              window.location.href = '/doctor-secretary/dashboard'
              break
            case 'secretary':
              window.location.href = '/doctor-secretary/dashboard'
              break
            case 'moderator':
              window.location.href = '/moderator/dashboard'
              break
            default:
              // Fallback for unknown roles
              window.location.href = '/dashboard'
          }
        } else {
          // Display API error message
          generalError.value = data.message || 'Authentication failed. Please try again.'
        }
      } catch (error) {
        // Handle network or other errors
        generalError.value = 'Network error. Please check your connection and try again.'
      } finally {
        // Always clear loading state
        isLoading.value = false
      }
    }

    // ==========================================
    // FORGOT PASSWORD HANDLER
    // ==========================================
    
    /**
     * Handles forgot password functionality
     * Sends password reset email to user
     */
    const handleForgotPassword = async () => {
      if (!forgotPasswordEmail.value) return

      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/auth/forgot-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: forgotPasswordEmail.value })
        })

        if (response.ok) {
          alert('Password reset link sent to your email!')
          showForgotPassword.value = false
          forgotPasswordEmail.value = ''
        } else {
          alert('Error sending reset link. Please try again.')
        }
      } catch (error) {
        alert('Network error. Please try again.')
      }
    }

    // ==========================================
    // COMPONENT EXPORTS
    // ==========================================
    
    // Return all reactive data and functions for use in template
    return {
      // UI state
      isSignUp,
      isLoading,
      showPassword,
      showConfirmPassword,
      showForgotPassword,
      forgotPasswordEmail,
      generalError,
      
      // Form data
      formData,
      errors,
      
      // Functions
      handleSubmit,
      handleForgotPassword
    }
  }
}
</script>

<style scoped>
/**
 * Component-specific styles
 * 
 * These styles are scoped to this component only and provide
 * custom animations and styling enhancements.
 */

/* Loading spinner animation */
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

/* Focus enhancement for accessibility */
input:focus {
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

/* Smooth height transitions for dynamic content */
.space-y-5 > * + * {
  margin-top: 1.25rem;
}

/* Modal backdrop blur effect */
.backdrop-blur {
  backdrop-filter: blur(4px);
}
</style>
/**
 * Authentication Store - Pinia
 * 
 * Manages authentication state across the entire application.
 * Handles login, logout, token management, and user session persistence.
 * 
 * Location: src/stores/auth.js
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // ==========================================
  // STATE VARIABLES
  // ==========================================
  
  /**
   * Current authenticated user data
   * Contains user information returned from login API
   */
  const user = ref(null)
  
  /**
   * Authentication token from backend
   * Used for API authentication
   */
  const token = ref(null)
  
  // ==========================================
  // COMPUTED PROPERTIES
  // ==========================================
  
  /**
   * Computed property to check if user is authenticated
   * @returns {boolean} True if user has valid token
   */
  const isAuthenticated = computed(() => !!token.value)
  
  /**
   * Get current user's role
   * @returns {string|null} User role or null if not authenticated
   */
  const userRole = computed(() => user.value?.role || null)
  
  /**
   * Check if current user has specific role
   * @param {string} role - Role to check against
   * @returns {boolean} True if user has the specified role
   */
  const hasRole = (role) => {
    return userRole.value === role
  }
  
  /**
   * Check if current user has any of the specified roles
   * @param {string[]} roles - Array of roles to check against
   * @returns {boolean} True if user has any of the specified roles
   */
  const hasAnyRole = (roles) => {
    return roles.includes(userRole.value)
  }

  // ==========================================
  // ACTIONS
  // ==========================================
  
  /**
   * Initialize authentication state from localStorage
   * Called when app starts to restore user session
   */
  const initializeAuth = () => {
    try {
      // Retrieve stored authentication data
      const storedToken = localStorage.getItem('authToken')
      const storedUser = localStorage.getItem('user')
      
      // Restore session if valid data exists
      if (storedToken && storedUser) {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
        
        console.log('Authentication restored from localStorage')
      } else {
        console.log('No stored authentication found')
      }
    } catch (error) {
      console.error('Error initializing auth:', error)
      // Clear corrupted data
      clearAuth()
    }
  }

  /**
   * Login user and store authentication data
   * @param {object} userData - User information from login response
   * @param {string} authToken - Authentication token from backend
   */
  const login = (userData, authToken) => {
    try {
      // Set reactive state
      user.value = userData
      token.value = authToken
      
      // Persist to localStorage for session restoration
      localStorage.setItem('authToken', authToken)
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('userRole', userData.role)
      localStorage.setItem('userId', userData.id)
      
      console.log(`User logged in: ${userData.username} (${userData.role})`)
    } catch (error) {
      console.error('Error during login:', error)
    }
  }

  /**
   * Logout user and clear all authentication data
   */
  const logout = () => {
    try {
      // Clear reactive state
      user.value = null
      token.value = null
      
      // Clear localStorage
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      localStorage.removeItem('userRole')
      localStorage.removeItem('userId')
      
      console.log('User logged out successfully')
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  /**
   * Clear authentication data (used for error recovery)
   */
  const clearAuth = () => {
    logout()
  }

  /**
   * Update user information (for profile updates)
   * @param {object} updatedUserData - Updated user information
   */
  const updateUser = (updatedUserData) => {
    try {
      user.value = { ...user.value, ...updatedUserData }
      localStorage.setItem('user', JSON.stringify(user.value))
      console.log('User data updated')
    } catch (error) {
      console.error('Error updating user data:', error)
    }
  }

  /**
   * Check if token is expired (basic check)
   * @returns {boolean} True if token appears to be expired
   */
  const isTokenExpired = () => {
    if (!token.value) return true
    
    try {
      // Basic JWT expiration check (you may want to enhance this)
      const payload = JSON.parse(atob(token.value.split('.')[1]))
      const currentTime = Math.floor(Date.now() / 1000)
      return payload.exp < currentTime
    } catch (error) {
      console.error('Error checking token expiration:', error)
      return true
    }
  }

  // ==========================================
  // RETURN STORE INTERFACE
  // ==========================================
  
  return {
    // State
    user,
    token,
    
    // Computed
    isAuthenticated,
    userRole,
    hasRole,
    hasAnyRole,
    
    // Actions
    initializeAuth,
    login,
    logout,
    clearAuth,
    updateUser,
    isTokenExpired
  }
})
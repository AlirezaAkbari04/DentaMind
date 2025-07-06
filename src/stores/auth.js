/**
 * Authentication Store - Enhanced for Patient Interface
 * 
 * Building on existing auth store structure, adding patient-specific
 * functionality and permissions management.
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

  /**
   * Last activity timestamp for session management
   */
  const lastActivity = ref(Date.now())
  
  // ==========================================
  // COMPUTED PROPERTIES
  // ==========================================
  
  /**
   * Computed property to check if user is authenticated
   * @returns {boolean} True if user has valid token
   */
  const isAuthenticated = computed(() => !!token.value && !isTokenExpired())
  
  /**
   * Get current user's role
   * @returns {string|null} User role or null if not authenticated
   */
  const userRole = computed(() => user.value?.role || null)

  /**
   * Get user initials for display
   * @returns {string} User initials (2 characters)
   */
  const userInitials = computed(() => {
    if (!user.value?.username) return '??'
    const names = user.value.username.split(' ')
    return names.length > 1 
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : names[0].substring(0, 2).toUpperCase()
  })

  /**
   * Check if user is primary account holder
   * @returns {boolean} True if user is primary account holder
   */
  const isPrimaryAccountHolder = computed(() => {
    return user.value?.isPrimaryAccountHolder || false
  })

  /**
   * Get family permissions for current user
   * @returns {Object} Family permissions object
   */
  const familyPermissions = computed(() => {
    return user.value?.familyPermissions || {
      canManageMembers: false,
      canViewMedicalData: false,
      canBookAppointments: false
    }
  })
  
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
   * @param {string[]|string} roles - Array of roles or single role to check against
   * @returns {boolean} True if user has any of the specified roles
   */
  const hasAnyRole = (roles) => {
    if (Array.isArray(roles)) {
      return roles.includes(userRole.value)
    }
    return userRole.value === roles
  }

  // ==========================================
  // PATIENT-SPECIFIC PERMISSION METHODS
  // ==========================================

  /**
   * Check if user can access family member data
   * @param {string|number} memberId - Family member ID to check
   * @returns {boolean} True if user can access member data
   */
  const canAccessMemberData = (memberId) => {
    if (!user.value) return false
    
    // Primary account holder can access all family data
    if (user.value.isPrimaryAccountHolder) return true
    
    // User can always access their own data
    if (memberId && memberId.toString() === user.value.id.toString()) return true
    
    // Check family permissions
    return user.value.familyPermissions?.canViewMedicalData || false
  }

  /**
   * Check if user can manage family members
   * @returns {boolean} True if user can manage family
   */
  const canManageFamily = () => {
    if (!user.value) return false
    return user.value.isPrimaryAccountHolder || 
           user.value.familyPermissions?.canManageMembers || false
  }

  /**
   * Check if user can book appointments for family member
   * @param {string|number} memberId - Family member ID (optional)
   * @returns {boolean} True if user can book appointments
   */
  const canBookAppointments = (memberId = null) => {
    if (!user.value) return false
    
    // Primary account holder can book for anyone
    if (user.value.isPrimaryAccountHolder) return true
    
    // User can book for themselves
    if (!memberId || memberId.toString() === user.value.id.toString()) return true
    
    // Check family permissions
    return user.value.familyPermissions?.canBookAppointments || false
  }

  /**
   * Check if token is valid (not expired)
   * @returns {boolean} True if token is valid
   */
  const isTokenValid = () => {
    if (!token.value) return false
    
    try {
      // Basic JWT expiration check
      const payload = JSON.parse(atob(token.value.split('.')[1]))
      const currentTime = Math.floor(Date.now() / 1000)
      return payload.exp > currentTime
    } catch (error) {
      console.error('Token validation error:', error)
      return false
    }
  }

  /**
   * Get dashboard route for current user role
   * @returns {string} Dashboard route path
   */
  const getDashboardRoute = () => {
    const roleRoutes = {
      patient: '/patient/dashboard',
      doctor: '/doctor-secretary/dashboard',
      secretary: '/doctor-secretary/dashboard',
      admin: '/admin/dashboard',
      moderator: '/moderator/dashboard'
    }
    
    return roleRoutes[user.value?.role] || '/patient/dashboard'
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
      const storedLastActivity = localStorage.getItem('lastActivity')
      
      // Restore session if valid data exists
      if (storedToken && storedUser) {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
        lastActivity.value = parseInt(storedLastActivity) || Date.now()
        
        // Validate token
        if (!isTokenValid()) {
          console.log('Stored token expired, clearing auth')
          clearAuth()
        } else {
          console.log('Authentication restored from localStorage')
        }
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
      
      // Update last activity
      updateLastActivity()
      
      // Persist to localStorage for session restoration
      localStorage.setItem('authToken', authToken)
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('userRole', userData.role)
      localStorage.setItem('userId', userData.id)
      localStorage.setItem('lastActivity', lastActivity.value.toString())
      
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
      lastActivity.value = Date.now()
      
      // Clear localStorage
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      localStorage.removeItem('userRole')
      localStorage.removeItem('userId')
      localStorage.removeItem('lastActivity')
      
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
   * Update last activity timestamp
   */
  const updateLastActivity = () => {
    lastActivity.value = Date.now()
    localStorage.setItem('lastActivity', lastActivity.value.toString())
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

  /**
   * Check for session timeout
   * @returns {boolean} True if session is still valid
   */
  const checkSessionTimeout = () => {
    const TIMEOUT_DURATION = 30 * 60 * 1000 // 30 minutes
    const currentTime = Date.now()
    
    if (isAuthenticated.value && (currentTime - lastActivity.value) > TIMEOUT_DURATION) {
      console.log('Session timed out due to inactivity')
      logout()
      return false
    }
    
    return true
  }

  // ==========================================
  // SESSION MONITORING
  // ==========================================

  /**
   * Start session monitoring for activity and token expiration
   */
  const startSessionMonitoring = () => {
    // Only run in browser environment
    if (typeof window === 'undefined') return

    // Check session every 5 minutes
    setInterval(() => {
      if (isAuthenticated.value) {
        checkSessionTimeout()
        
        // Check if token will expire soon (within 10 minutes)
        if (token.value) {
          try {
            const payload = JSON.parse(atob(token.value.split('.')[1]))
            const expiryTime = payload.exp * 1000
            const timeUntilExpiry = expiryTime - Date.now()
            
            if (timeUntilExpiry < 10 * 60 * 1000 && timeUntilExpiry > 0) {
              console.log('Token expiring soon, consider refreshing')
              // TODO: Implement token refresh logic here
            }
          } catch (error) {
            console.error('Error checking token expiry:', error)
          }
        }
      }
    }, 5 * 60 * 1000) // 5 minutes

    // Update activity on user interactions
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    
    activityEvents.forEach(event => {
      document.addEventListener(event, () => {
        if (isAuthenticated.value) {
          updateLastActivity()
        }
      }, { passive: true })
    })
  }

  // Start session monitoring when store is created
  startSessionMonitoring()

  // ==========================================
  // RETURN STORE INTERFACE
  // ==========================================
  
  return {
    // State
    user,
    token,
    lastActivity,
    
    // Computed
    isAuthenticated,
    userRole,
    userInitials,
    isPrimaryAccountHolder,
    familyPermissions,
    hasRole,
    hasAnyRole,
    
    // Patient-specific permissions
    canAccessMemberData,
    canManageFamily,
    canBookAppointments,
    
    // Token management
    isTokenValid,
    getDashboardRoute,
    
    // Actions
    initializeAuth,
    login,
    logout,
    clearAuth,
    updateUser,
    updateLastActivity,
    isTokenExpired,
    checkSessionTimeout
  }
})
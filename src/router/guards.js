/**
 * Vue Router Guards
 * 
 * Navigation guards that protect routes based on authentication status
 * and user roles. Ensures users can only access appropriate pages.
 * 
 * Location: src/router/guards.js
 */

import { useAuthStore } from '@/stores/auth'

/**
 * Authentication Guard
 * 
 * Protects routes that require authentication and redirects
 * authenticated users away from guest-only pages.
 * 
 * @param {object} to - Target route object
 * @param {object} from - Current route object  
 * @param {function} next - Navigation callback
 */
export const authGuard = (to, from, next) => {
  const authStore = useAuthStore()
  
  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      console.log('Authentication required, redirecting to login')
      return next('/auth/login')
    }
    
    // Check for expired token
    if (authStore.isTokenExpired()) {
      console.log('Token expired, clearing auth and redirecting to login')
      authStore.clearAuth()
      return next('/auth/login')
    }
  }
  
  // Check if route is guest-only (like login page)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    console.log('Already authenticated, redirecting based on role')
    
    // Redirect authenticated users to their appropriate dashboard
    const role = authStore.userRole
    switch (role) {
      case 'admin':
        return next('/admin/dashboard')
      case 'patient':
        return next('/patient/dashboard')
      case 'doctor':
      case 'secretary':
        return next('/doctor-secretary/dashboard')
      case 'moderator':
        return next('/moderator/dashboard')
      default:
        return next('/patient/dashboard') // Default fallback
    }
  }
  
  // Continue navigation
  next()
}

/**
 * Role-Based Access Control Guard
 * 
 * Ensures users can only access routes appropriate for their role.
 * Redirects unauthorized users to appropriate error page.
 * 
 * @param {object} to - Target route object
 * @param {object} from - Current route object
 * @param {function} next - Navigation callback
 */
export const roleGuard = (to, from, next) => {
  const authStore = useAuthStore()
  
  // Skip role check if route doesn't require specific roles
  if (!to.meta.roles) {
    return next()
  }
  
  // Skip role check if user is not authenticated (handled by authGuard)
  if (!authStore.isAuthenticated) {
    return next()
  }
  
  const userRole = authStore.userRole
  const requiredRoles = to.meta.roles
  
  // Check if user has required role
  if (requiredRoles.includes(userRole)) {
    console.log(`Access granted: ${userRole} can access ${to.path}`)
    return next()
  }
  
  // User doesn't have required role
  console.log(`Access denied: ${userRole} cannot access ${to.path}`)
  
  // Redirect to unauthorized page
  next('/unauthorized')
}

/**
 * Set Page Title Guard
 * 
 * Updates the browser tab title based on route meta information
 * 
 * @param {object} to - Target route object
 * @param {object} from - Current route object
 * @param {function} next - Navigation callback
 */
export const titleGuard = (to, from, next) => {
  // Set page title from route meta or use default
  const defaultTitle = 'Dental Clinic Management System'
  document.title = to.meta.title || defaultTitle
  
  next()
}
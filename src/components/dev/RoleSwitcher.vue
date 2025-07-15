<!--
  Role Switcher Component for Testing
  
  Add this component to your layout during development to easily test different roles.
  Place it in: src/components/dev/RoleSwitcher.vue
-->
<template>
  <div v-if="isDevelopment" class="fixed top-4 left-40 z-50">
    <div class="bg-yellow-100 border border-yellow-400 rounded-lg p-3 shadow-lg max-w-xs">
      <div class="text-xs font-bold text-yellow-800 mb-2">🧪 DEV MODE - Role Testing</div>
      
      <div class="text-xs text-yellow-700 mb-2">
        Current: <span class="font-semibold">{{ currentUser?.username || 'None' }}</span> 
        <br>
        <span class="font-mono">({{ currentUser?.role || 'no-role' }})</span>
      </div>
      
      <div class="flex flex-wrap gap-1 mb-2">
        <button 
          v-for="(userData, role) in mockUsers" 
          :key="role"
          @click="switchRole(role)"
          class="px-2 py-1 text-xs rounded transition-colors"
          :class="currentUser?.role === role 
            ? 'bg-yellow-600 text-white' 
            : 'bg-white text-yellow-700 hover:bg-yellow-200 border border-yellow-300'"
        >
          {{ role }}
        </button>
        
        <button 
          @click="clearTest"
          class="px-2 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200 border border-red-300"
        >
          Clear
        </button>
      </div>
      
      <div class="text-xs text-yellow-600">
        URL: ?role=doctor, ?role=secretary, ?role=moderator
      </div>
      
      <!-- Console Commands -->
      <details class="mt-2">
        <summary class="text-xs text-yellow-600 cursor-pointer hover:text-yellow-800">Console Commands</summary>
        <div class="text-xs text-yellow-600 mt-1 space-y-1">
          <div><code>authStore.switchTestRole('doctor')</code></div>
          <div><code>authStore.switchTestRole('secretary')</code></div>
          <div><code>authStore.switchTestRole('moderator')</code></div>
          <div><code>authStore.clearTestMode()</code></div>
        </div>
      </details>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'RoleSwitcher',
  setup() {
    const authStore = useAuthStore()
    
    // Only show in development
    const isDevelopment = computed(() => {
      return process.env.NODE_ENV === 'development'
    })
    
    const currentUser = computed(() => authStore.user)
    
    // Mock users for display
    const mockUsers = {
      doctor: { name: 'Dr. Sarah Johnson', role: 'doctor' },
      secretary: { name: 'Emma Rodriguez', role: 'secretary' },
      moderator: { name: 'Alex Chen', role: 'moderator' }
    }
    
    const switchRole = (role) => {
      if (authStore.switchTestRole) {
        authStore.switchTestRole(role)
      } else {
        console.error('switchTestRole method not available in auth store')
      }
    }
    
    const clearTest = () => {
      if (authStore.clearTestMode) {
        authStore.clearTestMode()
      } else {
        localStorage.clear()
        window.location.reload()
      }
    }
    
    return {
      isDevelopment,
      currentUser,
      mockUsers,
      switchRole,
      clearTest
    }
  }
}
</script>
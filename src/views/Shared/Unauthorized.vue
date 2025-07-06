<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full text-center">
      <div class="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-8">
        <svg class="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m9-9a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <h1 class="text-6xl font-bold text-slate-900 mb-4">403</h1>
      <h2 class="text-2xl font-semibold text-slate-700 mb-4">Access Denied</h2>
      <p class="text-slate-600 mb-8">
        You don't have permission to access this page.
      </p>

      <div class="space-y-4">
        <button 
          @click="goBack"
          class="w-full bg-primary-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-600 transition-colors"
        >
          Go Back
        </button>
        
        <button 
          @click="goHome"
          class="w-full bg-white text-primary-500 border border-primary-500 py-3 px-6 rounded-lg font-medium hover:bg-primary-50 transition-colors"
        >
          Go to Login
        </button>
      </div>

      <div class="mt-8 text-sm text-slate-500">
        <p>Need access to this page? Contact your clinic administrator.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'UnauthorizedPage', // Changed from 'Unauthorized' to fix ESLint error
  setup() {
    const router = useRouter()

    const goBack = () => {
      if (window.history.length > 1) {
        router.go(-1)
      } else {
        router.push('/auth/login')
      }
    }

    const goHome = () => {
      router.push('/auth/login')
    }

    return {
      goBack,
      goHome
    }
  }
}
</script>
<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full text-center">
      <div class="mx-auto w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-8">
        <svg class="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0720 12a8 8 0 11-16 0 8 8 0 016.047-7.743z" />
        </svg>
      </div>

      <h1 class="text-6xl font-bold text-slate-900 mb-4">404</h1>
      <h2 class="text-2xl font-semibold text-slate-700 mb-4">Page Not Found</h2>
      <p class="text-slate-600 mb-8">
        The page you're looking for doesn't exist or has been moved.
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
          Go to Dashboard
        </button>
      </div>

      <div class="mt-8 text-sm text-slate-500">
        <p>Need help? Contact your clinic administrator.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'NotFoundPage', // Changed from 'NotFound' to fix ESLint error
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
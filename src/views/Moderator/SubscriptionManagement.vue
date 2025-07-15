<!--
  Subscription Management Component
  
  Manage subscription tiers, billing, and usage tracking
-->
<template>
  <div class="p-4 space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Subscription Management</h1>
          <p class="text-slate-600">Manage subscription tiers, billing, and usage tracking</p>
        </div>
        <div class="flex items-center space-x-3">
          <button 
            @click="exportBillingReport"
            class="bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Report
          </button>
          <button 
            @click="showTierModal = true"
            class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            Manage Tiers
          </button>
        </div>
      </div>
    </div>

    <!-- Subscription Overview -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-blue-600 font-medium">Total Revenue</p>
            <p class="text-2xl font-bold text-blue-800">${{ subscriptionStats.totalRevenue.toLocaleString() }}</p>
            <p class="text-xs text-slate-500">This month</p>
          </div>
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-green-600 font-medium">Active Subscriptions</p>
            <p class="text-2xl font-bold text-green-800">{{ subscriptionStats.activeSubscriptions }}</p>
            <p class="text-xs text-slate-500">+{{ subscriptionStats.newThisMonth }} this month</p>
          </div>
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-yellow-600 font-medium">Avg Revenue/Clinic</p>
            <p class="text-2xl font-bold text-yellow-800">${{ subscriptionStats.avgRevenue }}</p>
            <p class="text-xs text-slate-500">Per month</p>
          </div>
          <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-purple-600 font-medium">Churn Rate</p>
            <p class="text-2xl font-bold text-purple-800">{{ subscriptionStats.churnRate }}%</p>
            <p class="text-xs text-slate-500">Last 30 days</p>
          </div>
          <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Subscription Tiers Overview -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div
        v-for="tier in subscriptionTiers"
        :key="tier.id"
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-semibold text-slate-800">{{ tier.name }}</h3>
            <p class="text-2xl font-bold text-primary-600">${{ tier.price }}<span class="text-sm font-normal text-slate-500">/month</span></p>
          </div>
          <div 
            class="px-3 py-1 rounded-full text-sm font-medium"
            :class="getTierClasses(tier.name)"
          >
            {{ tier.subscribers }} clinics
          </div>
        </div>

        <div class="space-y-2 mb-4">
          <div
            v-for="feature in tier.features"
            :key="feature"
            class="flex items-center space-x-2"
          >
            <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-sm text-slate-600">{{ feature }}</span>
          </div>
        </div>

        <div class="pt-4 border-t border-gray-100">
          <div class="flex justify-between text-sm">
            <span class="text-slate-600">Monthly Revenue:</span>
            <span class="font-medium text-slate-800">${{ (tier.price * tier.subscribers).toLocaleString() }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Billing Activity -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-slate-800">Recent Billing Activity</h2>
        <div class="flex items-center space-x-3">
          <select
            v-model="billingFilter"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Transactions</option>
            <option value="payment">Payments</option>
            <option value="upgrade">Upgrades</option>
            <option value="downgrade">Downgrades</option>
            <option value="cancellation">Cancellations</option>
          </select>
        </div>
      </div>

      <div class="space-y-3">
        <div
          v-for="transaction in filteredTransactions"
          :key="transaction.id"
          class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center space-x-4">
            <div 
              class="w-10 h-10 rounded-full flex items-center justify-center"
              :class="getTransactionIconClasses(transaction.type)"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="transaction.type === 'payment'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                <path v-else-if="transaction.type === 'upgrade'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                <path v-else-if="transaction.type === 'downgrade'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
              </svg>
            </div>
            <div>
              <h4 class="font-medium text-slate-800">{{ transaction.clinic }}</h4>
              <p class="text-sm text-slate-600">{{ transaction.description }}</p>
              <p class="text-xs text-slate-500">{{ formatTimeAgo(transaction.date) }}</p>
            </div>
          </div>
          
          <div class="text-right">
            <span 
              class="text-lg font-semibold"
              :class="transaction.amount > 0 ? 'text-green-600' : 'text-red-600'"
            >
              {{ transaction.amount > 0 ? '+' : '' }}${{ Math.abs(transaction.amount) }}
            </span>
            <p class="text-xs text-slate-500">{{ transaction.tier }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tier Management Modal -->
    <div v-if="showTierModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-slate-800">Manage Subscription Tiers</h3>
            <button @click="showTierModal = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="space-y-4">
            <div
              v-for="tier in subscriptionTiers"
              :key="tier.id"
              class="p-4 border border-gray-200 rounded-lg"
            >
              <div class="flex items-center justify-between mb-3">
                <h4 class="font-medium text-slate-800">{{ tier.name }}</h4>
                <button 
                  @click="editTier(tier)"
                  class="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Edit Pricing
                </button>
              </div>
              
              <div class="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <label class="block text-slate-600 mb-1">Current Price</label>
                  <span class="font-medium text-slate-800">${{ tier.price }}/month</span>
                </div>
                <div>
                  <label class="block text-slate-600 mb-1">Subscribers</label>
                  <span class="font-medium text-slate-800">{{ tier.subscribers }} clinics</span>
                </div>
                <div>
                  <label class="block text-slate-600 mb-1">Monthly Revenue</label>
                  <span class="font-medium text-slate-800">${{ (tier.price * tier.subscribers).toLocaleString() }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-4 mt-6 border-t border-gray-200">
            <button
              @click="showTierModal = false"
              class="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              Close
            </button>
            <button
              @click="saveTierChanges"
              class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'SubscriptionManagement',
  emits: ['show-toast', 'show-error', 'show-success'],
  setup(props, { emit }) {
    // ==========================================
    // REACTIVE STATE
    // ==========================================
    
    const billingFilter = ref('')
    const showTierModal = ref(false)
    
    const subscriptionStats = ref({
      totalRevenue: 24750,
      activeSubscriptions: 15,
      newThisMonth: 3,
      avgRevenue: 1650,
      churnRate: 2.1
    })
    
    const subscriptionTiers = ref([
      {
        id: 1,
        name: 'Basic',
        price: 99,
        subscribers: 8,
        features: [
          'Up to 500 patients',
          'Basic scheduling',
          'Email support',
          'Standard reports'
        ]
      },
      {
        id: 2,
        name: 'Professional',
        price: 199,
        subscribers: 5,
        features: [
          'Up to 2,000 patients',
          'Advanced scheduling',
          'Priority support',
          'AI-powered insights',
          'Custom reports'
        ]
      },
      {
        id: 3,
        name: 'Enterprise',
        price: 399,
        subscribers: 2,
        features: [
          'Unlimited patients',
          'Multi-location support',
          '24/7 phone support',
          'Advanced AI features',
          'Custom integrations',
          'Dedicated account manager'
        ]
      }
    ])
    
    const billingTransactions = ref([
      {
        id: 1,
        clinic: 'Smile Dental Clinic',
        description: 'Monthly subscription payment',
        amount: 199,
        tier: 'Professional',
        type: 'payment',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: 2,
        clinic: 'Family Care Dental',
        description: 'Upgraded to Professional plan',
        amount: 100,
        tier: 'Professional',
        type: 'upgrade',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: 3,
        clinic: 'Downtown Dental',
        description: 'Monthly subscription payment',
        amount: 99,
        tier: 'Basic',
        type: 'payment',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        id: 4,
        clinic: 'Bright Smiles',
        description: 'Subscription cancelled',
        amount: -199,
        tier: 'Professional',
        type: 'cancellation',
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      }
    ])
    
    // ==========================================
    // COMPUTED PROPERTIES
    // ==========================================
    
    const filteredTransactions = computed(() => {
      if (!billingFilter.value) return billingTransactions.value
      return billingTransactions.value.filter(transaction => 
        transaction.type === billingFilter.value
      )
    })
    
    // ==========================================
    // METHODS
    // ==========================================
    
    const formatTimeAgo = (date) => {
      const now = new Date()
      const diffMs = now - new Date(date)
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) return 'Today'
      if (diffDays === 1) return 'Yesterday'
      return `${diffDays} days ago`
    }
    
    const getTierClasses = (tierName) => {
      const classes = {
        'Basic': 'bg-blue-100 text-blue-800',
        'Professional': 'bg-green-100 text-green-800',
        'Enterprise': 'bg-purple-100 text-purple-800'
      }
      return classes[tierName] || 'bg-gray-100 text-gray-800'
    }
    
    const getTransactionIconClasses = (type) => {
      const classes = {
        payment: 'bg-green-100 text-green-600',
        upgrade: 'bg-blue-100 text-blue-600',
        downgrade: 'bg-yellow-100 text-yellow-600',
        cancellation: 'bg-red-100 text-red-600'
      }
      return classes[type] || 'bg-gray-100 text-gray-600'
    }
    
    const exportBillingReport = () => {
      // TODO: Implement export functionality
      emit('show-success', 'Billing report exported successfully')
    }
    
    const editTier = (tier) => {
      // TODO: Implement tier editing
      emit('show-toast', `Edit ${tier.name} tier - feature coming soon`)
    }
    
    const saveTierChanges = () => {
      showTierModal.value = false
      emit('show-success', 'Tier changes saved successfully')
    }
    
    // ==========================================
    // LIFECYCLE
    // ==========================================
    
    onMounted(() => {
      console.log('Subscription Management mounted')
    })
    
    // ==========================================
    // RETURN FOR TEMPLATE
    // ==========================================
    
    return {
      // State
      billingFilter,
      showTierModal,
      subscriptionStats,
      subscriptionTiers,
      billingTransactions,
      
      // Computed
      filteredTransactions,
      
      // Methods
      formatTimeAgo,
      getTierClasses,
      getTransactionIconClasses,
      exportBillingReport,
      editTier,
      saveTierChanges
    }
  }
}
</script>

<style scoped>
/* Color classes */
.bg-primary-600 { background-color: #0066CC; }
.bg-primary-700 { background-color: #0052a3; }
.bg-secondary-600 { background-color: #00A86B; }
.bg-secondary-700 { background-color: #047857; }
.text-primary-600 { color: #0066CC; }
.text-primary-700 { color: #0052a3; }
.ring-primary-500 { --tw-ring-color: #3b82f6; }
.border-primary-500 { border-color: #3b82f6; }

/* Transition effects */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
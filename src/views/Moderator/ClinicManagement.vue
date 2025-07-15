<!--
  Clinic Management Component
  
  Manage clinic registration, settings, and overview
-->
<template>
  <div class="p-4 space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Clinic Management</h1>
          <p class="text-slate-600">Register new clinics and manage existing clinic settings</p>
        </div>
        <div class="flex items-center space-x-3">
          <button 
            @click="showRegisterModal = true"
            class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Register New Clinic
          </button>
        </div>
      </div>
    </div>

    <!-- Clinic Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-blue-600 font-medium">Total Clinics</p>
            <p class="text-2xl font-bold text-blue-800">{{ clinicStats.total }}</p>
          </div>
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-green-600 font-medium">Active</p>
            <p class="text-2xl font-bold text-green-800">{{ clinicStats.active }}</p>
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
            <p class="text-sm text-yellow-600 font-medium">Pending</p>
            <p class="text-2xl font-bold text-yellow-800">{{ clinicStats.pending }}</p>
          </div>
          <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-red-600 font-medium">Inactive</p>
            <p class="text-2xl font-bold text-red-800">{{ clinicStats.inactive }}</p>
          </div>
          <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Clinics List -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-slate-800">Registered Clinics</h2>
        <div class="flex items-center space-x-3">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search clinics..."
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
          <select
            v-model="statusFilter"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div class="space-y-3">
        <div
          v-for="clinic in filteredClinics"
          :key="clinic.id"
          class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-slate-800">{{ clinic.name }}</h3>
              <p class="text-sm text-slate-600">{{ clinic.address }}</p>
              <p class="text-xs text-slate-500">{{ clinic.phone }} • {{ clinic.email }}</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            <span 
              class="px-2 py-1 text-xs rounded-full font-medium"
              :class="getStatusClasses(clinic.status)"
            >
              {{ clinic.status }}
            </span>
            <button 
              @click="editClinic(clinic)"
              class="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Register Clinic Modal -->
    <div v-if="showRegisterModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-slate-800">Register New Clinic</h3>
            <button @click="showRegisterModal = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Clinic Name</label>
              <input
                v-model="newClinic.name"
                type="text"
                placeholder="e.g., Smile Dental Clinic"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Address</label>
              <textarea
                v-model="newClinic.address"
                rows="2"
                placeholder="Full clinic address"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                <input
                  v-model="newClinic.phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  v-model="newClinic.email"
                  type="email"
                  placeholder="info@clinic.com"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
              </div>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button
                @click="showRegisterModal = false"
                class="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                @click="registerClinic"
                class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Register Clinic
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'ClinicManagement',
  emits: ['show-toast', 'show-error', 'show-success'],
  setup(props, { emit }) {
    // ==========================================
    // REACTIVE STATE
    // ==========================================
    
    const searchQuery = ref('')
    const statusFilter = ref('')
    const showRegisterModal = ref(false)
    
    const clinicStats = ref({
      total: 15,
      active: 12,
      pending: 2,
      inactive: 1
    })
    
    const newClinic = ref({
      name: '',
      address: '',
      phone: '',
      email: ''
    })
    
    const clinics = ref([
      {
        id: 1,
        name: 'Smile Dental Clinic',
        address: '123 Main St, Downtown, NY 10001',
        phone: '(555) 123-4567',
        email: 'info@smileclinic.com',
        status: 'active'
      },
      {
        id: 2,
        name: 'Family Care Dental',
        address: '456 Oak Ave, Uptown, NY 10002',
        phone: '(555) 234-5678',
        email: 'contact@familycare.com',
        status: 'active'
      },
      {
        id: 3,
        name: 'Downtown Dental',
        address: '789 Pine St, Midtown, NY 10003',
        phone: '(555) 345-6789',
        email: 'hello@downtowndental.com',
        status: 'pending'
      },
      {
        id: 4,
        name: 'Bright Smiles',
        address: '321 Elm St, Suburbs, NY 10004',
        phone: '(555) 456-7890',
        email: 'info@brightsmiles.com',
        status: 'inactive'
      }
    ])
    
    // ==========================================
    // COMPUTED PROPERTIES
    // ==========================================
    
    const filteredClinics = computed(() => {
      let filtered = clinics.value
      
      if (searchQuery.value) {
        filtered = filtered.filter(clinic =>
          clinic.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          clinic.address.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
      }
      
      if (statusFilter.value) {
        filtered = filtered.filter(clinic => clinic.status === statusFilter.value)
      }
      
      return filtered
    })
    
    // ==========================================
    // METHODS
    // ==========================================
    
    const getStatusClasses = (status) => {
      const classes = {
        active: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        inactive: 'bg-red-100 text-red-800'
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    }
    
    const registerClinic = () => {
      if (!newClinic.value.name || !newClinic.value.address) {
        emit('show-error', 'Please fill in required fields')
        return
      }
      
      const clinic = {
        id: clinics.value.length + 1,
        ...newClinic.value,
        status: 'pending'
      }
      
      clinics.value.push(clinic)
      clinicStats.value.total++
      clinicStats.value.pending++
      
      // Reset form
      newClinic.value = { name: '', address: '', phone: '', email: '' }
      showRegisterModal.value = false
      
      emit('show-success', 'Clinic registered successfully')
    }
    
    const editClinic = (clinic) => {
      // TODO: Implement edit functionality
      emit('show-toast', `Edit ${clinic.name} - feature coming soon`)
    }
    
    // ==========================================
    // LIFECYCLE
    // ==========================================
    
    onMounted(() => {
      console.log('Clinic Management mounted')
    })
    
    // ==========================================
    // RETURN FOR TEMPLATE
    // ==========================================
    
    return {
      // State
      searchQuery,
      statusFilter,
      showRegisterModal,
      clinicStats,
      newClinic,
      clinics,
      
      // Computed
      filteredClinics,
      
      // Methods
      getStatusClasses,
      registerClinic,
      editClinic
    }
  }
}
</script>

<style scoped>
/* Color classes */
.bg-primary-600 { background-color: #0066CC; }
.bg-primary-700 { background-color: #0052a3; }
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
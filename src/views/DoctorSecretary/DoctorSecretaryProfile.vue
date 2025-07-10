// 16. DoctorSecretaryProfile.vue
// Path: src/views/DoctorSecretary/DoctorSecretaryProfile.vue
const DoctorSecretaryProfileTemplate = `
<template>
  <div class="p-4 space-y-6">
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h1 class="text-2xl font-bold text-slate-800">Profile & Settings</h1>
      <p class="text-slate-600">Manage your account and preferences</p>
      
      <div class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Profile Information -->
        <div class="lg:col-span-2 space-y-6">
          <div class="border border-gray-200 rounded-lg p-6">
            <h3 class="font-medium mb-4">Personal Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1">First Name</label>
                <input type="text" value="Dr. John" class="w-full border border-gray-200 rounded-lg px-3 py-2">
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Last Name</label>
                <input type="text" value="Smith" class="w-full border border-gray-200 rounded-lg px-3 py-2">
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Email</label>
                <input type="email" value="dr.smith@clinic.com" class="w-full border border-gray-200 rounded-lg px-3 py-2">
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Phone</label>
                <input type="tel" value="+1 (555) 123-4567" class="w-full border border-gray-200 rounded-lg px-3 py-2">
              </div>
            </div>
          </div>
          
          <div class="border border-gray-200 rounded-lg p-6">
            <h3 class="font-medium mb-4">Notification Preferences</h3>
            <div class="space-y-3">
              <label class="flex items-center">
                <input type="checkbox" class="mr-3" checked>
                <span>Email notifications for new appointments</span>
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="mr-3" checked>
                <span>SMS notifications for urgent patient messages</span>
              </label>
              <label class="flex items-center">
                <input type="checkbox" class="mr-3">
                <span>Daily schedule summary</span>
              </label>
            </div>
          </div>
        </div>
        
        <!-- Quick Stats -->
        <div class="space-y-4">
          <div class="border border-gray-200 rounded-lg p-4">
            <h3 class="font-medium mb-3">This Month</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span>Patients Seen:</span>
                <span class="font-medium">156</span>
              </div>
              <div class="flex justify-between">
                <span>Appointments:</span>
                <span class="font-medium">142</span>
              </div>
              <div class="flex justify-between">
                <span>Hours Worked:</span>
                <span class="font-medium">168</span>
              </div>
            </div>
          </div>
          
          <div class="border border-gray-200 rounded-lg p-4">
            <h3 class="font-medium mb-3">Account</h3>
            <div class="space-y-2">
              <button class="w-full bg-primary-600 text-white p-2 rounded text-sm">Change Password</button>
              <button class="w-full bg-gray-600 text-white p-2 rounded text-sm">Download Data</button>
              <button class="w-full bg-red-600 text-white p-2 rounded text-sm">Sign Out</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DoctorSecretaryProfile'
}
</script>`;
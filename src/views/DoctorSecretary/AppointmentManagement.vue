// 11. AppointmentManagement.vue (Doctor)
// Path: src/views/DoctorSecretary/AppointmentManagement.vue
const AppointmentManagementTemplate = `
<template>
  <div class="p-4 space-y-6">
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h1 class="text-2xl font-bold text-slate-800">Appointment Management</h1>
      <p class="text-slate-600">Manage your appointment schedule and patient bookings</p>
      
      <div class="mt-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">Today's Schedule</h2>
          <button class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm">
            Add Appointment
          </button>
        </div>
        
        <div class="space-y-3">
          <div class="p-4 border border-gray-200 rounded-lg">
            <div class="flex justify-between items-center">
              <div>
                <p class="font-medium">John Smith</p>
                <p class="text-sm text-slate-600">Routine Cleaning</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium">9:00 AM</p>
                <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Confirmed</span>
              </div>
            </div>
          </div>
          
          <div class="p-4 border border-gray-200 rounded-lg">
            <div class="flex justify-between items-center">
              <div>
                <p class="font-medium">Sarah Johnson</p>
                <p class="text-sm text-slate-600">Cavity Filling</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium">10:30 AM</p>
                <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">In Progress</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppointmentManagement'
}
</script>`;
// 13. SchedulingDashboard.vue (Secretary Only)
// Path: src/views/DoctorSecretary/SchedulingDashboard.vue
const SchedulingDashboardTemplate = `
<template>
  <div class="p-4 space-y-6">
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h1 class="text-2xl font-bold text-slate-800">Scheduling Dashboard</h1>
      <p class="text-slate-600">Advanced appointment scheduling and management</p>
      
      <div class="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Calendar View -->
        <div class="lg:col-span-3">
          <div class="border border-gray-200 rounded-lg p-4">
            <h3 class="font-medium mb-4">Weekly Schedule View</h3>
            <div class="grid grid-cols-7 gap-2 text-center text-sm">
              <div class="font-medium p-2">Mon</div>
              <div class="font-medium p-2">Tue</div>
              <div class="font-medium p-2">Wed</div>
              <div class="font-medium p-2">Thu</div>
              <div class="font-medium p-2">Fri</div>
              <div class="font-medium p-2">Sat</div>
              <div class="font-medium p-2">Sun</div>
              
              <!-- Time slots would be dynamically generated -->
              <div class="p-2 bg-blue-100 rounded text-xs">9:00 AM<br>Patient A</div>
              <div class="p-2 bg-green-100 rounded text-xs">9:00 AM<br>Patient B</div>
              <div class="p-2 bg-yellow-100 rounded text-xs">9:00 AM<br>Patient C</div>
              <div class="p-2 bg-gray-100 rounded text-xs">Available</div>
              <div class="p-2 bg-red-100 rounded text-xs">9:00 AM<br>Emergency</div>
              <div class="p-2 bg-gray-100 rounded text-xs">Available</div>
              <div class="p-2 bg-gray-200 rounded text-xs">Closed</div>
            </div>
          </div>
        </div>
        
        <!-- Quick Actions -->
        <div class="space-y-4">
          <div class="border border-gray-200 rounded-lg p-4">
            <h3 class="font-medium mb-3">Quick Actions</h3>
            <div class="space-y-2">
              <button class="w-full bg-primary-600 text-white p-2 rounded text-sm">Book Appointment</button>
              <button class="w-full bg-secondary-600 text-white p-2 rounded text-sm">Block Time Slot</button>
              <button class="w-full bg-gray-600 text-white p-2 rounded text-sm">View Conflicts</button>
            </div>
          </div>
          
          <div class="border border-gray-200 rounded-lg p-4">
            <h3 class="font-medium mb-3">Today's Stats</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span>Total Appointments:</span>
                <span class="font-medium">12</span>
              </div>
              <div class="flex justify-between">
                <span>Available Slots:</span>
                <span class="font-medium">4</span>
              </div>
              <div class="flex justify-between">
                <span>Utilization:</span>
                <span class="font-medium">75%</span>
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
  name: 'SchedulingDashboard'
}
</script>`;
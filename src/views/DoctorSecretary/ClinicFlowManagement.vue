// 15. ClinicFlowManagement.vue (Secretary Only)  
// Path: src/views/DoctorSecretary/ClinicFlowManagement.vue
const ClinicFlowManagementTemplate = `
<template>
  <div class="p-4 space-y-6">
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h1 class="text-2xl font-bold text-slate-800">Clinic Flow Management</h1>
      <p class="text-slate-600">Real-time patient tracking and clinic optimization</p>
      
      <div class="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Patient Flow Status -->
        <div class="lg:col-span-3 space-y-4">
          <h3 class="font-medium">Current Patient Flow</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 class="font-medium text-blue-800">Waiting Room</h4>
              <p class="text-2xl font-bold text-blue-600 mt-2">3</p>
              <p class="text-sm text-blue-600">patients waiting</p>
            </div>
            
            <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 class="font-medium text-yellow-800">In Treatment</h4>
              <p class="text-2xl font-bold text-yellow-600 mt-2">2</p>
              <p class="text-sm text-yellow-600">active treatments</p>
            </div>
            
            <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 class="font-medium text-green-800">Check-out</h4>
              <p class="text-2xl font-bold text-green-600 mt-2">1</p>
              <p class="text-sm text-green-600">ready for checkout</p>
            </div>
            
            <div class="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 class="font-medium text-gray-800">Completed</h4>
              <p class="text-2xl font-bold text-gray-600 mt-2">8</p>
              <p class="text-sm text-gray-600">today's total</p>
            </div>
          </div>
          
          <!-- Patient List -->
          <div class="space-y-3">
            <div class="p-4 border border-gray-200 rounded-lg">
              <div class="flex justify-between items-center">
                <div>
                  <p class="font-medium">John Smith</p>
                  <p class="text-sm text-slate-600">Waiting Room • Arrived 9:00 AM</p>
                </div>
                <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Waiting</span>
              </div>
            </div>
            
            <div class="p-4 border border-gray-200 rounded-lg">
              <div class="flex justify-between items-center">
                <div>
                  <p class="font-medium">Sarah Johnson</p>
                  <p class="text-sm text-slate-600">Treatment Room 1 • Started 9:30 AM</p>
                </div>
                <span class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">In Progress</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Quick Actions -->
        <div class="space-y-4">
          <div class="border border-gray-200 rounded-lg p-4">
            <h3 class="font-medium mb-3">Patient Actions</h3>
            <div class="space-y-2">
              <button class="w-full bg-blue-600 text-white p-2 rounded text-sm">Check In Patient</button>
              <button class="w-full bg-yellow-600 text-white p-2 rounded text-sm">Move to Treatment</button>
              <button class="w-full bg-green-600 text-white p-2 rounded text-sm">Ready for Checkout</button>
            </div>
          </div>
          
          <div class="border border-gray-200 rounded-lg p-4">
            <h3 class="font-medium mb-3">Wait Times</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span>Average Wait:</span>
                <span class="font-medium">12 min</span>
              </div>
              <div class="flex justify-between">
                <span>Longest Wait:</span>
                <span class="font-medium">25 min</span>
              </div>
              <div class="flex justify-between">
                <span>On Schedule:</span>
                <span class="font-medium text-green-600">85%</span>
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
  name: 'ClinicFlowManagement'
}
</script>`;
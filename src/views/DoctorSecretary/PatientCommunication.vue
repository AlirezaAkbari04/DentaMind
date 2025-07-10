// 14. PatientCommunication.vue (Secretary Only)
// Path: src/views/DoctorSecretary/PatientCommunication.vue
const PatientCommunicationTemplate = `
<template>
  <div class="p-4 space-y-6">
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h1 class="text-2xl font-bold text-slate-800">Patient Communication</h1>
      <p class="text-slate-600">Administrative messaging and patient correspondence</p>
      
      <div class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Message Templates -->
        <div class="lg:col-span-1">
          <h3 class="font-medium mb-4">Message Templates</h3>
          <div class="space-y-2">
            <div class="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <p class="font-medium text-sm">Appointment Confirmation</p>
              <p class="text-xs text-slate-600">Standard appointment reminder</p>
            </div>
            <div class="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <p class="font-medium text-sm">Insurance Verification</p>
              <p class="text-xs text-slate-600">Request insurance information</p>
            </div>
            <div class="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <p class="font-medium text-sm">Post-Treatment Care</p>
              <p class="text-xs text-slate-600">Follow-up care instructions</p>
            </div>
          </div>
        </div>
        
        <!-- Message Composer -->
        <div class="lg:col-span-2">
          <h3 class="font-medium mb-4">Compose Message</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">To Patient</label>
              <select class="w-full border border-gray-200 rounded-lg px-3 py-2">
                <option>Select patient...</option>
                <option>John Smith</option>
                <option>Sarah Johnson</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-1">Subject</label>
              <input type="text" class="w-full border border-gray-200 rounded-lg px-3 py-2" placeholder="Message subject">
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-1">Message</label>
              <textarea rows="6" class="w-full border border-gray-200 rounded-lg px-3 py-2" placeholder="Type your message..."></textarea>
            </div>
            
            <div class="flex space-x-3">
              <button class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm">Send Message</button>
              <button class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm">Save Draft</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PatientCommunication'
}
</script>`;
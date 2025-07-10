// 9. TaskTemplates.vue (Doctor Only)
// Path: src/views/DoctorSecretary/TaskTemplates.vue
const TaskTemplatesTemplate = `
<template>
  <div class="p-4 space-y-6">
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h1 class="text-2xl font-bold text-slate-800">Task Templates</h1>
      <p class="text-slate-600">Create and manage patient care task templates</p>
      
      <div class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 border border-gray-200 rounded-lg">
          <h3 class="font-medium">Post-Extraction Care</h3>
          <p class="text-sm text-slate-600 mt-2">24-hour care instructions</p>
          <button class="mt-3 text-primary-600 text-sm">Use Template</button>
        </div>
        
        <div class="p-4 border border-gray-200 rounded-lg">
          <h3 class="font-medium">Daily Oral Hygiene</h3>
          <p class="text-sm text-slate-600 mt-2">Brushing and flossing routine</p>
          <button class="mt-3 text-primary-600 text-sm">Use Template</button>
        </div>
        
        <div class="p-4 border border-gray-200 rounded-lg">
          <h3 class="font-medium">Crown Care Instructions</h3>
          <p class="text-sm text-slate-600 mt-2">Post-crown placement care</p>
          <button class="mt-3 text-primary-600 text-sm">Use Template</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskTemplates',
  emits: ['show-success'],
  setup(props, { emit }) {
    return {}
  }
}
</script>`;
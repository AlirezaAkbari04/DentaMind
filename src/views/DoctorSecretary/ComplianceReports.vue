// 10. ComplianceReports.vue
// Path: src/views/DoctorSecretary/ComplianceReports.vue
const ComplianceReportsTemplate = `
<template>
  <div class="p-4 space-y-6">
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h1 class="text-2xl font-bold text-slate-800">Compliance Reports</h1>
      <p class="text-slate-600">Monitor patient task completion and compliance</p>
      
      <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-green-50 p-4 rounded-lg border border-green-100">
          <h3 class="font-medium text-green-800">High Compliance</h3>
          <p class="text-2xl font-bold text-green-600 mt-2">78%</p>
          <p class="text-sm text-green-600">Patients following care plans</p>
        </div>
        
        <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
          <h3 class="font-medium text-yellow-800">Moderate Compliance</h3>
          <p class="text-2xl font-bold text-yellow-600 mt-2">15%</p>
          <p class="text-sm text-yellow-600">Partial task completion</p>
        </div>
        
        <div class="bg-red-50 p-4 rounded-lg border border-red-100">
          <h3 class="font-medium text-red-800">Low Compliance</h3>
          <p class="text-2xl font-bold text-red-600 mt-2">7%</p>
          <p class="text-sm text-red-600">Requires follow-up</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComplianceReports'
}
</script>`;
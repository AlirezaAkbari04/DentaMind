<!--
  Database Tools Component
  
  Comprehensive database management interface for moderator with:
  - Database health monitoring and connection status
  - Backup and restore operations
  - Data import/export functionality
  - Query performance monitoring
  - Database maintenance and cleanup tools
  - System statistics and analytics
-->
<template>
  <div class="p-4 space-y-6">
    <!-- Header Section -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Database Tools</h1>
          <p class="text-slate-600">Monitor, maintain, and manage your database system</p>
        </div>
        <div class="flex items-center space-x-3">
          <div class="flex items-center space-x-2">
            <div 
              class="w-3 h-3 rounded-full"
              :class="databaseStatus.isHealthy ? 'bg-green-500' : 'bg-red-500'"
            ></div>
            <span class="text-sm font-medium text-slate-700">
              {{ databaseStatus.isHealthy ? 'Healthy' : 'Issues Detected' }}
            </span>
          </div>
          <button 
            @click="refreshDatabaseStatus"
            class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :disabled="isLoading"
          >
            <svg v-if="isLoading" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Status
          </button>
        </div>
      </div>

      <!-- Database Overview Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-blue-600 font-medium">Total Records</p>
              <p class="text-2xl font-bold text-blue-800">{{ formatNumber(databaseStats.totalRecords) }}</p>
            </div>
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-green-50 rounded-lg p-4 border border-green-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-green-600 font-medium">Database Size</p>
              <p class="text-2xl font-bold text-green-800">{{ databaseStats.size }}</p>
            </div>
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-purple-50 rounded-lg p-4 border border-purple-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-purple-600 font-medium">Active Connections</p>
              <p class="text-2xl font-bold text-purple-800">{{ databaseStats.activeConnections }}</p>
            </div>
            <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-orange-50 rounded-lg p-4 border border-orange-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-orange-600 font-medium">Last Backup</p>
              <p class="text-lg font-bold text-orange-800">{{ databaseStats.lastBackup }}</p>
            </div>
            <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Backup & Restore -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-slate-800">Backup & Restore</h2>
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
          </div>
        </div>
        
        <div class="space-y-3">
          <button 
            @click="createBackup"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
            :disabled="isCreatingBackup"
          >
            <svg v-if="isCreatingBackup" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            <span>{{ isCreatingBackup ? 'Creating Backup...' : 'Create Backup' }}</span>
          </button>
          
          <button 
            @click="showRestoreDialog = true"
            class="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Restore from Backup
          </button>
          
          <button 
            @click="showBackupHistory"
            class="w-full border border-gray-300 text-slate-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            View Backup History
          </button>
        </div>
      </div>

      <!-- Data Import/Export -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-slate-800">Data Import/Export</h2>
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
        </div>
        
        <div class="space-y-3">
          <button 
            @click="showExportDialog = true"
            class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Export Data
          </button>
          
          <button 
            @click="showImportDialog = true"
            class="w-full border border-green-600 text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Import Data
          </button>
          
          <button 
            @click="downloadTemplate"
            class="w-full border border-gray-300 text-slate-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Download Templates
          </button>
        </div>
      </div>

      <!-- Database Maintenance -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-slate-800">Maintenance</h2>
          <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
        
        <div class="space-y-3">
          <button 
            @click="optimizeDatabase"
            class="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :disabled="isOptimizing"
          >
            {{ isOptimizing ? 'Optimizing...' : 'Optimize Database' }}
          </button>
          
          <button 
            @click="showCleanupDialog = true"
            class="w-full border border-purple-600 text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Data Cleanup
          </button>
          
          <button 
            @click="showMaintenanceSchedule"
            class="w-full border border-gray-300 text-slate-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Maintenance Schedule
          </button>
        </div>
      </div>
    </div>

    <!-- Database Tables Overview -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-slate-800">Database Tables</h2>
        <button 
          @click="refreshTableStats"
          class="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Refresh Stats
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-2 font-medium text-slate-600">Table Name</th>
              <th class="text-left py-2 font-medium text-slate-600">Records</th>
              <th class="text-left py-2 font-medium text-slate-600">Size</th>
              <th class="text-left py-2 font-medium text-slate-600">Last Modified</th>
              <th class="text-left py-2 font-medium text-slate-600">Status</th>
              <th class="text-left py-2 font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="table in databaseTables"
              :key="table.name"
              class="border-b border-gray-100 hover:bg-gray-50"
            >
              <td class="py-3 font-medium text-slate-800">{{ table.name }}</td>
              <td class="py-3 text-slate-600">{{ formatNumber(table.records) }}</td>
              <td class="py-3 text-slate-600">{{ table.size }}</td>
              <td class="py-3 text-slate-600">{{ formatDate(table.lastModified) }}</td>
              <td class="py-3">
                <span 
                  class="text-xs px-2 py-1 rounded-full"
                  :class="getTableStatusClasses(table.status)"
                >
                  {{ table.status }}
                </span>
              </td>
              <td class="py-3">
                <div class="flex items-center space-x-2">
                  <button 
                    @click="analyzeTable(table.name)"
                    class="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Analyze
                  </button>
                  <button 
                    @click="optimizeTable(table.name)"
                    class="text-xs text-green-600 hover:text-green-700 font-medium"
                  >
                    Optimize
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Query Performance Monitor -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-slate-800">Query Performance</h2>
        <div class="flex items-center space-x-2">
          <select 
            v-model="performanceTimeframe"
            class="text-sm border border-gray-300 rounded-lg px-3 py-1"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <button 
            @click="refreshPerformanceData"
            class="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Refresh
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="text-center">
          <p class="text-2xl font-bold text-slate-800">{{ performanceStats.avgQueryTime }}ms</p>
          <p class="text-sm text-slate-600">Average Query Time</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-slate-800">{{ formatNumber(performanceStats.totalQueries) }}</p>
          <p class="text-sm text-slate-600">Total Queries</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-slate-800">{{ performanceStats.slowQueries }}</p>
          <p class="text-sm text-slate-600">Slow Queries (>1s)</p>
        </div>
      </div>

      <div class="space-y-3">
        <h3 class="text-sm font-medium text-slate-600">Slowest Queries</h3>
        <div
          v-for="query in slowQueries"
          :key="query.id"
          class="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
        >
          <div class="flex-1">
            <p class="text-sm font-mono text-slate-800 truncate">{{ query.sql }}</p>
            <p class="text-xs text-slate-500">{{ query.table }} • {{ query.executions }} executions</p>
          </div>
          <div class="text-right">
            <p class="text-sm font-medium text-slate-800">{{ query.avgTime }}ms</p>
            <button 
              @click="optimizeQuery(query.id)"
              class="text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              Optimize
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Export Dialog -->
    <div 
      v-if="showExportDialog"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-xl max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-slate-800">Export Data</h3>
          <button 
            @click="showExportDialog = false"
            class="p-1 rounded-lg hover:bg-gray-100"
          >
            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Select Tables</label>
            <div class="space-y-2 max-h-40 overflow-y-auto">
              <label
                v-for="table in databaseTables"
                :key="table.name"
                class="flex items-center space-x-2"
              >
                <input 
                  type="checkbox" 
                  v-model="exportOptions.selectedTables"
                  :value="table.name"
                  class="rounded border-gray-300"
                >
                <span class="text-sm text-slate-700">{{ table.name }}</span>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Export Format</label>
            <select 
              v-model="exportOptions.format"
              class="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="sql">SQL Dump</option>
              <option value="csv">CSV Files</option>
              <option value="json">JSON Export</option>
              <option value="xlsx">Excel Spreadsheet</option>
            </select>
          </div>

          <div class="flex items-center space-x-2">
            <input 
              type="checkbox" 
              v-model="exportOptions.includeSchema"
              class="rounded border-gray-300"
            >
            <span class="text-sm text-slate-700">Include schema structure</span>
          </div>

          <div class="flex space-x-3 pt-4">
            <button 
              @click="executeExport"
              class="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              :disabled="exportOptions.selectedTables.length === 0 || isExporting"
            >
              {{ isExporting ? 'Exporting...' : 'Export Data' }}
            </button>
            <button 
              @click="showExportDialog = false"
              class="flex-1 border border-gray-300 text-slate-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Import Dialog -->
    <div 
      v-if="showImportDialog"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-xl max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-slate-800">Import Data</h3>
          <button 
            @click="showImportDialog = false"
            class="p-1 rounded-lg hover:bg-gray-100"
          >
            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Select File</label>
            <input 
              type="file"
              @change="handleFileSelect"
              accept=".sql,.csv,.json,.xlsx"
              class="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
            <p class="text-xs text-slate-500 mt-1">Supported formats: SQL, CSV, JSON, Excel</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Import Mode</label>
            <select 
              v-model="importOptions.mode"
              class="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="insert">Insert New Records</option>
              <option value="update">Update Existing Records</option>
              <option value="upsert">Insert or Update (Upsert)</option>
              <option value="replace">Replace All Data</option>
            </select>
          </div>

          <div class="flex items-center space-x-2">
            <input 
              type="checkbox" 
              v-model="importOptions.validateData"
              class="rounded border-gray-300"
            >
            <span class="text-sm text-slate-700">Validate data before import</span>
          </div>

          <div class="flex space-x-3 pt-4">
            <button 
              @click="executeImport"
              class="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              :disabled="!importOptions.file || isImporting"
            >
              {{ isImporting ? 'Importing...' : 'Import Data' }}
            </button>
            <button 
              @click="showImportDialog = false"
              class="flex-1 border border-gray-300 text-slate-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Restore Dialog -->
    <div 
      v-if="showRestoreDialog"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-xl max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-slate-800">Restore Database</h3>
          <button 
            @click="showRestoreDialog = false"
            class="p-1 rounded-lg hover:bg-gray-100"
          >
            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div class="bg-red-50 border border-red-200 rounded-lg p-3">
            <div class="flex items-start space-x-2">
              <svg class="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <p class="text-sm font-medium text-red-800">Warning</p>
                <p class="text-sm text-red-700">This will overwrite all current data. Make sure you have a recent backup.</p>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Select Backup</label>
            <select 
              v-model="restoreOptions.selectedBackup"
              class="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">Choose a backup...</option>
              <option
                v-for="backup in availableBackups"
                :key="backup.id"
                :value="backup.id"
              >
                {{ backup.name }} - {{ backup.date }}
              </option>
            </select>
          </div>

          <div class="flex items-center space-x-2">
            <input 
              type="checkbox" 
              v-model="restoreOptions.confirmed"
              class="rounded border-gray-300"
            >
            <span class="text-sm text-slate-700">I understand this will overwrite current data</span>
          </div>

          <div class="flex space-x-3 pt-4">
            <button 
              @click="executeRestore"
              class="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              :disabled="!restoreOptions.selectedBackup || !restoreOptions.confirmed || isRestoring"
            >
              {{ isRestoring ? 'Restoring...' : 'Restore Database' }}
            </button>
            <button 
              @click="showRestoreDialog = false"
              class="flex-1 border border-gray-300 text-slate-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Cleanup Dialog -->
    <div 
      v-if="showCleanupDialog"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-xl max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-slate-800">Data Cleanup</h3>
          <button 
            @click="showCleanupDialog = false"
            class="p-1 rounded-lg hover:bg-gray-100"
          >
            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div class="space-y-3">
            <label class="flex items-center space-x-2">
              <input 
                type="checkbox" 
                v-model="cleanupOptions.oldLogs"
                class="rounded border-gray-300"
              >
              <span class="text-sm text-slate-700">Remove logs older than 30 days</span>
            </label>
            
            <label class="flex items-center space-x-2">
              <input 
                type="checkbox" 
                v-model="cleanupOptions.tempFiles"
                class="rounded border-gray-300"
              >
              <span class="text-sm text-slate-700">Clean temporary files</span>
            </label>
            
            <label class="flex items-center space-x-2">
              <input 
                type="checkbox" 
                v-model="cleanupOptions.orphanedRecords"
                class="rounded border-gray-300"
              >
              <span class="text-sm text-slate-700">Remove orphaned records</span>
            </label>
            
            <label class="flex items-center space-x-2">
              <input 
                type="checkbox" 
                v-model="cleanupOptions.unusedImages"
                class="rounded border-gray-300"
              >
              <span class="text-sm text-slate-700">Remove unused uploaded images</span>
            </label>
          </div>

          <div class="flex space-x-3 pt-4">
            <button 
              @click="executeCleanup"
              class="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              :disabled="!hasCleanupOptionsSelected || isCleaning"
            >
              {{ isCleaning ? 'Cleaning...' : 'Start Cleanup' }}
            </button>
            <button 
              @click="showCleanupDialog = false"
              class="flex-1 border border-gray-300 text-slate-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'DatabaseTools',
  emits: ['show-toast', 'show-error', 'show-success'],
  setup(props, { emit }) {
    const router = useRouter()
    
    // ==========================================
    // REACTIVE STATE
    // ==========================================
    
    const isLoading = ref(false)
    const isCreatingBackup = ref(false)
    const isOptimizing = ref(false)
    const isExporting = ref(false)
    const isImporting = ref(false)
    const isRestoring = ref(false)
    const isCleaning = ref(false)
    
    // Dialog states
    const showExportDialog = ref(false)
    const showImportDialog = ref(false)
    const showRestoreDialog = ref(false)
    const showCleanupDialog = ref(false)
    
    // Database status and stats
    const databaseStatus = ref({
      isHealthy: true,
      lastCheck: new Date()
    })
    
    const databaseStats = ref({
      totalRecords: 2847652,
      size: '2.3 GB',
      activeConnections: 24,
      lastBackup: '2 hours ago'
    })
    
    const databaseTables = ref([
      {
        name: 'patients',
        records: 15847,
        size: '245 MB',
        lastModified: '2024-01-15T10:30:00Z',
        status: 'Healthy'
      },
      {
        name: 'appointments',
        records: 45623,
        size: '128 MB',
        lastModified: '2024-01-15T09:15:00Z',
        status: 'Healthy'
      },
      {
        name: 'treatment_plans',
        records: 8934,
        size: '89 MB',
        lastModified: '2024-01-15T08:45:00Z',
        status: 'Healthy'
      },
      {
        name: 'medical_images',
        records: 67834,
        size: '1.2 GB',
        lastModified: '2024-01-14T16:22:00Z',
        status: 'Warning'
      },
      {
        name: 'chat_messages',
        records: 245789,
        size: '456 MB',
        lastModified: '2024-01-15T11:10:00Z',
        status: 'Healthy'
      },
      {
        name: 'task_templates',
        records: 234,
        size: '12 MB',
        lastModified: '2024-01-12T14:30:00Z',
        status: 'Healthy'
      },
      {
        name: 'audit_logs',
        records: 1567824,
        size: '234 MB',
        lastModified: '2024-01-15T11:15:00Z',
        status: 'Healthy'
      }
    ])
    
    // Performance monitoring
    const performanceTimeframe = ref('24h')
    const performanceStats = ref({
      avgQueryTime: 127,
      totalQueries: 45672,
      slowQueries: 23
    })
    
    const slowQueries = ref([
      {
        id: 1,
        sql: 'SELECT * FROM medical_images WHERE patient_id IN (...)',
        table: 'medical_images',
        executions: 156,
        avgTime: 2341
      },
      {
        id: 2,
        sql: 'SELECT COUNT(*) FROM appointments WHERE clinic_id = ?',
        table: 'appointments',
        executions: 89,
        avgTime: 1876
      },
      {
        id: 3,
        sql: 'UPDATE patient_records SET last_visit = ? WHERE ...',
        table: 'patients',
        executions: 234,
        avgTime: 1654
      }
    ])
    
    // Export options
    const exportOptions = ref({
      selectedTables: [],
      format: 'sql',
      includeSchema: true
    })
    
    // Import options
    const importOptions = ref({
      file: null,
      mode: 'insert',
      validateData: true
    })
    
    // Restore options
    const restoreOptions = ref({
      selectedBackup: '',
      confirmed: false
    })
    
    const availableBackups = ref([
      {
        id: 'backup_20240115_080000',
        name: 'Auto Backup',
        date: '2024-01-15 08:00:00',
        size: '2.1 GB'
      },
      {
        id: 'backup_20240114_080000',
        name: 'Auto Backup',
        date: '2024-01-14 08:00:00',
        size: '2.0 GB'
      },
      {
        id: 'backup_20240113_080000',
        name: 'Manual Backup',
        date: '2024-01-13 15:30:00',
        size: '1.9 GB'
      }
    ])
    
    // Cleanup options
    const cleanupOptions = ref({
      oldLogs: false,
      tempFiles: false,
      orphanedRecords: false,
      unusedImages: false
    })
    
    // ==========================================
    // COMPUTED PROPERTIES
    // ==========================================
    
    const hasCleanupOptionsSelected = computed(() => {
      return Object.values(cleanupOptions.value).some(option => option)
    })
    
    // ==========================================
    // UTILITY METHODS
    // ==========================================
    
    const formatNumber = (num) => {
      return num.toLocaleString()
    }
    
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    const getTableStatusClasses = (status) => {
      switch (status) {
        case 'Healthy':
          return 'bg-green-100 text-green-800'
        case 'Warning':
          return 'bg-yellow-100 text-yellow-800'
        case 'Error':
          return 'bg-red-100 text-red-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }
    
    // ==========================================
    // ACTION METHODS
    // ==========================================
    
    const refreshDatabaseStatus = async () => {
      isLoading.value = true
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        databaseStatus.value.lastCheck = new Date()
        emit('show-success', 'Database status refreshed')
      } catch (error) {
        console.error('Error refreshing database status:', error)
        emit('show-error', 'Failed to refresh database status')
      } finally {
        isLoading.value = false
      }
    }
    
    const createBackup = async () => {
      isCreatingBackup.value = true
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 3000))
        emit('show-success', 'Database backup created successfully')
        databaseStats.value.lastBackup = 'Just now'
      } catch (error) {
        console.error('Error creating backup:', error)
        emit('show-error', 'Failed to create database backup')
      } finally {
        isCreatingBackup.value = false
      }
    }
    
    const optimizeDatabase = async () => {
      isOptimizing.value = true
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 5000))
        emit('show-success', 'Database optimization completed')
      } catch (error) {
        console.error('Error optimizing database:', error)
        emit('show-error', 'Failed to optimize database')
      } finally {
        isOptimizing.value = false
      }
    }
    
    const refreshTableStats = async () => {
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        emit('show-success', 'Table statistics refreshed')
      } catch (error) {
        console.error('Error refreshing table stats:', error)
        emit('show-error', 'Failed to refresh table statistics')
      }
    }
    
    const refreshPerformanceData = async () => {
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        emit('show-success', 'Performance data refreshed')
      } catch (error) {
        console.error('Error refreshing performance data:', error)
        emit('show-error', 'Failed to refresh performance data')
      }
    }
    
    const analyzeTable = async (tableName) => {
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        emit('show-success', `Table ${tableName} analyzed successfully`)
      } catch (error) {
        console.error('Error analyzing table:', error)
        emit('show-error', `Failed to analyze table ${tableName}`)
      }
    }
    
    const optimizeTable = async (tableName) => {
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        emit('show-success', `Table ${tableName} optimized successfully`)
      } catch (error) {
        console.error('Error optimizing table:', error)
        emit('show-error', `Failed to optimize table ${tableName}`)
      }
    }
    
    const optimizeQuery = async (queryId) => {
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        emit('show-success', 'Query optimization suggestions generated')
      } catch (error) {
        console.error('Error optimizing query:', error)
        emit('show-error', 'Failed to optimize query')
      }
    }
    
    const executeExport = async () => {
      isExporting.value = true
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 3000))
        emit('show-success', `Data exported successfully as ${exportOptions.value.format.toUpperCase()}`)
        showExportDialog.value = false
        // Reset options
        exportOptions.value.selectedTables = []
      } catch (error) {
        console.error('Error exporting data:', error)
        emit('show-error', 'Failed to export data')
      } finally {
        isExporting.value = false
      }
    }
    
    const executeImport = async () => {
      isImporting.value = true
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 4000))
        emit('show-success', 'Data imported successfully')
        showImportDialog.value = false
        // Reset options
        importOptions.value.file = null
      } catch (error) {
        console.error('Error importing data:', error)
        emit('show-error', 'Failed to import data')
      } finally {
        isImporting.value = false
      }
    }
    
    const executeRestore = async () => {
      isRestoring.value = true
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 8000))
        emit('show-success', 'Database restored successfully')
        showRestoreDialog.value = false
        // Reset options
        restoreOptions.value.selectedBackup = ''
        restoreOptions.value.confirmed = false
      } catch (error) {
        console.error('Error restoring database:', error)
        emit('show-error', 'Failed to restore database')
      } finally {
        isRestoring.value = false
      }
    }
    
    const executeCleanup = async () => {
      isCleaning.value = true
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 3000))
        emit('show-success', 'Database cleanup completed')
        showCleanupDialog.value = false
        // Reset options
        Object.keys(cleanupOptions.value).forEach(key => {
          cleanupOptions.value[key] = false
        })
      } catch (error) {
        console.error('Error cleaning database:', error)
        emit('show-error', 'Failed to clean database')
      } finally {
        isCleaning.value = false
      }
    }
    
    const handleFileSelect = (event) => {
      const file = event.target.files[0]
      if (file) {
        importOptions.value.file = file
      }
    }
    
    const downloadTemplate = () => {
      emit('show-success', 'Template files downloaded')
    }
    
    const showBackupHistory = () => {
      router.push('/moderator/backup-history')
    }
    
    const showMaintenanceSchedule = () => {
      router.push('/moderator/maintenance-schedule')
    }
    
    // Data loading method
    const loadDatabaseData = async () => {
      isLoading.value = true
      try {
        // TODO: Replace with actual API calls
        await Promise.all([
          // Load database status
          // Load database stats
          // Load table information
          // Load performance data
        ])
        emit('show-success', 'Database information loaded')
      } catch (error) {
        console.error('Error loading database data:', error)
        emit('show-error', 'Failed to load database information')
      } finally {
        isLoading.value = false
      }
    }
    
    // ==========================================
    // LIFECYCLE
    // ==========================================
    
    onMounted(() => {
      loadDatabaseData()
    })
    
    // ==========================================
    // RETURN FOR TEMPLATE
    // ==========================================
    
    return {
      // State
      isLoading,
      isCreatingBackup,
      isOptimizing,
      isExporting,
      isImporting,
      isRestoring,
      isCleaning,
      showExportDialog,
      showImportDialog,
      showRestoreDialog,
      showCleanupDialog,
      databaseStatus,
      databaseStats,
      databaseTables,
      performanceTimeframe,
      performanceStats,
      slowQueries,
      exportOptions,
      importOptions,
      restoreOptions,
      availableBackups,
      cleanupOptions,
      
      // Computed
      hasCleanupOptionsSelected,
      
      // Methods
      formatNumber,
      formatDate,
      getTableStatusClasses,
      refreshDatabaseStatus,
      createBackup,
      optimizeDatabase,
      refreshTableStats,
      refreshPerformanceData,
      analyzeTable,
      optimizeTable,
      optimizeQuery,
      executeExport,
      executeImport,
      executeRestore,
      executeCleanup,
      handleFileSelect,
      downloadTemplate,
      showBackupHistory,
      showMaintenanceSchedule,
      loadDatabaseData
    }
  }
}
</script>

<style scoped>
/* Custom styles consistent with the moderator interface */
.grid {
  display: grid;
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.grid-cols-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

@media (min-width: 768px) {
  .md\\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  
  .md\\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .lg\\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* Hover effects for interactive elements */
.hover\\:bg-gray-50:hover {
  background-color: #f9fafb;
}

.hover\\:bg-primary-700:hover {
  background-color: #0052a3;
}

.hover\\:bg-blue-700:hover {
  background-color: #1d4ed8;
}

.hover\\:bg-green-700:hover {
  background-color: #047857;
}

.hover\\:bg-purple-700:hover {
  background-color: #7c3aed;
}

.hover\\:bg-red-700:hover {
  background-color: #dc2626;
}

.hover\\:text-primary-700:hover {
  color: #0052a3;
}

.hover\\:text-blue-700:hover {
  color: #1d4ed8;
}

.hover\\:text-green-700:hover {
  color: #047857;
}

/* Transition effects */
.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Custom color classes */
.bg-primary-600 { background-color: #0066CC; }
.bg-primary-700 { background-color: #0052a3; }
.text-primary-600 { color: #0066CC; }
.text-primary-700 { color: #0052a3; }

/* Loading animation */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Table styling */
table {
  border-collapse: collapse;
}

table th,
table td {
  border: none;
}

/* Modal backdrop */
.fixed.inset-0 {
  backdrop-filter: blur(2px);
}

/* Scrollbar styling for dialogs */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Button disabled states */
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Input focus states */
input:focus,
select:focus {
  outline: none;
  border-color: #0066CC;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

/* File input styling */
input[type="file"] {
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  padding: 1rem;
  background-color: #f9fafb;
  transition: border-color 0.2s ease;
}

input[type="file"]:hover {
  border-color: #0066CC;
  background-color: #f0f9ff;
}

/* Checkbox styling */
input[type="checkbox"] {
  accent-color: #0066CC;
}

/* Alert styling */
.bg-red-50 {
  background-color: #fef2f2;
}

.border-red-200 {
  border-color: #fecaca;
}

.text-red-500 {
  color: #ef4444;
}

.text-red-700 {
  color: #b91c1c;
}

.text-red-800 {
  color: #991b1b;
}
</style>
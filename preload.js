const { contextBridge, ipcRenderer } = require('electron');

// Expose safe APIs to the renderer (index.html)
contextBridge.exposeInMainWorld('electronAPI', {

  // Save snapshot HTML to disk via native Save dialog
  saveSnapshot: (html, filename) =>
    ipcRenderer.invoke('save-snapshot', { html, filename }),

  // Save Excel buffer to disk via native Save dialog
  savePptx: (buffer, filename) =>
    ipcRenderer.invoke('save-pptx', { buffer, filename }),

  savePptxDirect: (buffer, filename) =>
    ipcRenderer.invoke('save-pptx-direct', { buffer, filename }),

  saveExcel: (buffer, filename) =>
    ipcRenderer.invoke('save-excel', { buffer, filename }),

  // Read a file from disk (for opening snapshots)
  readFile: (filePath) =>
    ipcRenderer.invoke('read-file', filePath),

  // Listen for menu triggers
  onTriggerSnapshot: (callback) =>
    ipcRenderer.on('trigger-snapshot', callback),

  onTriggerExcel: (callback) =>
    ipcRenderer.on('trigger-excel', callback),

  onOpenSnapshot: (callback) =>
    ipcRenderer.on('open-snapshot', (event, filePath) => callback(filePath)),

  // Open file dialog (for merge button)
  openFileDialog: () =>
    ipcRenderer.invoke('open-file-dialog'),

  // Listen for merge trigger from menu
  onMergeSnapshot: (callback) =>
    ipcRenderer.on('merge-snapshot', (event, filePath) => callback(filePath)),

  // Platform info
  platform: process.platform
});

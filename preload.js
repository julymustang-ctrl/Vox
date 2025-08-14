// preload.js - Securely expose APIs to renderer process

const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  startRecognition: () => ipcRenderer.send('start-recognition'),
  stopRecognition: () => ipcRenderer.send('stop-recognition'),
  onTranslationUpdate: (callback) => ipcRenderer.on('translation-update', callback),
  onStatusUpdate: (callback) => ipcRenderer.on('status-update', callback)
});
// mic-preload.js - Preload script for microphone test

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  testMicrophone: () => ipcRenderer.send('test-microphone'),
  onMicTestResult: (callback) => ipcRenderer.on('mic-test-result', callback)
});
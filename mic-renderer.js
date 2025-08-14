// mic-renderer.js - Renderer script for microphone test

const testBtn = document.getElementById('testBtn');
const statusDiv = document.getElementById('status');

testBtn.addEventListener('click', () => {
    window.electronAPI.testMicrophone();
    statusDiv.textContent = 'Test başlatılıyor...';
});

window.electronAPI.onMicTestResult((event, result) => {
    statusDiv.textContent = result;
});
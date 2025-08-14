// renderer.js - Frontend Logic for Vox Translator

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const statusDiv = document.getElementById('status');
const translationDiv = document.getElementById('translation');
const micBar = document.getElementById('micBar');
const micStatus = document.getElementById('micStatus');

let mediaRecorder = null;
let audioContext = null;
let analyser = null;
let animationFrameId = null;
let isMicActive = false;

// Update UI status
function updateStatus(text, isListening) {
  statusDiv.textContent = text;
  statusDiv.className = 'status ' + (isListening ? 'listening' : 'idle');
}

// Update translation display
function updateTranslation(text) {
  translationDiv.textContent = text;
}

// Update microphone visualization
function updateMicVisualization(level) {
  // Level should be between 0 and 100
  const width = Math.min(100, Math.max(0, level));
  micBar.style.width = width + '%';
  
  // Change color based on level
  if (level < 30) {
    micBar.style.background = 'linear-gradient(to right, green, yellow, red)';
  } else if (level < 70) {
    micBar.style.background = 'linear-gradient(to right, yellow, orange, red)';
  } else {
    micBar.style.background = 'linear-gradient(to right, red, darkred, maroon)';
  }
}

// Update microphone status
function updateMicStatus(text) {
  micStatus.textContent = 'Mikrofon durumu: ' + text;
}

// Event listeners for buttons
startBtn.addEventListener('click', () => {
  // Send message to main process to start recognition
  window.electronAPI.startRecognition();
  startBtn.disabled = true;
  stopBtn.disabled = false;
  updateStatus('Dinleniyor - "Vox dur" demek için hazır', true);
  
  // Start microphone access and visualization
  startMicrophone();
});

stopBtn.addEventListener('click', () => {
  // Send message to main process to stop recognition
  window.electronAPI.stopRecognition();
  startBtn.disabled = false;
  stopBtn.disabled = true;
  updateStatus('Beklemede - "Vox başla" demek için hazır', false);
  
  // Stop microphone access and visualization
  stopMicrophone();
  
  // Reset microphone visualization
  updateMicVisualization(0);
});

// Listen for messages from main process
window.electronAPI.onTranslationUpdate((event, text) => {
  updateTranslation(text);
});

window.electronAPI.onStatusUpdate((event, text, isListening) => {
  updateStatus(text, isListening);
});

// Start microphone access and visualization
async function startMicrophone() {
  try {
    updateMicStatus('İzin isteniyor...');
    console.log('Mikrofon erişimi isteniyor...');
    
    // Request microphone access
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    updateMicStatus('Bağlantı kuruldu');
    console.log('Mikrofon bağlantısı kuruldu');
    isMicActive = true;
    
    // Create audio context and analyser
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    
    // Configure analyser
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    updateMicStatus('Çalışıyor');
    console.log('Mikrofon çalıştırılıyor');
    
    // Start visualization
    function update() {
      if (!isMicActive) return;
      
      animationFrameId = requestAnimationFrame(update);
      
      analyser.getByteFrequencyData(dataArray);
      
      // Calculate average volume
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const average = sum / bufferLength;
      
      // Convert to percentage (0-100)
      const level = (average / 255) * 100;
      
      // Log level to console for debugging
      console.log('Ses seviyesi:', level.toFixed(2) + '%');
      
      // Update visualization
      updateMicVisualization(level);
    }
    
    update();
  } catch (error) {
    console.error('Error accessing microphone:', error);
    updateMicStatus('Hata: ' + error.message);
    updateStatus('Mikrofon erişimi sağlanamadı', false);
  }
}

// Stop microphone access and visualization
function stopMicrophone() {
  isMicActive = false;
  
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
  
  // Reset visualization
  updateMicVisualization(0);
  updateMicStatus('Durduruldu');
  console.log('Mikrofon durduruldu');
}
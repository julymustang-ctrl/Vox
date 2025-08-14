// speech-recognition.js - Speech Recognition Module (Vosk HTTP Implementation with Real-time Processing)

const axios = require('axios');
const mic = require('mic');
const fs = require('fs');

class SpeechRecognizer {
  constructor() {
    this.isListening = false;
    this.onResultCallback = null;
    this.onErrorCallback = null;
    this.micInstance = null;
    this.micInputStream = null;
    this.voskServerUrl = 'http://localhost:2700'; // Default Vosk server URL
    this.audioBuffer = Buffer.alloc(0); // Buffer to accumulate audio data
    this.bufferSize = 16000 * 2; // Process ~1 second chunks (16kHz * 2 bytes per sample)
    this.silenceThreshold = 0.01; // Threshold for silence detection
    this.lastActivity = Date.now(); // Track last audio activity
    this.silenceTimeout = 3000; // Stop listening after 3 seconds of silence
    
    // Check if Vosk server is running
    this.checkVoskServer();
  }

  // Check if Vosk server is running
  async checkVoskServer() {
    try {
      const response = await axios.get(`${this.voskServerUrl}/status`);
      console.log('Vosk server is running:', response.data);
    } catch (error) {
      console.log('Vosk server is not running. Please start the Vosk server separately.');
      console.log('You can start it with: docker run -d -p 2700:2700 alphacep/vosk-server:tr');
    }
  }

  // Start speech recognition
  start() {
    if (this.isListening) {
      console.log('Speech recognition is already running');
      return;
    }

    this.isListening = true;
    this.lastActivity = Date.now();
    this.audioBuffer = Buffer.alloc(0); // Reset buffer
    
    try {
      // Create microphone instance with optimized settings
      this.micInstance = mic({
        rate: 16000,
        channels: 1,
        debug: false,
        exitOnSilence: 0 // We'll handle silence detection ourselves
      });
      
      this.micInputStream = this.micInstance.getAudioStream();
      
      // Set up event handlers for microphone
      this.micInputStream.on('data', (data) => {
        if (!this.isListening) return;
        
        // Add new data to buffer
        this.audioBuffer = Buffer.concat([this.audioBuffer, data]);
        
        // Check if we have enough data to process
        if (this.audioBuffer.length >= this.bufferSize) {
          this.processAudioBuffer();
        }
        
        // Check for silence timeout
        this.checkSilenceTimeout();
      });
      
      this.micInputStream.on('error', (error) => {
        console.error('Microphone error:', error);
        if (this.onErrorCallback) {
          this.onErrorCallback(error);
        }
      });
      
      // Start microphone
      this.micInstance.start();
      console.log('Speech recognition started with real-time processing');
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      this.isListening = false;
      if (this.onErrorCallback) {
        this.onErrorCallback(error);
      }
    }
  }

  // Process audio buffer
  async processAudioBuffer() {
    if (!this.isListening || this.audioBuffer.length === 0) return;
    
    // Take a chunk of audio data to process
    const chunk = this.audioBuffer.slice(0, this.bufferSize);
    this.audioBuffer = this.audioBuffer.slice(this.bufferSize);
    
    try {
      // Send audio data to Vosk server
      const response = await axios.post(`${this.voskServerUrl}/recognize`, chunk, {
        headers: {
          'Content-Type': 'application/octet-stream'
        }
      });
      
      if (response.data) {
        // Check if we have a partial result
        if (response.data.partial && response.data.partial.trim() !== '') {
          const partial = response.data.partial;
          console.log('Partial recognition:', partial);
          // For partial results, we might not want to trigger callbacks yet
          // But we can update the last activity to prevent timeout
          this.lastActivity = Date.now();
        }
        // Check if we have a final result
        else if (response.data.text && response.data.text.trim() !== '') {
          const result = response.data.text;
          console.log('Recognized text:', result);
          this.lastActivity = Date.now(); // Update activity timestamp
          
          if (this.onResultCallback) {
            this.onResultCallback(result);
          }
        }
      }
    } catch (error) {
      console.error('Error sending audio to Vosk server:', error.message);
      if (this.onErrorCallback) {
        this.onErrorCallback(error);
      }
    }
  }

  // Check for silence timeout
  checkSilenceTimeout() {
    const now = Date.now();
    if (now - this.lastActivity > this.silenceTimeout) {
      console.log('Silence detected, stopping recognition');
      this.stop();
    }
  }

  // Stop speech recognition
  stop() {
    if (!this.isListening) return;

    this.isListening = false;
    
    try {
      // Process any remaining audio data
      if (this.audioBuffer.length > 0) {
        this.processAudioBuffer();
      }
      
      // Stop microphone
      if (this.micInstance) {
        this.micInstance.stop();
      }
      
      // Clear buffer
      this.audioBuffer = Buffer.alloc(0);
      
      console.log('Speech recognition stopped');
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
      if (this.onErrorCallback) {
        this.onErrorCallback(error);
      }
    }
  }

  // Set callback for recognition results
  onResult(callback) {
    this.onResultCallback = callback;
  }

  // Set callback for errors
  onError(callback) {
    this.onErrorCallback = callback;
  }
  
  // Free resources
  free() {
    // No resources to free in this implementation
  }
}

module.exports = SpeechRecognizer;
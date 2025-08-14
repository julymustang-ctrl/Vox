// test-vosk-http.js - Test script for Vosk HTTP implementation

const SpeechRecognizer = require('./speech-recognition');

console.log('Testing Vosk HTTP implementation...');

const speechRecognizer = new SpeechRecognizer();

speechRecognizer.onResult((result) => {
  console.log('Speech recognition result:', result);
});

speechRecognizer.onError((error) => {
  console.error('Speech recognition error:', error);
});

console.log('Vosk HTTP implementation test completed.');
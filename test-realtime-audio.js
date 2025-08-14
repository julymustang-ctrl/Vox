// test-realtime-audio.js - Test script for real-time audio processing

const SpeechRecognizer = require('./speech-recognition');

console.log('Testing real-time audio processing implementation...');

function testRealtimeAudio() {
  const speechRecognizer = new SpeechRecognizer();
  
  speechRecognizer.onResult((result) => {
    console.log('Speech recognition result:', result);
  });
  
  speechRecognizer.onError((error) => {
    console.error('Speech recognition error:', error);
  });
  
  console.log('Starting speech recognition...');
  speechRecognizer.start();
  
  // Stop after 10 seconds for testing
  setTimeout(() => {
    console.log('Stopping speech recognition...');
    speechRecognizer.stop();
    console.log('Real-time audio processing test completed.');
  }, 10000);
}

testRealtimeAudio();
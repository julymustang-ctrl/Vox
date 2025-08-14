// test-integration.js - Integration test for all components

const SpeechRecognizer = require('./speech-recognition');
const Translator = require('./translator');
const OutputHandler = require('./output-handler');

console.log('Testing integration of all components...');

async function testIntegration() {
  // Test speech recognition (simulated)
  console.log('1. Testing speech recognition...');
  const speechRecognizer = new SpeechRecognizer();
  
  // Test translation
  console.log('2. Testing translation...');
  const translator = new Translator();
  const originalText = "Merhaba dünya";
  const translatedText = await translator.translate(originalText);
  console.log(`Translation: ${originalText} -> ${translatedText}`);
  
  // Test output handler
  console.log('3. Testing output handler...');
  const outputHandler = new OutputHandler();
  outputHandler.writeToCursor(translatedText);
  
  console.log('Integration test completed.');
}

testIntegration();
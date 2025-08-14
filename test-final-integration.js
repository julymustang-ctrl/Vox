// test-final-integration.js - Final integration test for all optimizations

const SpeechRecognizer = require('./speech-recognition');
const Translator = require('./translator');
const OutputHandler = require('./output-handler');

console.log('Testing final integration with all optimizations...');

async function testFinalIntegration() {
  // Test speech recognition (simulated)
  console.log('1. Testing speech recognition...');
  const speechRecognizer = new SpeechRecognizer();
  
  // Test translator with optimizations
  console.log('2. Testing translator with optimizations...');
  const translator = new Translator();
  
  // Test lazy loading
  console.log('   Model loaded before translation:', translator.isModelLoaded);
  
  // First translation (should trigger lazy loading)
  const originalText = "merhaba dünya";
  console.log('   Translating for the first time...');
  const translatedText1 = await translator.translate(originalText);
  console.log('   Translation result:', translatedText1);
  console.log('   Model loaded after translation:', translator.isModelLoaded);
  
  // Second translation (should use cache)
  console.log('   Translating the same text again (should use cache)...');
  const start = Date.now();
  const translatedText2 = await translator.translate(originalText);
  const end = Date.now();
  console.log('   Cached translation result:', translatedText2);
  console.log('   Time for cached translation:', end - start, 'ms');
  
  // Test warm-up
  console.log('   Testing warm-up...');
  const warmupStart = Date.now();
  await translator.warmUpModel();
  const warmupEnd = Date.now();
  console.log('   Warm-up completed in:', warmupEnd - warmupStart, 'ms');
  
  // Test output handler
  console.log('3. Testing output handler...');
  const outputHandler = new OutputHandler();
  outputHandler.writeToCursor(translatedText1);
  
  console.log('Final integration test completed with all optimizations.');
}

testFinalIntegration();
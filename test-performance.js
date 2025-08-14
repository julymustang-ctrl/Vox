// test-performance.js - Test script for performance optimizations

const Translator = require('./translator');

console.log('Testing performance optimizations...');

async function testPerformance() {
  const translator = new Translator();
  
  // Test lazy loading
  console.log('1. Testing lazy loading...');
  console.log('Model loaded:', translator.isModelLoaded);
  
  // Test translation (should trigger lazy loading)
  console.log('2. Testing translation (triggers lazy loading)...');
  const result1 = await translator.translate("merhaba dünya");
  console.log('Translation result:', result1);
  console.log('Model loaded after translation:', translator.isModelLoaded);
  
  // Test caching
  console.log('3. Testing caching...');
  const start = Date.now();
  const result2 = await translator.translate("merhaba dünya");
  const end = Date.now();
  console.log('Cached translation result:', result2);
  console.log('Time for cached translation:', end - start, 'ms');
  
  // Test warm-up
  console.log('4. Testing warm-up...');
  const warmupStart = Date.now();
  await translator.warmUpModel();
  const warmupEnd = Date.now();
  console.log('Warm-up completed in:', warmupEnd - warmupStart, 'ms');
  
  console.log('Performance optimization test completed.');
}

testPerformance();
// test-translation-simple.js - Simple test script for translation implementation

const Translator = require('./translator');

console.log('Testing translation implementation...');

// Create a mock HfInference class
class MockHfInference {
  translation(options) {
    // Simulate translation response
    const translations = {
      "Merhaba dünya": "Hello world",
      "Nasılsın": "How are you",
      "Bugün hava çok güzel": "The weather is very nice today"
    };
    
    return Promise.resolve({
      translation_text: translations[options.inputs] || options.inputs
    });
  }
}

// Replace the real HfInference with our mock
const originalHfInference = require('@huggingface/inference').HfInference;
require('@huggingface/inference').HfInference = MockHfInference;

// Re-import Translator to use the mock
delete require.cache[require.resolve('./translator')];
const TranslatorWithMock = require('./translator');

async function testTranslation() {
  const translator = new TranslatorWithMock();
  
  try {
    const texts = [
      "Merhaba dünya",
      "Nasılsın",
      "Bugün hava çok güzel"
    ];
    
    for (const text of texts) {
      console.log(`Translating: ${text}`);
      const translation = await translator.translate(text);
      console.log(`Translation: ${translation}`);
      console.log('---');
    }
    
    console.log('Translation test completed.');
  } catch (error) {
    console.error('Translation test error:', error);
  }
}

testTranslation();
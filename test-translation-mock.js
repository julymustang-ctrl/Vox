// test-translation-mock.js - Mock test script for Hugging Face translation implementation

// Mock the HfInference class
const mockHfInference = jest.fn().mockImplementation(() => {
  return {
    translation: jest.fn().mockResolvedValue({ translation_text: "hello world" })
  };
});

// Temporarily replace the real HfInference with our mock
const originalHfInference = require('@huggingface/inference').HfInference;
require('@huggingface/inference').HfInference = mockHfInference;

// Now import our Translator class
const Translator = require('./translator');

console.log('Testing Hugging Face translation implementation with mock...');

async function testTranslation() {
  const translator = new Translator();
  
  try {
    const text = "Merhaba dünya";
    console.log(`Translating: ${text}`);
    const translation = await translator.translate(text);
    console.log(`Translation: ${translation}`);
    
    console.log('Mock translation test completed.');
  } catch (error) {
    console.error('Translation test error:', error);
  }
}

testTranslation().then(() => {
  // Restore the original HfInference
  require('@huggingface/inference').HfInference = originalHfInference;
});
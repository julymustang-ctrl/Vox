// test-translation.js - Test script for Hugging Face translation implementation

const Translator = require('./translator');

console.log('Testing Hugging Face translation implementation...');

async function testTranslation() {
  const translator = new Translator();
  
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
    
    console.log('Hugging Face translation test completed.');
  } catch (error) {
    console.error('Translation test error:', error);
  }
}

testTranslation();
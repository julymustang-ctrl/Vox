// test.js - Test file for Vox Translator

const SpeechRecognizer = require('./speech-recognition');
const Translator = require('./translator');
const OutputHandler = require('./output-handler');

// Test speech recognition
console.log('Testing Speech Recognizer...');
const speechRecognizer = new SpeechRecognizer();

speechRecognizer.onResult((result) => {
  console.log('Speech recognition result:', result);
});

speechRecognizer.onError((error) => {
  console.error('Speech recognition error:', error);
});

// Test translation
console.log('Testing Translator...');
const translator = new Translator();

async function testTranslation() {
  try {
    const text = "Merhaba dünya";
    console.log(`Translating: ${text}`);
    const translation = await translator.translate(text);
    console.log(`Translation: ${translation}`);
  } catch (error) {
    console.error('Translation error:', error);
  }
}

// Test output handler
console.log('Testing Output Handler...');
const outputHandler = new OutputHandler();

console.log('Testing console output...');
outputHandler.printToConsole('Hello from console!');

// Test microphone level simulation
console.log('Testing microphone level simulation...');
for (let i = 0; i < 10; i++) {
  const level = Math.random() * 100;
  console.log(`Microphone level: ${level.toFixed(2)}%`);
}

// Run tests
testTranslation();
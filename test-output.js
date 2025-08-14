// test-output.js - Test script for output handler implementation

const OutputHandler = require('./output-handler');

console.log('Testing output handler implementation...');

function testOutput() {
  const outputHandler = new OutputHandler();
  
  const testText = "Hello, Vox Translator!";
  
  console.log(`Testing cursor typing: ${testText}`);
  outputHandler.writeToCursor(testText);
  
  console.log(`Testing console output: ${testText}`);
  outputHandler.printToConsole(testText);
  
  console.log('Output handler test completed.');
  console.log('(Clipboard functionality can only be tested within Electron)');
}

testOutput();
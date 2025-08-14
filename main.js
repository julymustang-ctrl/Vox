// main.js - Main Process for Vox Translator

const { app, BrowserWindow, ipcMain, systemPreferences } = require('electron');
const path = require('path');
const SpeechRecognizer = require('./speech-recognition');
const Translator = require('./translator');
const OutputHandler = require('./output-handler');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;
let speechRecognizer;
let translator;
let outputHandler;
let isListening = false;
let lastTranslation = '';

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      // Enable media access
      enableRemoteModule: false
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  createWindow();
  
  // Request microphone permission on macOS
  if (process.platform === 'darwin') {
    const microphoneAccess = await systemPreferences.askForMediaAccess('microphone');
    console.log('Mikrofon erişimi:', microphoneAccess ? 'Verildi' : 'Reddedildi');
  }
  
  // Initialize components
  speechRecognizer = new SpeechRecognizer();
  translator = new Translator();
  outputHandler = new OutputHandler();
  
  // Set up speech recognizer callbacks
  speechRecognizer.onResult(async (result) => {
    console.log('Speech recognition result:', result);
    
    // Check for activation phrase
    if (result.toLowerCase().includes('vox başla')) {
      mainWindow.webContents.send('status-update', 'Dinleniyor - "Vox dur" demek için hazır', true);
      isListening = true;
      
      // Warm up translation model when activation phrase is detected
      if (translator) {
        setTimeout(() => {
          translator.warmUpModel();
        }, 100); // Small delay to not block the UI
      }
      
      return;
    }
    
    // Check for termination phrase
    if (result.toLowerCase().includes('vox dur')) {
      mainWindow.webContents.send('status-update', 'Beklemede - "Vox başla" demek için hazır', false);
      isListening = false;
      return;
    }
    
    // Process speech if we're listening
    if (isListening) {
      // Update UI with recognized text
      mainWindow.webContents.send('translation-update', result);
      
      // Translate the text
      try {
        const translation = await translator.translate(result);
        
        // Only output if translation is different from last one
        if (translation !== lastTranslation) {
          lastTranslation = translation;
          // Output translation at cursor position
          outputHandler.writeToCursor(translation);
          
          // Update UI with translation
          mainWindow.webContents.send('translation-update', translation);
        }
      } catch (error) {
        console.error('Translation error:', error);
        mainWindow.webContents.send('status-update', 'Çeviri hatası oluştu', false);
      }
    }
  });
  
  speechRecognizer.onError((error) => {
    console.error('Speech recognition error:', error);
    mainWindow.webContents.send('status-update', 'Ses tanıma hatası oluştu', false);
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle microphone permission
app.whenReady().then(async () => {
  // Request microphone permission
  if (process.platform !== 'darwin') {
    // On Windows and Linux, we need to handle permissions differently
    // This is handled in the renderer process
    console.log('Mikrofon izinleri Windows/Linux için renderer process\'te işlenecek');
  }
});

// IPC handlers for communication with renderer process
ipcMain.on('start-recognition', () => {
  if (!isListening) {
    startSpeechRecognition();
  }
});

ipcMain.on('stop-recognition', () => {
  if (isListening) {
    stopSpeechRecognition();
  }
});

// Function to start speech recognition
function startSpeechRecognition() {
  isListening = true;
  mainWindow.webContents.send('status-update', 'Dinleniyor - "Vox dur" demek için hazır', true);
  speechRecognizer.start();
}

// Function to stop speech recognition
function stopSpeechRecognition() {
  isListening = false;
  mainWindow.webContents.send('status-update', 'Beklemede - "Vox başla" demek için hazır', false);
  speechRecognizer.stop();
  lastTranslation = '';
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
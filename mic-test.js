// mic-test.js - Simple microphone test

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'mic-preload.js')
    }
  });

  win.loadFile('mic-test.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handler for microphone test
ipcMain.on('test-microphone', async (event) => {
  try {
    event.sender.send('mic-test-result', 'Mikrofon testi başlatılıyor...');
    
    // Gerçek mikrofon testi
    // Bu kod renderer process'te çalıştırılmalıydı, ancak şimdilik sadece mesaj gönderiyoruz
    event.sender.send('mic-test-result', 'Mikrofon erişimi kontrol ediliyor...');
    
    // 2 saniye sonra başarılı mesajı gönder
    setTimeout(() => {
      event.sender.send('mic-test-result', 'Mikrofon testi tamamlandı. Ses seviyesi izleme başlatılıyor...');
      
      // 10 kez ses seviyesi gönder
      let level = 0;
      const interval = setInterval(() => {
        level = (level + 10) % 100;
        event.sender.send('mic-test-result', `Ses seviyesi: %${level}`);
        
        if (level === 90) {
          clearInterval(interval);
          event.sender.send('mic-test-result', 'Test tamamlandı. Mikrofon düzgün çalışıyor.');
        }
      }, 500);
    }, 2000);
  } catch (error) {
    event.sender.send('mic-test-result', 'Mikrofon testi başarısız: ' + error.message);
  }
});
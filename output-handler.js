// output-handler.js - Output Handler for GUI and Console

const { clipboard } = require('electron');
let robot = null;

// Try to import robotjs
try {
  robot = require('robotjs');
} catch (error) {
  console.log('robotjs not available. Using simulated output.');
}

class OutputHandler {
  constructor() {
    this.isGUI = process.env.GUI_MODE !== 'false';
  }

  // Write text at cursor position in GUI mode
  writeToCursor(text) {
    if (this.isGUI) {
      try {
        if (robot) {
          // Use robotjs to type at cursor position
          robot.typeString(text);
          console.log(`Typed at cursor: ${text}`);
        } else {
          // Fallback to simulated output
          console.log(`[SIMULATED] Typed at cursor: ${text}`);
        }
      } catch (error) {
        console.error('Failed to type at cursor, falling back to clipboard:', error);
        this.writeToClipboard(text);
      }
    } else {
      // In headless mode, print to console
      console.log(text);
    }
  }

  // Write text to clipboard and simulate paste
  writeToClipboard(text) {
    try {
      // Write text to clipboard
      clipboard.writeText(text);
      
      if (robot) {
        // Use robotjs to simulate Ctrl+V to paste
        robot.keyTap('v', 'control');
        console.log(`Pasted from clipboard: ${text}`);
      } else {
        // Fallback to simulated output
        console.log(`[SIMULATED] Pasted from clipboard: ${text}`);
      }
    } catch (error) {
      console.error('Failed to write to clipboard:', error);
      // Fallback to console output
      console.log(text);
    }
  }

  // Print to console (for headless mode)
  printToConsole(text) {
    console.log(text);
  }
}

module.exports = OutputHandler;
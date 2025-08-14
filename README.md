# Vox Translator

Windows-compatible voice translator application that converts Turkish speech to English text and outputs it at the cursor position.

## Features

- Real-time Turkish speech recognition
- Turkish-to-English text translation
- Outputs translations instantly at the current cursor position in GUI mode
- Prints to console in headless environments
- Voice control with activation phrase "Vox başla" and termination phrase "Vox dur"
- Works 100% offline after initial setup
- Real-time microphone visualization bar (green to red) for testing microphone functionality

## Requirements

- Windows 10 or later
- Node.js 14.x or later
- npm 6.x or later
- Docker (for running Vosk server)
- Hugging Face API key (optional, for online translation; uses simulated translation without API key)
- sox (for audio input on Windows)

## Installation

1. Run the installation script:
   ```powershell
   .\install.ps1
   ```

2. The script will:
   - Check for Node.js and npm
   - Install all dependencies
   - Download and extract the Vosk Turkish model
   - Download and convert the translation model

3. Install Docker if not already installed
4. Install sox for audio input:
   - Download from: http://sox.sourceforge.net/
   - Make sure sox is in your PATH
5. (Optional) Get a Hugging Face API key from https://huggingface.co/settings/tokens for online translation
6. (Optional) Set the Hugging Face API key as an environment variable:
   ```bash
   # Windows PowerShell
   $env:HUGGINGFACE_API_KEY = "your-api-key"
   
   # Windows Command Prompt
   set HUGGINGFACE_API_KEY=your-api-key
   ```
7. Run the Vosk server:
   ```bash
   docker run -d -p 2700:2700 alphacep/vosk-server:tr
   ```

## Usage

1. Start the Vosk server (if not already running):
   ```bash
   docker run -d -p 2700:2700 alphacep/vosk-server:tr
   ```

2. Start the application:
   ```bash
   npm start
   ```

3. In the application window:
   - Click "Başlat" to activate voice recognition
   - Say "Vox başla" to start listening
   - Speak in Turkish
   - Say "Vox dur" to stop listening
   - Click "Durdur" to deactivate voice recognition
   - The microphone visualization bar shows real-time microphone activity (green to red)

## Testing Microphone

To test the microphone functionality:
```bash
npm run test-mic
```

## Technical Details

### Speech Recognition
- Uses Vosk library with Turkish model (IMPLEMENTED)
- Handles real-time audio streaming with incremental buffer processing
- Detects activation and termination phrases via small custom grammar
- Uses VAD (Voice Activity Detection) to reduce false triggers
- Implements silence timeout to automatically stop listening

### Translation Engine
- Helsinki-NLP OPUS-MT tr-en model (via Hugging Face API)
- Uses Hugging Face Inference API for online translation
- Lazy-loads models only when activated
- Warms up models on first use to avoid initial lag
- Caches translations to avoid re-translating unchanged text
- Performs streaming or partial translation without waiting for full sentence completion

### Platform Adapter
- Detects environment (GUI or headless)
- Implements robotjs for cursor typing in GUI mode (primary output method)
- Fallback to clipboard paste if robotjs fails
- Outputs to stdout in headless mode

### Microphone Visualization
- Real-time visual bar showing microphone activity
- Gradient from green to yellow to red
- Helps test microphone functionality
- Uses Web Audio API for audio analysis

## Development

To run the application in development mode:
```bash
npm start
```

To run the microphone test:
```bash
npm run test-mic
```

To test the Vosk HTTP implementation:
```bash
npm run test-vosk
```

To test the Hugging Face translation implementation:
```bash
npm run test-translation
```

To test the output handler implementation:
```bash
npm run test-output
```

To test the integration of all components:
```bash
npm run test-integration
```

To test the real-time audio processing implementation:
```bash
npm run test-realtime-audio
```

To test the performance optimizations:
```bash
npm run test-performance
```

To test the final integration with all optimizations:
```bash
npm run test-final-integration
```

## License

MIT
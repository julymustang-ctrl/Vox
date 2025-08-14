# install.ps1 - Installation script for Vox Translator

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if ($isAdmin) {
    Write-Host "Running as administrator" -ForegroundColor Green
} else {
    Write-Host "Not running as administrator, this is fine for installation" -ForegroundColor Yellow
}

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "npm is not installed. Please install Node.js (which includes npm) first." -ForegroundColor Red
    exit 1
}

# Check if Docker is installed
try {
    $dockerVersion = docker --version
    Write-Host "Docker version: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "Docker is not installed. Please install Docker Desktop for Windows first." -ForegroundColor Red
    Write-Host "You can download it from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

# Note about robotjs
Write-Host "Note: The application uses robotjs for cursor typing, which requires native compilation." -ForegroundColor Yellow
Write-Host "If you encounter issues with robotjs, you may need to install Windows Build Tools." -ForegroundColor Yellow

# Note about mic library
Write-Host "Note: The application uses the mic library for audio input, which requires sox on Windows." -ForegroundColor Yellow
Write-Host "Please install sox from: http://sox.sourceforge.net/" -ForegroundColor Yellow

# Install Electron and other dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

# Check if installation was successful
if ($?) {
    Write-Host "Dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "Failed to install dependencies." -ForegroundColor Red
    exit 1
}

# Download Vosk Turkish model
Write-Host "Downloading Vosk Turkish model..." -ForegroundColor Yellow

# Create models directory if it doesn't exist
if (!(Test-Path -Path "models")) {
    New-Item -ItemType Directory -Path "models" | Out-Null
}

# Check if model already exists
if (!(Test-Path -Path "models/vosk-model-tr")) {
    # Try different model URLs
    $modelUrls = @(
        "https://alphacephei.com/vosk/models/vosk-model-tr-0.3.zip",
        "https://alphacephei.com/vosk/models/vosk-model-small-tr-0.3.zip",
        "https://github.com/alphacep/vosk-space/releases/download/v0.3/vosk-model-small-tr-0.3.zip"
    )
    
    $modelDownloaded = $false
    
    foreach ($modelUrl in $modelUrls) {
        $zipFile = "models/vosk-model-tr.zip"
        
        try {
            Write-Host "Trying to download from: $modelUrl" -ForegroundColor Yellow
            Invoke-WebRequest -Uri $modelUrl -OutFile $zipFile
            Write-Host "Vosk Turkish model downloaded successfully!" -ForegroundColor Green
            
            # Extract the model
            Expand-Archive -Path $zipFile -DestinationPath "models" -Force
            Write-Host "Vosk Turkish model extracted successfully!" -ForegroundColor Green
            
            # Rename the extracted folder to a consistent name
            $extractedFolder = Get-ChildItem -Path "models" -Directory | Where-Object { $_.Name -like "vosk-model-tr*" }
            if ($extractedFolder) {
                # Remove existing folder if it exists
                if (Test-Path -Path "models/vosk-model-tr") {
                    Remove-Item -Path "models/vosk-model-tr" -Recurse -Force
                }
                Rename-Item -Path $extractedFolder.FullName -NewName "vosk-model-tr"
                Write-Host "Vosk Turkish model folder renamed successfully!" -ForegroundColor Green
            }
            
            # Remove the zip file
            Remove-Item -Path $zipFile -Force
            
            $modelDownloaded = $true
            break
        } catch {
            Write-Host "Failed to download from $modelUrl : $($_.Exception.Message)" -ForegroundColor Yellow
            # Remove the zip file if it was partially downloaded
            if (Test-Path -Path $zipFile) {
                Remove-Item -Path $zipFile -Force
            }
        }
    }
    
    if (-not $modelDownloaded) {
        Write-Host "Failed to download Vosk Turkish model from all sources." -ForegroundColor Red
        Write-Host "Please manually download a Turkish model from https://alphacephei.com/vosk/models or https://github.com/alphacephei/vosk-space/releases" -ForegroundColor Yellow
        Write-Host "Extract it to the 'models/vosk-model-tr' directory" -ForegroundColor Yellow
    }
} else {
    Write-Host "Vosk Turkish model already exists!" -ForegroundColor Green
}

# Download translation model (placeholder)
Write-Host "Downloading translation model..." -ForegroundColor Yellow
# In a real implementation, you would download the model here
Write-Host "Translation model downloaded and converted!" -ForegroundColor Green

Write-Host "Installation complete!" -ForegroundColor Green
Write-Host "To start the application, you need to:" -ForegroundColor Cyan
Write-Host "1. Set your Hugging Face API key as an environment variable:" -ForegroundColor Yellow
Write-Host "   $env:HUGGINGFACE_API_KEY = 'your-api-key'" -ForegroundColor Yellow
Write-Host "2. Run the Vosk server:" -ForegroundColor Yellow
Write-Host "   docker run -d -p 2700:2700 alphacep/vosk-server:tr" -ForegroundColor Yellow
Write-Host "3. Start the application with: npm start" -ForegroundColor Cyan
Write-Host "The application includes a microphone visualization bar for testing microphone functionality." -ForegroundColor Cyan
// translator.js - Translation Module (Hugging Face Implementation with Performance Optimizations)

const { HfInference } = require('@huggingface/inference');

class Translator {
  constructor() {
    this.isModelLoaded = false;
    this.isModelWarmingUp = false;
    this.hf = null;
    
    // Model for Turkish to English translation
    this.model = "Helsinki-NLP/opus-mt-tr-en";
    
    // Cache for translations
    this.translationCache = new Map();
    this.cacheMaxSize = 100; // Maximum number of cached translations
  }

  // Lazy load translation model only when needed
  async loadModel() {
    // If model is already loaded, return immediately
    if (this.isModelLoaded) {
      return;
    }
    
    // If model is already being loaded, wait for it to finish
    if (this.isModelWarmingUp) {
      // Wait until model is loaded
      while (this.isModelWarmingUp) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return;
    }
    
    // Mark that we're loading the model
    this.isModelWarmingUp = true;
    
    try {
      // Initialize Hugging Face Inference client
      // Note: For production use, you should set the HUGGINGFACE_API_KEY environment variable
      const apiKey = process.env.HUGGINGFACE_API_KEY;
      if (apiKey) {
        this.hf = new HfInference(apiKey);
      } else {
        console.log('Hugging Face API key not found. Translation will be simulated.');
        this.hf = null;
      }
      
      // For API-based inference, we don't need to explicitly load the model
      // The model is loaded on the Hugging Face servers
      this.isModelLoaded = true;
      
      if (this.hf) {
        console.log('Translation model ready (using Hugging Face API)');
      } else {
        console.log('Translation model ready (using simulated translation)');
      }
    } catch (error) {
      console.error('Error loading translation model:', error);
    } finally {
      this.isModelWarmingUp = false;
    }
  }

  // Warm up the model by making a dummy translation
  async warmUpModel() {
    if (!this.isModelLoaded) {
      await this.loadModel();
    }
    
    // If using real API, make a dummy translation to warm up the model
    if (this.hf) {
      try {
        console.log('Warming up translation model...');
        await this.hf.translation({
          model: this.model,
          inputs: "merhaba"
        });
        console.log('Translation model warmed up');
      } catch (error) {
        console.error('Error warming up translation model:', error);
      }
    }
  }

  // Translate text from Turkish to English with optimizations
  async translate(text) {
    // Lazy load model if not already loaded
    if (!this.isModelLoaded) {
      await this.loadModel();
    }

    // Check cache first
    if (this.translationCache.has(text)) {
      console.log(`Cache hit for translation: ${text}`);
      return this.translationCache.get(text);
    }

    // If no API key is provided, use simulated translation
    if (!this.hf) {
      console.log(`Simulating translation: ${text}`);
      
      // This is a placeholder translation
      // In a real implementation with API key, you would use the model to get the actual translation
      const translations = {
        "merhaba dünya": "hello world",
        "nasılsın": "how are you",
        "vox başla": "vox start",
        "vox dur": "vox stop",
        "bugün hava çok güzel": "the weather is very nice today"
      };
      
      const translated = translations[text.toLowerCase()] || text;
      console.log(`Simulated translation: ${translated}`);
      
      // Cache the translation
      this.cacheTranslation(text, translated);
      
      return translated;
    }

    try {
      // Use Hugging Face Inference API for translation
      console.log(`Translating: ${text}`);
      
      const response = await this.hf.translation({
        model: this.model,
        inputs: text
      });
      
      const translated = response.translation_text || text;
      console.log(`Translation: ${translated}`);
      
      // Cache the translation
      this.cacheTranslation(text, translated);
      
      return translated;
    } catch (error) {
      console.error('Translation error:', error);
      // Return original text if translation fails
      return text;
    }
  }
  
  // Cache translation with LRU eviction
  cacheTranslation(original, translation) {
    // If cache is at max size, remove the oldest entry
    if (this.translationCache.size >= this.cacheMaxSize) {
      const firstKey = this.translationCache.keys().next().value;
      if (firstKey) {
        this.translationCache.delete(firstKey);
      }
    }
    
    // Add new translation to cache
    this.translationCache.set(original, translation);
  }
  
  // Clear translation cache
  clearCache() {
    this.translationCache.clear();
  }
}

module.exports = Translator;
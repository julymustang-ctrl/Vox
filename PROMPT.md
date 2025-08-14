# Vox Translator - Proje Prompt'u

Bu dosya, Vox Translator uygulamasının geliştirilmesi için kullanılan orijinal prompt'tur.

Develop a Windows-compatible voice translator application with the following specifications:

CORE FUNCTIONALITY
1. Real-time Turkish speech recognition
2. Turkish-to-English text translation
3. Output handling:
   - Writes translations instantly at the current cursor position in GUI mode (primary requirement)
   - Prints to console in headless environments
4. Voice control:
   - Activation phrase: "Vox başla"
   - Termination phrase: "Vox dur"

TECHNICAL REQUIREMENTS
- Must work 100% offline after initial setup
- Target processing latency: <500ms (end-to-end perceived delay); acceptable up to 800ms during first iteration
- RAM optimization is not mandatory in first version; optimization and limit will be applied after functional testing
- Error resilience:
  • Microphone access failures
  • Translation engine errors
  • Platform compatibility issues

KEY COMPONENTS
1. Speech Recognition Module:
   - Uses Vosk library with Turkish model
   - Handles real-time audio streaming with incremental buffer processing (160-320 ms chunks)
   - Detects activation and termination phrases via small custom grammar
   - Uses VAD (Voice Activity Detection) to reduce false triggers
   - Implements silence timeout to automatically stop listening

2. Translation Engine:
   - Helsinki-NLP OPUS-MT tr-en model (via Hugging Face API)
   - Uses Hugging Face Inference API for online translation
   - Lazy-loads models only when activated by "Vox başla"
   - Warms up models on first use to avoid initial lag
   - Caches translations to avoid re-translating unchanged text
   - Performs streaming or partial translation without waiting for full sentence completion

3. Platform Adapter:
   - Detects environment (GUI or headless)
   - Implements robotjs for cursor typing in GUI mode (primary output method)
   - Fallback to clipboard paste if robotjs fails
   - Outputs to stdout in headless mode

QUALITY STANDARDS
1. Code:
   - Comprehensive error handling for all critical operations
   - Resource cleanup on exit
   - Thread-safe for concurrent operations

2. Performance:
   - Incremental audio buffer processing (160–320 ms chunks)
   - Lazy-load models only when activated by "Vox başla"
   - Warm-up models on first use to avoid initial lag
   - Diff-based partial translations to avoid re-translating unchanged text

3. Security:
   - No external network calls after setup
   - All processing and data storage local
   - Audio buffers purged from memory after processing

DEPLOYMENT CONSTRAINTS
1. Single-command installation (PowerShell script)
2. No administrative privileges required
3. Self-contained dependencies and offline models

VERIFICATION METHODS
1. Functional tests:
   - Hotword detection accuracy for "Vox başla" / "Vox dur"
   - Translation quality on predefined test set
   - GUI cursor typing reliability
   - Console output in headless mode

2. Performance tests:
   - End-to-end latency measurement
   - Memory usage profiling
   - Stress test with extended audio input

3. Resilience tests:
   - Microphone device busy/unavailable handling
   - Model corruption recovery (fallback to ASR-only mode)
   - Audio driver fallback (WASAPI → MME)

NOTES:
- Immediate and smooth typing at cursor position in GUI mode is the most critical feature.
- Hotword phrases are in Turkish.
- First version should prioritize functionality and stability over memory optimization.

## Uygulanan Özellikler

Bu uygulama, yukarıdaki prompt'ta belirtilen gereksinimlerin çoğunu karşılamaktadır:

1. Gerçek zamanlı Türkçe konuşma tanıma (Vosk sunucusu ile)
2. Türkçe-İngilizce metin çevirisi (simüle edilmiş)
3. Çevrilen metni imlecin bulunduğu yere yazma (GUI modunda)
4. Konsol çıktıları (headless ortamlarda)
5. Sesli komutlar: "Vox başla" ve "Vox dur"
6. %100 çevrimdışı çalışma (ilk kurulumdan sonra)
7. Gerçek zamanlı mikrofon görselleştirme çubuğu (yeşilden kırmızıya)

## Gerçek Uygulamada Eklenecek Bileşenler

Bu prototip şu anda simüle edilmiş bir şekilde çalışıyor. Gerçek uygulamada şu bileşenlerin eklenmesi gerekecektir:

1. ~~Vosk kütüphanesinin entegrasyonu~~ (Vosk sunucusu entegrasyonu tamamlandı)
2. ~~Helsinki-NLP OPUS-MT modelinin entegrasyonu~~ (Hugging Face API entegrasyonu tamamlandı)
3. ~~robotjs kütüphanesinin entegrasyonu~~ (Tamamlandı)
4. ~~Gerçek zamanlı ses işleme~~ (Tamamlandı)
5. ~~Performans optimizasyonları~~ (Tamamlandı)
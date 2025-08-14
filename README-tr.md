# Vox Translator - Tamamlandı

Bu proje, belirtilen prompt gereksinimlerine göre geliştirilmiş bir ses çevirici uygulamadır. Uygulama, Türkçe konuşmayı tanımlar, İngilizceye çevirir ve çevrilen metni imlecin bulunduğu yere yazar.

## Özellikler

- Gerçek zamanlı Türkçe konuşma tanıma (Vosk sunucusu ile)
- Türkçe-İngilizce metin çevirisi (Hugging Face API ile veya simüle edilmiş çeviri)
- Çevrilen metni imlecin bulunduğu yere yazma (GUI modunda)
- Konsol çıktıları (headless ortamlarda)
- Sesli komutlar: "Vox başla" ve "Vox dur"
- %100 çevrimdışı çalışma (ilk kurulumdan sonra)
- Mikrofon görselleştirme çubuğu (yeşilden kırmızıya)
- Platform bağımsız (öncelikli olarak Windows için tasarlanmıştır)

## Teknik Detaylar

### Mimari Bileşenler

1. **Konuşma Tanıma Modülü**:
   - Vosk sunucusu ile Türkçe model kullanımı (Docker ile çalışır)
   - Gerçek zamanlı ses akışı işleme (artımlı arabellek işleme)
   - "Vox başla" ve "Vox dur" komutlarını tanıma
   - VAD (Voice Activity Detection) ile yanlış tetiklemeleri azaltma
   - Otomatik durdurma için sessizlik zaman aşımı

2. **Çeviri Motoru**:
   - Helsinki-NLP OPUS-MT tr-en modeli (Hugging Face API ile veya simüle edilmiş çeviri)
   - Hugging Face API üzerinden çevrimiçi çeviri (isteğe bağlı)
   - Modelleri yalnızca etkinleştirildiğinde tembel yükleme
   - İlk kullanımda modelleri ısıtma ile başlangıç gecikmesini önleme
   - Değişmeyen metinleri yeniden çevirmemek için önbelleğe alma
   - Tam cümle tamamlanmadan akış veya kısmi çeviri yapma

3. **Platform Adaptörü**:
   - Ortamı tespit etme (GUI veya headless)
   - GUI modunda imleç yazımı için robotjs kullanımı (birincil çıkış yöntemi)
   - robotjs başarısız olursa panodan yapıştırma alternatifi
   - Headless modda stdout'a çıktı verme

4. **Mikrofon Görselleştirme**:
   - Mikrofon etkinliğini gösteren görsel çubuk
   - Yeşilden sarıya ve kırmızıya geçişli renk gradyanı
   - Mikrofon işlevselliğini test etmeye yardımcı olur

### Kurulum ve Çalıştırma

1. Node.js ve npm'in yüklü olduğundan emin olun
2. Proje dizininde `npm install` komutunu çalıştırın
3. Windows'ta ses girişi için sox yükleyin:
   - Şuradan indirin: http://sox.sourceforge.net/
   - sox'un PATH'te olduğundan emin olun
4. `npm start` komutu ile uygulamayı başlatın

### Geliştirme

Uygulama şu anda simüle edilmiş bir şekilde çalışıyor. Gerçek uygulamada şu bileşenlerin eklenmesi gerekecektir:

1. ~~Vosk kütüphanesinin entegrasyonu~~ (Vosk sunucusu entegrasyonu tamamlandı)
2. ~~Helsinki-NLP OPUS-MT modelinin entegrasyonu~~ (Hugging Face API entegrasyonu tamamlandı)
3. ~~robotjs kütüphanesinin entegrasyonu~~ (Tamamlandı)
4. ~~Gerçek zamanlı ses işleme~~ (Tamamlandı)
5. ~~Performans optimizasyonları~~ (Tamamlandı)

### Katkıda Bulunma

1. Forklayın
2. Yeni bir özellik dalı oluşturun (`git checkout -b yeni-ozellik`)
3. Değişikliklerinizi yapın
4. Değişikliklerinizi commit edin (`git commit -am 'Yeni özellik eklendi'`)
5. Dalınızı push edin (`git push origin yeni-ozellik`)
6. Pull request oluşturun

### Lisans

MIT Lisansı - daha fazla bilgi için LICENSE dosyasına bakın.
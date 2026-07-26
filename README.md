# 📈 BIST 14 Hisse ROIC & ROE Canlı Finansal Takip & KAP İkaz Terminali

Borsa İstanbul (BIST) bünyesindeki 14 seçkin şirketin (`EGEEN`, `CLEBI`, `FROTO`, `BRSAN`, `CCOLA`, `OTKAR`, `ISMEN`, `PGSUS`, `ANSGR`, `LOGO`, `LKMNH`, `ALKA`, `SODSN`, `ALTNY`) **8 çeyreklik tarihsel sermaye verimliliklerini (ROIC/ROE)**, **DuPont analizlerini**, **bilesik Sihirli Formül (Magic Formula) sıralamalarını**, **TradingView canlı borsa fiyat akışını** ve **Yapay Zeka (Gemini 2.5 Flash) destekli Telegram KAP ikaz bildirimlerini** tek bir kurumsal panoda sunan gelişmiş web terminalidir.

---

## 🌟 Öne Çıkan Özellikler

- **🎯 Özel 1-14 Hisse Sıralaması & Kilitli Canlı BIST Fiyatları**: Borsa İstanbul gerçek borsa kapanış ve anlık fiyatlarıyla senkronize tablo.
- **📊 Tarihsel 8 Çeyreklik Isı Haritası (Heatmap Matrix)**: 2024/Q2'den 2026/Q1'e kadar olan bilanço çeyreklerinde ROIC ve ROE değişim trendleri.
- **💼 Kişisel Portföy Yönetimi & Ağırlıklı ROIC**: Lot adetlerinizi ve maliyetlerinizi girerek portföy kâr/zararınızı ve **portföyünüzün toplam ağırlıklı ROIC verimini** hesaplama.
- **🎯 Özel Alarm & Eşik Kuralı Oluşturucu**: Kendi belirlediğiniz kriterlere göre (Örn: ROIC ≥ %35, F/K ≤ 8) otomatik renkli uyarı rozetleri basma.
- **📱 Telegram Canlı Anlık İkaz Botu**: Yeni KAP haberleri ve verimlilik değişimleri gerçekleştiğinde telefonunuza anında Türkçe Telegram bildirimi gönderme.
- **📈 TradingView Entegrasyonu**: BIST hisselerinin canlı grafik ve derinliklerine tek tıkla resmi bağlantı.
- **🌙 Açık / Koyu Tema Desteği**: Yönetici Açık Mod (Executive Light) ve Gece Koyu Mod (Dark Theme) arasında dinamik geçiş.

---

## 🛠️ Kullanılan Teknolojiler

- **Frontend**: HTML5, Vanilla JavaScript (ES6+), CSS3 (Custom Design Tokens), Lucide Icons, Chart.js.
- **Backend / Automation**: Python 3.12+, Yahoo Finance API (`yfinance`), Telegram Bot API.
- **Yapay Zeka**: Gemini 2.5 Flash (Faaliyet Raporu & KAP Analizi).

---

## 🚀 Hızlı Başlangıç & Kurulum

### 1. Web Arayüzünü Çalıştırma

Projeyi bilgisayarınızda açmak için terminalde aşağıdaki komutu çalıştırabilirsiniz:

```bash
python -m http.server 8080
```

Ardından tarayıcınızdan **`http://localhost:8080`** adresine gidin.

### 2. Python Otomasyon ve Telegram Botunu Başlatma

```bash
# Bağımlılıkları yükleyin
pip install -r python/requirements.txt

# Canlı fiyat tarayıcıyı çalıştırın
python python/kap_scraper.py

# Telegram test bildirimini gönderin
python python/telegram_notifier.py --test
```

---

## 📝 Lisans

Bu proje MIT Lisansı ile lisanslanmıştır.

